"use client";

import { useState, useEffect } from "react";
import { Button, Input, Modal, Typography, message } from "antd";
import { ArrowDownOutlined } from "@ant-design/icons";
import Image from "next/image";
import Web3 from "web3";
import Link from "next/link";
import UTOPV3SaleABI from "../../../../lib/UTOPV3SaleABI.json";

const { Title, Text } = Typography;

// Contract and token addresses (Polygon Mainnet)
const SALE_CONTRACT_ADDRESS = "0xBa5960bC268c9fCCD4C5890Ba318501262E3DbA2";
const USDT_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // Polygon USDT
const BNB_ADDRESS = "0xA6493256614a95bC9e45eF90b2fA920c0D2AdbF2"; // Wrapped BNB (verify!)
const UTOPV3_ADDRESS = "0x0946C90058cE01d734B9e770FFCfD0C029F83709"; // UTOPV3

// ERC-20 ABI for token interactions
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const paymentTokens = [
  { symbol: "USDT", name: "Tether USD", address: USDT_ADDRESS, decimals: 6 },
  { symbol: "POL", name: "Polygon", address: "0x0", decimals: 18 }, // 0x0 for native POL
  { symbol: "BNB", name: "Binance Coin", address: BNB_ADDRESS, decimals: 18 },
];

const UTOPV3_TOKEN = { symbol: "UTOP", name: "Utopos V3", address: UTOPV3_ADDRESS, decimals: 18 };

