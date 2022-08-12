import React, {useEffect, useState} from 'react';
import './App.css';
import {Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnect from "@walletconnect/web3-provider";
import Web3Modal from 'web3modal';
import {ethers} from "ethers";
import {
    deployCoinlink,
    getCoinlinkFactoryInitialAmount,
    getDeployedCoinlinks,
    saveCoinlinkFactoryVariable
} from "./services/web3Service";
import CoinlinkContract from "./components/CoinlinkContract/CoinlinkContract";

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
    const [coinlinks, setCoinlinks] = useState([]);
    const [key, setKey] = useState('0');
    const [value, setValue] = useState('');

    const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions
    });

    useEffect(() => {
        const fetchData = async () => {
            const provider = await web3Modal.connect();
            const library = new ethers.providers.Web3Provider(provider);
            const accounts = await library.listAccounts();
            const network = await library.getNetwork();
            setProvider(provider);
            setLibrary(library);
            if (accounts) setAccount(accounts[0]);
            setNetwork(network);
            setCoinlinks(await getDeployedCoinlinks(provider));
        }
        fetchData().catch(console.error);
    }, []);

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
            const result = await deployCoinlink(provider);
            console.log('result', result);
            setCoinlinks(await getDeployedCoinlinks(provider));
        } catch (error) {
            console.error(error);
        }
    }

    const onSaveVariable = async () => {
        if (!provider || !key || !value) return;
        try {
            let result;
            if (key === '0') {
                result = await saveCoinlinkFactoryVariable(key, ethers.utils.parseEther(value), provider);
            } else {
                result = await saveCoinlinkFactoryVariable(key, value, provider);
            }
            console.log('result', result);
        } catch (error) {
            console.error(error);
        }
    }

    const onGetDeployedCoinlinks = async () => {
        if (!provider) return;
        try {
            const result = await getDeployedCoinlinks(provider);
            console.log('result', result);
            setCoinlinks(result);
        } catch (error) {
            console.error(error);
        }
    }

    const handleValueVariableChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setValue(event.target.value);
    };

    const handleKeyVariableChange = (event: SelectChangeEvent) => {
        setKey(event.target.value as string);
    };

    return (
        <div className="App">
            <header className="App-header gap-2">
                <Button variant="contained" onClick={connectWallet}>Connect Wallet</Button>
                <div>Connection Status: {!!account ? 'True' : 'False'}</div>
                <div>Wallet Address: {account}</div>
                <Button variant="contained" onClick={onGetInitialAmount}>Get initial amount</Button>
                <FormControl>
                    <InputLabel>Variable</InputLabel>
                    <Select
                        value={key}
                        label="Variable"
                        onChange={handleKeyVariableChange}
                    >
                        <MenuItem value={'0'}>Initial amount</MenuItem>
                    </Select>
                    <TextField label="Value" value={value} type="number"
                               onChange={handleValueVariableChange}/>
                    <Button variant="contained" onClick={onSaveVariable} disabled={!provider || !key}>Save variable</Button>
                </FormControl>
                <Button variant="contained" onClick={onDeployCoinlink} disabled={!provider}>Deploy
                    Coinlink</Button>
                <Button variant="contained" onClick={onGetDeployedCoinlinks}>Get Deployed Coinlinks</Button>
                <div className={'flex gap-2 m-2 justify-center flex-wrap'}>
                    {coinlinks.map((coinlink, index) => <CoinlinkContract key={index} coinlinkContract={coinlink}
                                                                          web3Modal={web3Modal}/>)}
                </div>
            </header>
        </div>
    );
}

export default App;
