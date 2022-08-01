import React from 'react';
import logo from './logo.svg';
import './App.css';
import {TextField} from "@mui/material";
import {InjectedConnector} from "@web3-react/injected-connector";

import {useWeb3React} from '@web3-react/core'

const Injected = new InjectedConnector({
    supportedChainIds: [1337]
});

function App() {
    const {activate, deactivate} = useWeb3React();
    const {active, chainId, account} = useWeb3React();
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <TextField label="Outlined" variant="outlined"/>
                <button onClick={() => {
                    activate(Injected)
                }}>Metamask
                </button>
                <div>Connection Status: {active ? 'True' : 'False'}</div>
                <div>Account: {account}</div>
                <div>Network ID: {chainId}</div>
                <button onClick={deactivate}>Disconnect</button>
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
