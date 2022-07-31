const CoinlinkFactory = artifacts.require("CoinlinkFactory");
const Camino = artifacts.require("Camino");

module.exports = function (deployer) {
    deployer.deploy(Camino);
    deployer.deploy(CoinlinkFactory);
};