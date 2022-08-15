const {upgradeProxy} = require('@openzeppelin/truffle-upgrades');
const CoinlinkFactory = artifacts.require("CoinlinkFactory");
const ExampleNft = artifacts.require("ExampleNft");

module.exports = async function (deployer, network, accounts) {
    const coinlinkFactory = await upgradeProxy(CoinlinkFactory.address, CoinlinkFactory, {deployer});
    await coinlinkFactory.send(web3.utils.toWei('10', 'ether'));
    const exampleNft = await deployer.deploy(ExampleNft);
    await exampleNft.safeMint(accounts[0]);
};