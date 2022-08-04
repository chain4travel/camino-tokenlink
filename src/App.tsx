import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {TextField} from "@mui/material";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnect from "@walletconnect/web3-provider";
import Web3Modal from 'web3modal';
import {ethers, providers} from "ethers";
import coinlink from '@coinlink/contracts/Coinlink.json';

export const providerOptions = {
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
};

let networkId = '5777';
export type Networks = Partial<Record<string, { address: string }>>;

function App() {
    const [provider, setProvider] = useState();
    const [, setLibrary] = useState({});
    const [account, setAccount] = useState('');
    const [, setNetwork] = useState({});
    const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions
    });
    const connectWallet = async () => {
        try {
            const provider = await web3Modal.connect();
            const library = new ethers.providers.Web3Provider(provider);
            const accounts = await library.listAccounts();
            const network = await library.getNetwork();
            setProvider(provider);
            setLibrary(library);
            if (accounts) setAccount(accounts[0]);
            setNetwork(network);
            console.log(provider);
            console.log(library);
        } catch (error) {
            console.error(error);
        }
    };

    const contractInteraction = async () => {
        if (!provider) return;
        const ethersProvider = new providers.Web3Provider(provider);
        try {
            const contract = new ethers.Contract((coinlink.networks as Networks)[networkId]?.address as string, coinlink.abi, ethersProvider);
            console.log(contract);
            const result = await contract.vars(0);
            console.log(ethers.utils.formatEther(result));
            console.log('change');
        } catch (error) {
            console.error(error);
        }

    }
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <TextField label="Outlined" variant="outlined"/>
                <button onClick={connectWallet}>Connect Wallet</button>
                <div>Connection Status: {!!account ? 'True' : 'False'}</div>
                <div>Wallet Address: {account}</div>
                <button onClick={contractInteraction}>Interact with Contract</button>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
