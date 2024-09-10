"use client";

import { useState, useEffect } from "react";
import ConnectWallet from "@/components/ConnectWallet";
import { requestAccount,getUserInfo,initializeContracts } from "@/lib/ContractServices";
import GoogleLogin from "@/components/GoogleLogin";
export default function SignupLayout({ children }) {
    const [account, setAccount] = useState(null);
    const setAccountWithUserType = async (account) => {
        setAccount(account);
        const userInfo = await getUserInfo(account);
        localStorage.setItem("userType", Number(userInfo[2]) );
        localStorage.setItem("user",JSON.stringify({
          name:userInfo[0],
          contactDetails:userInfo[1],
          userType:Number(userInfo[2]),
          negativePoints:Number(userInfo[3]),
          isBlocked:userInfo[4]
        }));
    }
  useEffect(() => {
    initializeContracts();
    const fetchCurAccount = async () => {
      const account = await requestAccount();
      setAccountWithUserType(account);
    };
    // fetchCurAccount();
    setTimeout(fetchCurAccount, 100);
  }, []);

  useEffect(() => {
    const handleAccountChanged = (newAccounts) =>
      setAccountWithUserType(newAccounts.length > 0 ? newAccounts[0] : null);
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountChanged);
      
    }
    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountChanged);
    };
  });

  if (!account) {
    return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center ">
        
        <h1 className="mb-4 text-2xl font-bold text-gray-800">Welcome to Cab DAAP</h1>
        <p className="mb-6 text-gray-600">Please connect your wallet to continue</p>
        <ConnectWallet setAccount={setAccountWithUserType}  />
        <div className="flex justify-center mb-6">

        <GoogleLogin onLogin={setAccountWithUserType} />
        </div>
      </div>
    </div>)
  }


    return children;
}