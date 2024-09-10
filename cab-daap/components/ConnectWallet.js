"use client";
import { requestAccount } from "@/lib/ContractServices";

export default function ConnectWallet({ setAccount }) {
    const connectWallet = async () => {
        try {
          const account = await requestAccount();
          setAccount(account);
        } catch (error) {
          console.error("Failed to connect wallet:", error);
        }
    };
    return (
        <button
            onClick={connectWallet}
            className="px-6 py-3 text-lg font-semibold text-white transition-all duration-200 ease-in-out bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
            Connect Wallet
        </button>
    );
}