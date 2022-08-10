import {ethers, providers} from "ethers";
import coinlinkFactory from '@coinlink/contracts/CoinlinkFactory.json';
import coinlink from '@coinlink/contracts/Coinlink.json';
import account from '@coinlink/contracts/Account.json';

let networkId = '5777';
export type Networks = Partial<Record<string, { address: string }>>;

export const deployCoinlink = async (initialAmount: string, provider: ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc) => {
    const signer = new providers.Web3Provider(provider).getSigner();
    const contract = new ethers.Contract((coinlinkFactory.networks as Networks)[networkId]?.address as string, coinlinkFactory.abi, signer);
    return await contract.deploy(ethers.utils.parseEther(initialAmount));
}


export const getCoinlinkFactoryInitialAmount = async (provider: ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc) => {
    const signer = new providers.Web3Provider(provider).getSigner();
    const contract = new ethers.Contract((coinlinkFactory.networks as Networks)[networkId]?.address as string, coinlinkFactory.abi, signer);
    return await contract.vars(0);
}

export const getDeployedCoinlinks = async (provider: ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc) => {
    const signer = new providers.Web3Provider(provider).getSigner();
    const contract = new ethers.Contract((coinlinkFactory.networks as Networks)[networkId]?.address as string, coinlinkFactory.abi, signer);
    return (await contract.getDeployedContracts()).map((address: string) => {
        return new ethers.Contract(address, coinlink.abi, signer);
    });
}

export const deployAccount = async (coinlinkContract: ethers.Contract) => {
    return coinlinkContract.deploy();
}

export const getDeployedAccounts = async (coinlinkContract: ethers.Contract, provider: ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc) => {
    const signer = new providers.Web3Provider(provider).getSigner();
    return (await coinlinkContract.getDeployedContracts()).map((address: string) => {
        return new ethers.Contract(address, account.abi, signer);
    });
}
