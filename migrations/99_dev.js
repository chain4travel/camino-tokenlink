const CoinlinkFactory = artifacts.require("CoinlinkFactory");
const Camino = artifacts.require("Camino");

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(Camino);
    const camino = await Camino.deployed();
    const coinLinkFactory = await CoinlinkFactory.deployed();
    console.log(web3.utils.toWei('100', 'ether'))
    await camino.transferFrom(camino.address, accounts[0], web3.utils.toWei('100', 'ether'));
    await camino.approve(coinLinkFactory.address, web3.utils.toWei('100', 'ether'));
    await camino.transferFrom(camino.address, coinLinkFactory.address, web3.utils.toWei('100', 'ether'));
};