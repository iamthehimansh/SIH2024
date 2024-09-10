const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
require("dotenv").config();

const userInfoContractAddress = process.env.USER_INFO_CONTRACT_ADDRESS;
module.exports = buildModule("RideRequestContract", (m) => {

  const rideRequestContract = m.contract("RideRequestContract", [userInfoContractAddress]);

  return { rideRequestContract };
});