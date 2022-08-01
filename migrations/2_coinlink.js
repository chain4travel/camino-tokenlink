const CoinlinkFactory = artifacts.require("CoinlinkFactory");

module.exports = async function (deployer) {
    await deployer.deploy(CoinlinkFactory);
};