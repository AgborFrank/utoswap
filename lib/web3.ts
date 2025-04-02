import { ethers } from "ethers";

export const getProvider = () => {
  // Use ethers.BrowserProvider for ethers v6
  return new ethers.BrowserProvider(window.ethereum);
};

export const getSigner = async () => {
  const provider = getProvider();
  return await provider.getSigner(); // getSigner is async in ethers v6
};

export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function balanceOf(address account) public view returns (uint256)",
];

export const BRIDGE_ABI = [
  "function migrateFromV1(uint256 amount) public",
  "function migrateFromV2(uint256 amount) public",
  "event Migrated(address indexed user, uint256 amount, string version)",
];

export const bridgeAddress = "0xYourBridgeAddress";
export const v1TokenAddress = "0xYourV1TokenAddress";
export const v2TokenAddress = "0xYourV2TokenAddress";
export const v3TokenAddress = "0xYourV3TokenAddress";