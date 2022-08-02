const {upgradeProxy} = require('@openzeppelin/truffle-upgrades');
const Coinlink = artifacts.require("Coinlink");
const Camino = artifacts.require("Camino");

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(Camino);
    const camino = await Camino.deployed();
    const coinlink = await upgradeProxy(Coinlink.address, Coinlink, {deployer});
    await camino.transferFrom(camino.address, accounts[0], web3.utils.toWei('100', 'ether'));
    await camino.approve(coinlink.address, web3.utils.toWei('100', 'ether'));
    await camino.transferFrom(camino.address, coinlink.address, web3.utils.toWei('100', 'ether'));
};