import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {Button, TextField} from "@mui/material";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnect from "@walletconnect/web3-provider";
import Web3Modal from 'web3modal';
import {ethers} from "ethers";
import {deployCoinlink, getCoinlinkFactoryInitialAmount} from "./services/web3Service";

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

    const onGetInitialAmount = async () => {
        if (!provider) return;
        try {
            const initialAmount = await getCoinlinkFactoryInitialAmount(provider);
            console.log('initialAmount', ethers.utils.formatEther(initialAmount));
        } catch (error) {
            console.error(error);
        }
    }

    const onDeployCoinlink = async () => {
        if (!provider) return;
        try {
            const result = await deployCoinlink('1', provider);
            console.log('result', result);
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <TextField label="Outlined" variant="outlined"/>
                <Button variant="contained" onClick={connectWallet}>Connect Wallet</Button>
                <div>Connection Status: {!!account ? 'True' : 'False'}</div>
                <div>Wallet Address: {account}</div>
                <Button variant="contained" onClick={onGetInitialAmount}>Get initial amount</Button>
                <Button variant="contained" onClick={onDeployCoinlink}>Deploy Coinlink</Button>
            </header>
        </div>
    );
}

export default App;