export default function BuyForm() {
  const [paymentToken, setPaymentToken] = useState(paymentTokens[0]); // Default to USDT
  const [toToken] = useState(UTOPV3_TOKEN);
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState<string | null>(null);
  const [utopAmount, setUtopAmount] = useState<string>("0");
  const [modalVisible, setModalVisible] = useState(false);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState(false);
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
    if (!web3 || !account || !amount) {
      message.error("Connect wallet and enter an amount");
      return;
    }
    if (paymentToken.address === "0x0") {
      setIsApproved(true); // POL doesn't need approval
      return;
    }
    setLoading(true);
    const tokenContract = new web3.eth.Contract(ERC20_ABI, paymentToken.address);
    const weiAmount = web3.utils.toWei(amount, paymentToken.decimals === 6 ? "mwei" : "ether");

    try {
      const balance = await tokenContract.methods.balanceOf(account).call() as string; // Type assertion to string
      if (BigInt(balance) < BigInt(weiAmount)) {
        message.error("Insufficient balance");
        setLoading(false);
        return;
      }
      await tokenContract.methods.approve(SALE_CONTRACT_ADDRESS, weiAmount).send({ from: account });
      setIsApproved(true);
      message.success("Approved! Now click Buy");
    } catch (error) {
      message.error(`Error: ${(error as Error).message}`);
    }
    setLoading(false);
  };

  const handleBuy = async () => {
    if (!web3 || !account || !amount) return;
    setLoading(true);
    const saleContract = new web3.eth.Contract(UTOPV3SaleABI, SALE_CONTRACT_ADDRESS);
    const weiAmount = web3.utils.toWei(amount, paymentToken.decimals === 6 ? "mwei" : "ether");

    try {
      if (paymentToken.address === "0x0") {
        await saleContract.methods.buyWithPOL().send({ from: account, value: weiAmount });
      } else if (paymentToken.symbol === "USDT") {
        await saleContract.methods.buyWithUSDT(weiAmount).send({ from: account });
      } else if (paymentToken.symbol === "BNB") {
        await saleContract.methods.buyWithBNB(weiAmount).send({ from: account });
      }
      message.success(`Successfully purchased ${utopAmount} UTOPV3!`);
      setAmount("");
      setIsApproved(false);
    } catch (error) {
      message.error(`Error: ${(error as Error).message}`);
    }
    setLoading(false);
  };

  const handleMaxClick = () => {
    if (balance) setAmount(balance);
  };

  useEffect(() => {
    if (web3 && account) {
      // Inline fetchBalance
      const fetchBalance = async () => {
        try {
          if (paymentToken.address === "0x0") {
            const bal = await web3.eth.getBalance(account);
            setBalance(web3.utils.fromWei(bal, "ether"));
          } else {
            const contract = new web3.eth.Contract(ERC20_ABI, paymentToken.address);
            const bal = await contract.methods.balanceOf(account).call();
            setBalance(web3.utils.fromWei(Number(bal), paymentToken.decimals === 6 ? "mwei" : "ether"));
          }
        } catch (error) {
          console.error("Balance fetch error:", error);
          setBalance("0");
        }
      };
      fetchBalance();
    }
  }, [paymentToken, account, web3]);

  useEffect(() => {
    if (web3 && amount) {
      // Inline fetchUtopAmount
      const fetchUtopAmount = async () => {
        if (!amount || amount === "0") {
          setUtopAmount("0");
          return;
        }
        const contract = new web3.eth.Contract(UTOPV3SaleABI, SALE_CONTRACT_ADDRESS);
        try {
          const weiAmount = web3.utils.toWei(amount, paymentToken.decimals === 6 ? "mwei" : "ether");
          const utopWei = await contract.methods.getUtopAmount(paymentToken.address, weiAmount).call();
          setUtopAmount(web3.utils.fromWei(Number(utopWei), "ether"));
        } catch (error) {
          console.error("UTOP amount fetch error:", error);
          setUtopAmount("0");
        }
      };
      fetchUtopAmount();
    } else {
      setUtopAmount("0");
    }
  }, [amount, paymentToken, web3]);

  const openTokenModal = () => setModalVisible(true);
  const handleTokenSelect = (token: typeof paymentTokens[0]) => {
    setPaymentToken(token);
    setModalVisible(false);
    setIsApproved(token.address === "0x0"); // Reset approval for non-POL tokens
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 p-4">
      <div className="max-w-md mx-auto py-6">
        <div className="header text-center">
          <h1 className="text-5xl text-white font-regular">Buy UTOP Tokens</h1>
        </div>
      </div>
      <div className="bg-[#252525] p-6 rounded-2xl w-full max-w-md">
        <Title level={4} className="text-center text-white mb-4">
          Purchase
        </Title>

        {/* Payment Token Input */}
        <div className="bg-transparent p-4 rounded-xl border border-gray-500">
          <div className="flex justify-between items-center">
            <Button
              onClick={openTokenModal}
              shape="round"
              className="flex bg-transparent items-center gap-2 border-1 text-white hover:bg-black shadow-none"
              disabled={!account}
            >
              <Image src="/assets/img/icon.png" width={70} height={70} alt={paymentToken.symbol} className="w-8 h-8" />
              <Text className="text-white" strong>
                {paymentToken.name}
              </Text>
            </Button>
            <Input
              placeholder="0.0"
              size="large"
              value={amount}
              variant="borderless"
              onChange={(e) => setAmount(e.target.value)}
              className="text-right text-white border-none text-lg w-1/2 placeholder-white"
              disabled={!account}
            />
          </div>
          {account && balance && (
            <div className="flex justify-between pt-2">
              <Text className="text-gray-400 text-sm">
                Balance: {balance} {paymentToken.symbol}
              </Text>
              <Link
                href="#"
                className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-xl text-sm hover:bg-blue-500/20"
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

        {/* UTOPV3 Output */}
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
              value={utopAmount}
              size="large"
              variant="borderless"
              className="text-right text-white border-none text-lg w-1/2 placeholder-white"
              disabled
            />
          </div>
          <div className="w-full text-right">
            <Text className="text-gray-400 text-sm">Receiving amount</Text>
          </div>
        </div>

        {/* Connect Wallet / Approve / Buy Button */}
        {!account ? (
          <Button
            type="primary"
            shape="round"
            size="large"
            block
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-black font-bold text-lg py-3"
            onClick={connectWallet}
          >
            Connect Wallet
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
            disabled={!amount}
          >
            Approve
          </Button>
        ) : (
          <Button
            type="primary"
            shape="round"
            size="large"
            block
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-black font-bold text-lg py-3"
            onClick={handleBuy}
            loading={loading}
            disabled={!amount}
          >
            Buy
          </Button>
        )}

        {/* Token Selection Modal */}
        <Modal
          title="Select Payment Token"
          width={350}
          centered
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <p className="mb-6">Choose a token to buy UTOPV3</p>
          <div className="space-y-2 flex flex-col gap-2">
            {paymentTokens.map((token) => (
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
        <p>Use USDT, POL, or BNB to purchase UTOPV3 tokens securely on Polygon.</p>
      </div>
    </div>
  );
}