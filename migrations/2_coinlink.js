const {deployProxy} = require('@openzeppelin/truffle-upgrades');
const Coinlink = artifacts.require("Coinlink");

module.exports = async function (deployer) {
    await deployProxy(Coinlink, [], {deployer});
};