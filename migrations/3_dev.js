const {upgradeProxy} = require('@openzeppelin/truffle-upgrades');
const TokenlinkFactory = artifacts.require("TokenlinkFactory");
const ExampleNft = artifacts.require("ExampleNft");

module.exports = async function (deployer, network, accounts) {
    const tokenlinkFactory = await upgradeProxy(TokenlinkFactory.address, TokenlinkFactory, {deployer});
    await tokenlinkFactory.send(web3.utils.toWei('10', 'ether'));
    const exampleNft = await deployer.deploy(ExampleNft);
    await exampleNft.safeMint(accounts[0]);
};