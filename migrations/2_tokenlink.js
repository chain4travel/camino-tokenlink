const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const TokenlinkFactory = artifacts.require("TokenlinkFactory");

module.exports = async function (deployer) {
    await deployProxy(TokenlinkFactory, [], {deployer});
};