import {ethers, providers} from "ethers";
import coinlinkFactory from '@coinlink/contracts/CoinlinkFactory.json';

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
