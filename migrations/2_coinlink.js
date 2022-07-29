const CoinlinkFactory = artifacts.require("CoinlinkFactory");

module.exports = function (deployer) {
    deployer.deploy(CoinlinkFactory);
};