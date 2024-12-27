# MiN: Decentralized Cab Service - Web3 & Next.js

This repository contains the smart contracts and frontend code for a decentralized cab booking app built for Smart India Hackathon 2024 (Problem ID: 1589).

## Project Overview

**Project Title:** Decentralized Cab Service  
**Theme:** Blockchain & Cybersecurity  
**Team Name:** 5G Only  
**Category:** Software  
**Problem Statement Title:** STUDENT INNOVATION  
**Team Leader Name:** Himnsh raj

## Demo Video
[![Demo Video](https://img.shields.io/badge/Watch-Demo_Video-red)](MiN%20by%205G%20Only.mp4)

---

## Web3 - Smart Contracts

### Prerequisites
- Node.js (v16 or higher)
- Hardhat
- MetaMask or any Ethereum wallet
- dotenv (for environment configuration)

### Setup
1. **Install dependencies:**
    ```bash
    npm install
    ```

2. **Compile Smart Contracts:**
    ```bash
    npx hardhat compile
    ```

3. **Run Local Blockchain:**
    ```bash
    npx hardhat node
    ```

4. **Deploy Contracts:**
    - Deploy the Ride Request Contract:
      ```bash
      npx hardhat ignition deploy ./ignition/modules/RideRequestContract.js --network localhost
      ```
    
    - Copy the deployed contract address and update the .env file:
      ```properties
      RIDE_REQUEST_CONTRACT_ADDRESS=<contract_address>
      NEXT_PUBLIC_RIDE_REQUEST_CONTRACT_ADDRESS=<contract_address>
      ```

    - Deploy the User Info Contract:
      ```bash
      npx hardhat ignition deploy ./ignition/modules/UserInfoContract.js --network localhost
      ```
    
    - Update the .env file with the deployed contract address:
      ```properties
      USER_INFO_CONTRACT_ADDRESS=<contract_address>
      NEXT_PUBLIC_USER_INFO_CONTRACT_ADDRESS=<contract_address>
      ```

## Next.js - Frontend (cab-daap)

### Setup
1. **Navigate to Frontend Directory:**
    ```bash
    cd cab-daap
    ```

2. **Install Dependencies:**
    ```bash
    npm install
    ```

3. **Environment Configuration:**
    Create a `.env.local` file in the cab-daap directory and add:
    ```properties
    NEXT_PUBLIC_RIDE_REQUEST_CONTRACT_ADDRESS=<address_from_deployment>
    NEXT_PUBLIC_USER_INFO_CONTRACT_ADDRESS=<address_from_deployment>
    ```
    
    Note: Make sure to create this file specifically in the cab-daap directory, not in the root project folder.

4. **Run Development Server:**
    ```bash
    npm run dev
    ```

5. **Access the App:**
    Open http://localhost:3000 in your browser

## Technical Approach
- Blockchain: Ethereum (Layer 2 solutions like Polygon recommended)
- Smart Contracts: Written in Solidity
- Frontend: Next.js for UI, Web3.js for blockchain interaction
- Security: Regular smart contract audits and use of best practices to ensure contract integrity

## Key Features
- Decentralized Matching – Direct connection between riders and drivers
- Reduced Costs – Eliminates middleman commissions
- Security – Transparent and tamper-proof transactions
- Escrow System – Funds are securely held during the ride process

## References
- Ethereum Whitepaper
- Smart Contract Best Practices