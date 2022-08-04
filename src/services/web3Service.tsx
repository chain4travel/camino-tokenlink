import {ethers, providers} from "ethers";
import coinlinkFactory from '@coinlink/contracts/CoinlinkFactory.json';

let networkId = '5777';
export type Networks = Partial<Record<string, { address: string }>>;

export const deployCoinlink = async (salt: number, initialAmount: string, provider: ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc) => {
    const signer = new providers.Web3Provider(provider).getSigner();
    const contract = new ethers.Contract((coinlinkFactory.networks as Networks)[networkId]?.address as string, coinlinkFactory.abi, signer);
    return contract.deploy(salt, ethers.utils.parseEther(initialAmount));
}


export const getCoinlinkFactoryInitialAmount = (provider: ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc) => {
    const signer = new providers.Web3Provider(provider).getSigner();
    const contract = new ethers.Contract((coinlinkFactory.networks as Networks)[networkId]?.address as string, coinlinkFactory.abi, signer);
    return contract.vars(0);
}
