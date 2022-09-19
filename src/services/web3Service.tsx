import {BigNumber, ethers} from "ethers";
import tokenlinkFactory from '@tokenlink/contracts/TokenlinkFactory.json';
import tokenlink from '@tokenlink/contracts/Tokenlink.json';
import account from '@tokenlink/contracts/Account.json';
import exampleNft from '@tokenlink/contracts/ExampleNft.json';

let networkId = '5777';
export type Networks = Partial<Record<string, { address: string }>>;

export const deployTokenlink = async (signer: ethers.Signer) => {
    const contract = new ethers.Contract((tokenlinkFactory.networks as Networks)[networkId]?.address as string, tokenlinkFactory.abi, signer);
    const tx = await contract.deploy();
    return tx.wait();
}

export const saveTokenlinkFactoryVariable = async (key: string, value: string | BigNumber, signer: ethers.Signer) => {
    const contract = new ethers.Contract((tokenlinkFactory.networks as Networks)[networkId]?.address as string, tokenlinkFactory.abi, signer);
    const tx = await contract.setVar(key, value);
    return tx.wait();
}

export const saveTokenlinkVariable = async (contract: ethers.Contract, key: string, value: string | BigNumber) => {
    const tx = await contract.setVar(key, value);
    return tx.wait();
}

export const getTokenlinkFactoryBalance = async (provider: ethers.providers.Web3Provider) => {
    return provider.getBalance((tokenlinkFactory.networks as Networks)[networkId]?.address as string);
}

export const getTokenlinkFactoryAddress = () => {
    return (tokenlinkFactory.networks as Networks)[networkId]?.address as string;
}

export const getTokenlinkFactoryInitialAmount = (signer: ethers.Signer) => {
    const contract = new ethers.Contract((tokenlinkFactory.networks as Networks)[networkId]?.address as string, tokenlinkFactory.abi, signer);
    return contract.vars(0);
}

export const getDeployedTokenlinks = async (signer: ethers.Signer) => {
    const contract = new ethers.Contract((tokenlinkFactory.networks as Networks)[networkId]?.address as string, tokenlinkFactory.abi, signer);
    return (await contract.getDeployedContracts()).map((address: string) => {
        return new ethers.Contract(address, tokenlink.abi, signer);
    });
}

export const getOwnedAccounts = async (signer: ethers.Signer) => {
    const tokenlinks = await getDeployedTokenlinks(signer);
    console.log(tokenlinks);
    let accounts = await Promise.all(tokenlinks.map(async (tokenlink: any) => {
        return (await tokenlink.getDeployedContracts()).map((address: string) => {
            return new ethers.Contract(address, account.abi, signer);
        });
    }));
    // TODO: Filter only accounts owned by the signer, same for tokenlinks
    accounts = accounts.flat(Infinity);
    console.log(accounts);
    return accounts;
}

export const deployAccount = async (tokenlinkContract: ethers.Contract) => {
    const tx = await tokenlinkContract.deploy();
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

export const sendNft = async (signer: ethers.Signer, receiver: string, nft: string) => {
    const nftContract = new ethers.Contract((exampleNft.networks as Networks)[networkId]?.address as string, exampleNft.abi, signer);
    const tx = await nftContract['safeTransferFrom(address,address,uint256)'](signer.getAddress(), receiver, nft);
    return tx.wait();
}

export const retrieveNfts = async (accountContract: ethers.Contract) => {
    return accountContract.retrieveNfts((exampleNft.networks as Networks)[networkId]?.address as string);
}

export const changeAccountOwner = async (accountContract: ethers.Contract, newOwner: string) => {
    const tx = await accountContract.changeOwner(newOwner);
    return tx.wait();
}

export const changeTokenlinkOwner = async (tokenlinkContract: ethers.Contract, newOwner: string) => {
    const tx = await tokenlinkContract.changeOwner(newOwner);
    return tx.wait();
}

export const getDeployedAccounts = async (tokenlinkContract: ethers.Contract, signer: ethers.Signer) => {
    return (await tokenlinkContract.getDeployedContracts()).map((address: string) => {
        return new ethers.Contract(address, account.abi, signer);
    });
}
