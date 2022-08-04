import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {TextField} from "@mui/material";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnect from "@walletconnect/web3-provider";
import Web3Modal from 'web3modal';
import {ethers, providers} from "ethers";
import coinlinkFactory from '@coinlink/contracts/CoinlinkFactory.json';
import camino from '@coinlink/contracts/Camino.json';

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
            const contract = new ethers.Contract((coinlinkFactory.networks as Networks)[networkId]?.address as string, coinlinkFactory.abi, ethersProvider);
            console.log(contract);
            const result = await contract.vars(0);
            console.log('Initial amount, factory: ', ethers.utils.formatEther(result));
        } catch (error) {
            console.error(error);
        }
    }

    const deployCoinlink = async () => {
        if (!provider) return;
        const ethersProvider = new providers.Web3Provider(provider);
        const signer = ethersProvider.getSigner();
        const salt = 7;
        try {
            const contract = new ethers.Contract((coinlinkFactory.networks as Networks)[networkId]?.address as string, coinlinkFactory.abi, signer);
            const caminoContract = new ethers.Contract((camino.networks as Networks)[networkId]?.address as string, camino.abi, signer);
            const balance = await caminoContract.balanceOf(contract.address);
            console.log('Balance of contract: ', ethers.utils.formatEther(balance));
            const amountNeeded = await contract.vars(0);
            console.log('Amount needed: ', ethers.utils.formatEther(amountNeeded));
            const result = await contract.deploy(salt, ethers.utils.parseEther('100'));
            console.log('Deployed contract: ', result.address);
            console.log('Deployed: ', result);
            console.log(await contract.coinlinks(0));
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
                <button onClick={deployCoinlink}>Deploy Coinlink</button>
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
