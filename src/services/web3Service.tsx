import {BigNumber, ethers, providers} from "ethers";
import coinlinkFactory from '@coinlink/contracts/CoinlinkFactory.json';
import coinlink from '@coinlink/contracts/Coinlink.json';
import account from '@coinlink/contracts/Account.json';

let networkId = '5777';
export type Networks = Partial<Record<string, { address: string }>>;

export const deployCoinlink = async (provider: ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc) => {
    const signer = new providers.Web3Provider(provider).getSigner();
    const contract = new ethers.Contract((coinlinkFactory.networks as Networks)[networkId]?.address as string, coinlinkFactory.abi, signer);
    const tx = await contract.deploy();
    return tx.wait();
}

export const saveCoinlinkFactoryVariable = async (key: string, value: string | BigNumber, provider: ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc) => {
    const signer = new providers.Web3Provider(provider).getSigner();
    const contract = new ethers.Contract((coinlinkFactory.networks as Networks)[networkId]?.address as string, coinlinkFactory.abi, signer);
    const tx = await contract.setVar(key, value);
    return tx.wait();
}

export const saveCoinlinkVariable = async (contract: ethers.Contract, key: string, value: string | BigNumber) => {
    const tx = await contract.setVar(key, value);
    return tx.wait();
}

export const getCoinlinkFactoryInitialAmount = (provider: ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc) => {
    const signer = new providers.Web3Provider(provider).getSigner();
    const contract = new ethers.Contract((coinlinkFactory.networks as Networks)[networkId]?.address as string, coinlinkFactory.abi, signer);
    return contract.vars(0);
}

export const getDeployedCoinlinks = async (provider: ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc) => {
    const signer = new providers.Web3Provider(provider).getSigner();
    const contract = new ethers.Contract((coinlinkFactory.networks as Networks)[networkId]?.address as string, coinlinkFactory.abi, signer);
    return (await contract.getDeployedContracts()).map((address: string) => {
        return new ethers.Contract(address, coinlink.abi, signer);
    });
}

export const deployAccount = async (coinlinkContract: ethers.Contract) => {
    const tx = await coinlinkContract.deploy();
    return tx.wait();
}

export const getDeployedAccounts = async (coinlinkContract: ethers.Contract, provider: ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc) => {
    const signer = new providers.Web3Provider(provider).getSigner();
    return (await coinlinkContract.getDeployedContracts()).map((address: string) => {
        return new ethers.Contract(address, account.abi, signer);
    });
}
