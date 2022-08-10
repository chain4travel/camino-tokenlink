const {upgradeProxy} = require('@openzeppelin/truffle-upgrades');
const CoinlinkFactory = artifacts.require("CoinlinkFactory");

module.exports = async function (deployer) {
    const coinlinkFactory = await upgradeProxy(CoinlinkFactory.address, CoinlinkFactory, {deployer});
    await coinlinkFactory.send(web3.utils.toWei('50', 'ether'));
};