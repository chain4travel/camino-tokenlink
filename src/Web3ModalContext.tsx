import {ethers, providers} from "ethers";
import React, {useContext, useState} from "react";
import WalletConnect from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

interface IWeb3Context {
    provider?: providers.Web3Provider;
    signer?: ethers.Signer;
    account?: string;
    connect: () => Promise<unknown>;
}

const Web3Context = React.createContext<IWeb3Context>({
    connect: () => Promise.resolve({}),
});

const useWeb3 = () => useContext(Web3Context);

const Web3Provider = ({children}: { children: React.ReactNode }) => {
    const [web3Modal,] = useState<Web3Modal>(new Web3Modal({
        cacheProvider: true,
        providerOptions: {
            coinbasewallet: {
                package: CoinbaseWalletSDK,
                options: {
                    appName: "Web 3 Modal Demo",
                    infuraId: process.env.REACT_APP_INFURA_KEY
                }
            },
            walletconnect: {
                package: WalletConnect,
                options: {
                    infuraId: process.env.REACT_APP_INFURA_KEY
                }
            }
        },
    }));
    const [web3Resources, setWeb3Resources] = useState<{
        provider: providers.Web3Provider;
        signer: ethers.Signer;
        account: string;
    }>();


    const connect = async () => {
        if (!web3Modal) return;
        const instance = await web3Modal.connect();
        const _provider = new providers.Web3Provider(instance);
        const signer = await _provider.getSigner();
        const account = await signer.getAddress();
        setWeb3Resources({
            provider: _provider,
            signer,
            account,
        });
    };

    return (
        <Web3Context.Provider value={{...web3Resources, connect}}>
            {children}
        </Web3Context.Provider>
    );
};

export {Web3Provider, useWeb3};