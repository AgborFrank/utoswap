"use client";

import { useState, useEffect } from "react";
import { Button, Input, Modal, Typography, message } from "antd";
import { ArrowDownOutlined } from "@ant-design/icons";
import Image from "next/image";
import Web3 from "web3";
import { UTOPV3_ADDRESS, UTOPV1_ADDRESS, UTOPV2_ADDRESS, UTOPV3_ABI, ERC20_ABI } from "../../../../../lib/contracts";
import Link from "next/link";
import { useTranslations } from "next-intl";

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
  const [account, setAccount] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [hasMigrated, setHasMigrated] = useState(false);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
        const chainId = Number(await web3Instance.eth.getChainId());
        if (chainId !== 137) {
          message.error("Please switch to Polygon Mainnet");
          return;
        }
      } catch (error) {
        message.error(`Error: ${(error as Error).message}`);
      }
    } else {
      message.error("Please install MetaMask");
    }
  };

  const handleApprove = async () => {
    if (!web3 || !account || !fromAmount) {
      message.error("Connect wallet and enter an amount");
      return;
    }
    setLoading(true);
    const oldTokenContract = new web3.eth.Contract(ERC20_ABI, fromToken.address);
    const weiAmount = web3.utils.toWei(fromAmount, "ether");

    try {
      const balance = await oldTokenContract.methods.balanceOf(account).call() as string; // Type assertion to string
      if (BigInt(balance) < BigInt(weiAmount)) {
        message.error("Insufficient balance");
        setLoading(false);
        return;
      }
      await oldTokenContract.methods.approve(UTOPV3_ADDRESS, weiAmount).send({ from: account });
      setIsApproved(true);
      message.success("Approved! Now click Migrate");
    } catch (error) {
      message.error(`Error: ${(error as Error).message}`);
    }
    setLoading(false);
  };

  const handleMigration = async () => {
    if (!web3 || !account || !fromAmount) return;
    setLoading(true);
    const contract = new web3.eth.Contract(UTOPV3_ABI, UTOPV3_ADDRESS);
    const method = fromToken.name === "Utopos V1" ? "migrateFromV1" : "migrateFromV2";
    const weiAmount = web3.utils.toWei(fromAmount, "ether");

    try {
      await contract.methods[method](weiAmount).send({ from: account });
      message.success(`Successfully migrated ${fromAmount} UTOP to V3!`);
      setIsApproved(false);
      setFromAmount("");
    } catch (error) {
      message.error(`Error: ${(error as Error).message}`);
    }
    setLoading(false);
  };

  const handleMaxClick = () => {
    if (balance) {
      setFromAmount(balance);
    }
  };

  useEffect(() => {
    if (web3 && account) {
      // Inline fetchBalance
      const fetchBalance = async () => {
        const contract = new web3.eth.Contract(ERC20_ABI, fromToken.address);
        try {
          const bal = await contract.methods.balanceOf(account).call();
          setBalance(web3.utils.fromWei(bal.toString(), "ether"));
        } catch (error) {
          console.error("Balance fetch error:", error);
          setBalance("0");
        }
      };

      // Inline checkMigrationStatus
      const checkMigrationStatus = async () => {
        const contract = new web3.eth.Contract(UTOPV3_ABI, UTOPV3_ADDRESS);
        const method = fromToken.name === "Utopos V1" ? "hasMigratedV1" : "hasMigratedV2";
        try {
          const migrated = await contract.methods[method](account).call();
          setHasMigrated(migrated);
        } catch (error) {
          console.error("Migration status check error:", error);
          setHasMigrated(false);
        }
      };

      fetchBalance();
      checkMigrationStatus();
    }
  }, [fromToken, account, web3]);

  const openTokenModal = () => {
    setModalVisible(true);
  };

  const handleTokenSelect = (token: typeof tokenList[0]) => {
    setFromToken(token);
    setModalVisible(false);
  };

  return (
    <>
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
              color="primary"
              className="flex bg-cta/20 items-center gap-2 border-none text-white hover:bg-black shadow-none"
              disabled={hasMigrated || !account}
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
              disabled={!account || hasMigrated}
            />
          </div>
          {account && balance && (
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
        {!account ? (
          <Button
            type="primary"
            shape="round"
            size="large"
            block
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-black font-bold text-lg py-3"
            onClick={connectWallet}
          >
            {t("wconnect")}
          </Button>
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
            disabled={!fromAmount}
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
            disabled={!fromAmount}
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
    </>
  );
}