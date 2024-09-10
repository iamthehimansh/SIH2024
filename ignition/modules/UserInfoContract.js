const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("UserInfoContract", (m) => {
    const userInfoContract = m.contract("UserInfoContract", []);

    return { userInfoContract };
});