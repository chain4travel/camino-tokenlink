const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const CoinlinkFactory = artifacts.require("CoinlinkFactory");
const Camino = artifacts.require("Camino");

module.exports = async function (deployer) {
    const camino = await Camino.deployed();
    await deployProxy(CoinlinkFactory, [camino.address], {deployer});
};