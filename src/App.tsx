import React, {useEffect, useState} from 'react';
import './App.css';
import {
    AppBar,
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";
import {BigNumber, ethers} from "ethers";
import {
    deployCoinlink,
    getCoinlinkFactoryBalance,
    getCoinlinkFactoryInitialAmount,
    getDeployedCoinlinks,
    getWalletNfts,
    saveCoinlinkFactoryVariable
} from "./services/web3Service";
import {Link, Route, Routes} from "react-router-dom";
import Coinlinks from "./components/Coinlinks/Coinlinks";
import Coinlink from "./components/Coinlink/Coinlink";
import {useWeb3} from "./Web3ModalContext";
import CaminoLogo from "./assets/camino_logo.png";

const App = () => {
    const web3 = useWeb3();
    const [key, setKey] = useState('0');
    const [value, setValue] = useState('');
    const [initialAmount, setInitialAmount] = useState('');
    const [balance, setBalance] = useState('');
    const [nfts, setNfts] = useState<string[]>([]);
    const [coinlinks, setCoinlinks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await web3.connect();
        }
        fetchData().catch(console.error);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await connectWallet();
        }
        fetchData().catch(console.error);
    }, [web3]);

    const connectWallet = async () => {
        if (!web3.signer || !web3.provider || !web3.account) return;
        try {
            const initialAmount = await getCoinlinkFactoryInitialAmount(web3.signer);
            setInitialAmount(ethers.utils.formatEther(initialAmount));
            const balance = await getCoinlinkFactoryBalance(web3.provider);
            setBalance(ethers.utils.formatEther(balance));
            const nfts = await getWalletNfts(web3.signer, web3.account);
            setNfts(nfts.map((nft: BigNumber) => nft.toString()));
            const coinlinks = await getDeployedCoinlinks(web3.signer);
            setCoinlinks(coinlinks);
        } catch (error) {
            console.error(error);
        }
    };

    const onDeployCoinlink = async () => {
        if (!web3.signer || !web3.provider) return;
        try {
            const result = await deployCoinlink(web3.signer);
            console.log('result', result);
            setCoinlinks(await getDeployedCoinlinks(web3.signer));
            const balance = await getCoinlinkFactoryBalance(web3.provider);
            setBalance(ethers.utils.formatEther(balance));
        } catch (error) {
            console.error(error);
        }
    }

    const onSaveVariable = async () => {
        if (!web3.signer || !key || !value) return;
        try {
            let result;
            if (key === '0') {
                result = await saveCoinlinkFactoryVariable(key, ethers.utils.parseEther(value), web3.signer);
            } else {
                result = await saveCoinlinkFactoryVariable(key, value, web3.signer);
            }
            console.log('result', result);
            const initialAmount = await getCoinlinkFactoryInitialAmount(web3.signer);
            setInitialAmount(ethers.utils.formatEther(initialAmount));
        } catch (error) {
            console.error(error);
        }
    }

    const onGetDeployedCoinlinks = async () => {
        if (!web3.signer) return;
        try {
            const result = await getDeployedCoinlinks(web3.signer);
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
        <>
            <Box sx={{flexGrow: 1}}>
                <AppBar position="static">
                    <Toolbar className="toolbar">
                        <div className="flex gap-3">
                            <img src={CaminoLogo} alt="logo"/>
                            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                                Camino
                            </Typography>
                            <Divider className="divider" orientation="vertical" flexItem/>
                            <Typography variant="h6" component="div" className="uppercase camino-title"
                                        sx={{flexGrow: 1}}>
                                Coinlink
                            </Typography>
                        </div>
                    </Toolbar>
                </AppBar>
            </Box>
            <div className="App">
                <header className="App-header gap-2">
                    <Link to="coinlinks">Coinlinks</Link>
                    <Button variant="contained" onClick={web3.connect}>Connect Wallet</Button>
                    <div>Connection Status: {!!web3.account ? 'True' : 'False'}</div>
                    <div>Wallet Address: {web3.account}</div>
                    {nfts.length > 0 && <p>Wallet NFTs:</p>}
                    <div className={'flex gap-2 m-2 justify-center flex-wrap'}>
                        {nfts.map((nft, index) =>
                            <Card key={index}>
                                <CardContent>
                                    <Typography variant="body2">
                                        {nft}
                                    </Typography>
                                </CardContent>
                            </Card>)}
                    </div>
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
                        <Button variant="contained" onClick={onSaveVariable} disabled={!web3.signer || !key}>Save
                            variable</Button>
                    </FormControl>
                    <Typography variant="body2">
                        Initial amount: {initialAmount} CAM
                        <br/>
                        Balance: {balance} CAM
                    </Typography>
                    <Button variant="contained" onClick={onDeployCoinlink}
                            disabled={!web3.signer || +initialAmount > +balance}>Deploy
                        Coinlink</Button>
                    <Button variant="contained" onClick={onGetDeployedCoinlinks}>Get Deployed Coinlinks</Button>
                    <Coinlinks coinlinks={coinlinks}/>
                </header>
                {web3.signer && <Routes>
                    <Route path="coinlinks" element={<Coinlinks coinlinks={coinlinks}/>}/>
                    <Route path="coinlinks/:address" element={<Coinlink/>}/>
                </Routes>}
            </div>
        </>
    );
}

export default App;
