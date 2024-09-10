import React from 'react';
import Image from 'next/image';
import {requestAccount} from "@/lib/ContractServices"
const GoogleLogin = ({ onLogin }) => {
  const handleLogin = () => {
    // Simulate a login process
    // setTimeout(() => {
    //   onLogin({ name: 'John Doe', email: 'johndoe@example.com' });
    // }, 1000);
    const connectWallet = async () => {
        try {
          const account = await requestAccount();
          onLogin(account);
        } catch (error) {
          console.error("Failed to connect wallet:", error);
        }
    };
    connectWallet();
  };

  return (
    <button
      onClick={handleLogin}
      className="flex items-center justify-center bg-white text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      <Image
        src="/google.png"
        alt="Google Logo"
        width={20}
        height={20}
        className="mr-2"
      />
      Sign in with Google
    </button>
  );
};

export default GoogleLogin;
