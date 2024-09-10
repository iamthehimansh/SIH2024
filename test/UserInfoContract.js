const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");

describe("UserInfoContract", function () {
    async function userRegistration() {
        const [owner, otherAccount] = await ethers.getSigners();
    }
});