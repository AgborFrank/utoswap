"use client";

import { useState, useEffect } from "react";
import { Button, Input, Modal, Typography, message } from "antd";
import { ArrowDownOutlined } from "@ant-design/icons";
import Image from "next/image";
import Web3 from "web3";
import { UTOPV3_ADDRESS, UTOPV1_ADDRESS, UTOPV2_ADDRESS, UTOPV3_ABI, ERC20_ABI } from "../../../../lib/contracts";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useChainId, useSwitchChain, useWriteContract, useWalletClient } from "wagmi";
import { useAppKitAccount } from "@reown/appkit/react";

const { Title, Text } = Typography;

const tokenList = [
  { symbol: "UTOP", name: "Utopos V1", address: UTOPV1_ADDRESS },
  { symbol: "UTOP", name: "Utopos V2", address: UTOPV2_ADDRESS },
];

const UTOPV3_TOKEN = { symbol: "UTOP", name: "Utopos V3", address: UTOPV3_ADDRESS };

export default function SwapForm() {
  const t = useTranslations("common.home.swap");
  const [fromToken, setFromToken] = useState(tokenList[0]);
  const [toToken] = useState(UTOPV3_TOKEN);
  const [fromAmount, setFromAmount] = useState("");
  const [balance, setBalance] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [hasMigrated, setHasMigrated] = useState(false);
  const [loading, setLoading] = useState(false);

  // Reown AppKit hook for account info
  const { address, isConnected } = useAppKitAccount();

  // Wagmi hooks
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { data: walletClient } = useWalletClient();

  // Initialize Web3 when wallet client is available
  useEffect(() => {
    if (walletClient) {
      const web3Instance = new Web3(walletClient.transport);
      setWeb3(web3Instance);
    }
  }, [walletClient]);

  // Fetch balance and migration status when connected
  useEffect(() => {
    if (web3 && address && chainId) {
      const fetchBalance = async () => {
        const contract = new web3.eth.Contract(ERC20_ABI, fromToken.address);
        try {
          const bal = await contract.methods.balanceOf(address).call();
          setBalance(web3.utils.fromWei(bal.toString(), "ether"));
        } catch (error) {
          console.error("Balance fetch error:", error);
          setBalance("0");
        }
      };

      const checkMigrationStatus = async () => {
        const contract = new web3.eth.Contract(UTOPV3_ABI, UTOPV3_ADDRESS);
        const method = fromToken.name === "Utopos V1" ? "hasMigratedV1" : "hasMigratedV2";
        try {
          const migrated = await contract.methods[method](address).call();
          setHasMigrated(migrated);
        } catch (error) {
          console.error("Migration status check error:", error);
          setHasMigrated(false);
        }
      };

      if (chainId !== 137) {
        message.error("Please switch to Polygon Mainnet");
        switchChain({ chainId: 137 });
      } else {
        fetchBalance();
        checkMigrationStatus();
      }
    }
  }, [web3, address, chainId, switchChain, fromToken]);

  const handleApprove = async () => {
    if (!web3 || !address || !fromAmount) {
      message.error("Connect wallet and enter an amount");
      return;
    }
    setLoading(true);
    const weiAmount = web3.utils.toWei(fromAmount, "ether");

    try {
      const oldTokenContract = new web3.eth.Contract(ERC20_ABI, fromToken.address);
      const balance = await oldTokenContract.methods.balanceOf(address).call() as string;
      if (BigInt(balance) < BigInt(weiAmount)) {
        message.error("Insufficient balance");
        setLoading(false);
        return;
      }

      await writeContractAsync({
        address: fromToken.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [UTOPV3_ADDRESS, weiAmount],
      });
      setIsApproved(true);
      message.success("Approved! Now click Migrate");
    } catch (error) {
      message.error(`Error: ${(error as Error).message}`);
    }
    setLoading(false);
  };

  const handleMigration = async () => {
    if (!web3 || !address || !fromAmount) {
      message.error("Connect wallet and enter an amount");
      return;
    }
    setLoading(true);
    const weiAmount = web3.utils.toWei(fromAmount, "ether");
    const method = fromToken.name === "Utopos V1" ? "migrateFromV1" : "migrateFromV2";

    try {
      await writeContractAsync({
        address: UTOPV3_ADDRESS as `0x${string}`,
        abi: UTOPV3_ABI,
        functionName: method,
        args: [weiAmount],
      });
      message.success(`Successfully migrated ${fromAmount} UTOP to V3!`);
      setIsApproved(false);
      setFromAmount("");
    } catch (error) {
      message.error(`Error: ${(error as Error).message}`);
    }
    setLoading(false);
  };

  const handleMaxClick = () => {
    if (balance) setFromAmount(balance);
  };

  const openTokenModal = () => setModalVisible(true);
  const handleTokenSelect = (token: typeof tokenList[0]) => {
    setFromToken(token);
    setModalVisible(false);
  };

  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen to-blue-900 p-4"
      style={{
        backgroundImage: "url('/assets/img/footer-gradient.webp')",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-md mx-auto py-6">
        <div className="header text-center">
          <h1 className="text-5xl text-white font-regular">{t("title")}</h1>
        </div>
      </div>
      <div className="bg-[#25252584] p-6 rounded-2xl w-full max-w-md">
        <Title level={4} className="text-center text-white mb-4">
          Swap
        </Title>

        {/* From Input */}
        <div className="bg-transparent p-4 rounded-xl border border-gray-500">
          <div className="flex justify-between items-center">
            <Button
              onClick={openTokenModal}
              shape="round"
              className="flex bg-transparent items-center gap-2 border-1 text-white hover:bg-black shadow-none"
              disabled={hasMigrated || !address}
            >
              <Image src="/assets/img/icon.png" width={70} height={70} alt={fromToken.symbol} className="w-8 h-8" />
              <Text className="text-white" strong>
                {fromToken.name}
              </Text>
            </Button>
            <Input
              placeholder="0.0"
              size="large"
              value={fromAmount}
              variant="borderless"
              onChange={(e) => setFromAmount(e.target.value)}
              className="text-right text-white border-none text-xl w-1/2 placeholder-white"
              disabled={!address || hasMigrated}
            />
          </div>
          {address && balance && (
            <div className="flex justify-between pt-2">
              <Text className="text-gray-400 text-sm">
                Balance: {balance} {fromToken.symbol}
              </Text>
              <Link
                href="#"
                className="bg-cta/10 text-cta px-3 py-1 rounded-xl text-sm hover:bg-blue-500/20"
                onClick={(e) => {
                  e.preventDefault();
                  handleMaxClick();
                }}
              >
                Max
              </Link>
            </div>
          )}
        </div>

        {/* Swap Icon */}
        <div className="flex justify-center my-2">
          <Button
            shape="circle"
            icon={<ArrowDownOutlined />}
            className="shadow-lg bg-[#222] text-xl border-none text-white"
            disabled
          />
        </div>

        {/* To Input */}
        <div className="bg-transparent p-4 rounded-xl border border-gray-500">
          <div className="flex justify-between items-center">
            <Button
              shape="round"
              className="flex items-center gap-2 border-none rounded-full shadow-none text-white"
              disabled
            >
              <Image src="/assets/img/icon.png" width={60} height={60} alt={toToken.symbol} className="w-8 h-8" />
              <Text className="text-white" strong>
                {toToken.name}
              </Text>
            </Button>
            <Input
              placeholder="0.0"
              value={fromAmount}
              size="large"
              variant="borderless"
              className="text-right text-white border-none text-xl w-1/2 placeholder-white"
              disabled
            />
          </div>
          <div className="w-full text-right">
            <Text className="text-gray-400 text-sm">{t("rAmt")}</Text>
          </div>
        </div>

        {/* Connect Wallet / Approve / Migrate Button */}
        {!isConnected ? (
          <div className="mt-4">
            <appkit-button /> {/* Reown's Connect Wallet button */}
          </div>
        ) : hasMigrated ? (
          <Button
            type="primary"
            shape="round"
            size="large"
            block
            className="mt-4 bg-gray-500 text-black font-bold text-lg py-3"
            disabled
          >
            {t("migrated")}
          </Button>
        ) : !isApproved ? (
          <Button
            type="primary"
            shape="round"
            size="large"
            block
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-black font-bold text-lg py-3"
            onClick={handleApprove}
            loading={loading}
            disabled={!fromAmount || chainId !== 137}
          >
            {t("approve")}
          </Button>
        ) : (
          <Button
            type="primary"
            shape="round"
            size="large"
            block
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-black font-bold text-lg py-3"
            onClick={handleMigration}
            loading={loading}
            disabled={!fromAmount || chainId !== 137}
          >
            {t("migrate")}
          </Button>
        )}

        {/* Token Selection Modal */}
        <Modal
          title="Select a UTOP token"
          width={350}
          centered
          open={modalVisible}
          mask={true}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <p className="mb-6">Select your holding token to migrate to upgraded UTOP V3</p>
          <div className="space-y-2 flex flex-col gap-2">
            {tokenList.map((token) => (
              <Button
                key={token.address}
                block
                className="flex justify-between items-center p-2 text-lg"
                onClick={() => handleTokenSelect(token)}
              >
                <div className="flex items-center gap-2">
                  <Image src="/assets/img/icon.png" width={80} height={80} alt={token.symbol} className="w-9 h-9" />
                  {token.name}
                </div>
                <Text>{token.symbol}</Text>
              </Button>
            ))}
          </div>
        </Modal>
      </div>
      <div className="bottom text-gray-300 text-sm text-center p-2 max-w-md pt-8">
        <p>{t("bottom")}</p>
      </div>
    </div>
  );
}