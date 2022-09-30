const {upgradeProxy} = require('@openzeppelin/truffle-upgrades');
const TokenlinkFactory = artifacts.require("TokenlinkFactory");

module.exports = async function (deployer) {
    await upgradeProxy(TokenlinkFactory.address, TokenlinkFactory, {deployer});
};