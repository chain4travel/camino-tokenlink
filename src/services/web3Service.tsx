import {BigNumber, ethers} from "ethers";
import coinlinkFactory from '@coinlink/contracts/CoinlinkFactory.json';
import coinlink from '@coinlink/contracts/Coinlink.json';
import account from '@coinlink/contracts/Account.json';
import exampleNft from '@coinlink/contracts/ExampleNft.json';

let networkId = '5777';
export type Networks = Partial<Record<string, { address: string }>>;

export const deployCoinlink = async (signer: ethers.Signer) => {
    const contract = new ethers.Contract((coinlinkFactory.networks as Networks)[networkId]?.address as string, coinlinkFactory.abi, signer);
    const tx = await contract.deploy();
    return tx.wait();
}

export const saveCoinlinkFactoryVariable = async (key: string, value: string | BigNumber, signer: ethers.Signer) => {
    const contract = new ethers.Contract((coinlinkFactory.networks as Networks)[networkId]?.address as string, coinlinkFactory.abi, signer);
    const tx = await contract.setVar(key, value);
    return tx.wait();
}

export const saveCoinlinkVariable = async (contract: ethers.Contract, key: string, value: string | BigNumber) => {
    const tx = await contract.setVar(key, value);
    return tx.wait();
}

export const getCoinlinkFactoryBalance = async (provider: ethers.providers.Web3Provider) => {
    return provider.getBalance((coinlinkFactory.networks as Networks)[networkId]?.address as string);
}

export const getCoinlinkFactoryAddress = () => {
    return (coinlinkFactory.networks as Networks)[networkId]?.address as string;
}

export const getCoinlinkFactoryInitialAmount = (signer: ethers.Signer) => {
    const contract = new ethers.Contract((coinlinkFactory.networks as Networks)[networkId]?.address as string, coinlinkFactory.abi, signer);
    return contract.vars(0);
}

export const getDeployedCoinlinks = async (signer: ethers.Signer) => {
    const contract = new ethers.Contract((coinlinkFactory.networks as Networks)[networkId]?.address as string, coinlinkFactory.abi, signer);
    return (await contract.getDeployedContracts()).map((address: string) => {
        return new ethers.Contract(address, coinlink.abi, signer);
    });
}

export const getOwnedAccounts = async (signer: ethers.Signer) => {
    const coinlinks = await getDeployedCoinlinks(signer);
    let accounts = await Promise.all(coinlinks.map(async (coinlink: any) => {
        return (await coinlink.getDeployedContracts()).map((address: string) => {
            return new ethers.Contract(address, account.abi, signer);
        });
    }));
    accounts = accounts.flat(Infinity);
    console.log(accounts);
    return accounts;
}

export const deployAccount = async (coinlinkContract: ethers.Contract) => {
    const tx = await coinlinkContract.deploy();
    return tx.wait();
}

export const getNfts = async (accountContract: ethers.Contract) => {
    return accountContract.getNfts((exampleNft.networks as Networks)[networkId]?.address as string);
}

export const getWalletNfts = async (signer: ethers.Signer, account: string) => {
    const nfts = [];
    const nftContract = new ethers.Contract((exampleNft.networks as Networks)[networkId]?.address as string, exampleNft.abi, signer);
    const balance = await nftContract.balanceOf(account);
    for (let i = 0; i < balance; i++) {
        const nft = await nftContract.tokenOfOwnerByIndex(account, i);
        nfts.push(nft);
        console.log(nft);
    }
    return nfts;
}

export const retrieveNfts = async (accountContract: ethers.Contract) => {
    return accountContract.retrieveNfts((exampleNft.networks as Networks)[networkId]?.address as string);
}

export const changeAccountOwner = async (accountContract: ethers.Contract, newOwner: string) => {
    const tx = await accountContract.changeOwner(newOwner);
    return tx.wait();
}

export const changeCoinlinkOwner = async (coinlinkContract: ethers.Contract, newOwner: string) => {
    const tx = await coinlinkContract.changeOwner(newOwner);
    return tx.wait();
}

export const getDeployedAccounts = async (coinlinkContract: ethers.Contract, signer: ethers.Signer) => {
    return (await coinlinkContract.getDeployedContracts()).map((address: string) => {
        return new ethers.Contract(address, account.abi, signer);
    });
}
