const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const CoinlinkFactory = artifacts.require("CoinlinkFactory");

module.exports = async function (deployer) {
    await deployProxy(CoinlinkFactory, [], {deployer});
};