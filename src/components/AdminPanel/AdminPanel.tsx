import React, {FC, useEffect, useState} from 'react';
import './AdminPanel.css';
import Astronaut from './../../assets/astronaut.png';
import {
    Button,
    Card,
    CardContent,
    Fab,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from "@mui/material";
import {useWeb3} from "../../Web3ModalContext";
import {
    deployCoinlink,
    getCoinlinkFactoryBalance,
    getCoinlinkFactoryInitialAmount,
    getDeployedCoinlinks,
    getWalletNfts,
    saveCoinlinkFactoryVariable
} from "../../services/web3Service";
import {BigNumber, ethers} from "ethers";
import DomainIcon from '@mui/icons-material/Domain';
import {Link} from "react-router-dom";

interface AdminPanelProps {
}

const AdminPanel: FC<AdminPanelProps> = () => {
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

    if (!web3.signer || !web3.provider || !web3.account) {
        console.log('signer', web3.signer);
        console.log('provider', web3.provider);
        console.log('account', web3.account);
        return (
            <div className="flex flex-col items-center gap-3 m-3">
                <img className={'max-w-lg'} src={Astronaut} alt="Astronaut"/>
                <Typography variant={"h6"}>Connect your wallet
                    to manage your coinlinks</Typography>
                <Button variant="contained" onClick={web3.connect}>Connect Wallet</Button>
            </div>
        )
    } else {
        return (
            <div className="flex gap-2 content-center">
                <div className="flex flex-col m-4 gap-2">
                    {coinlinks.map((coinlink: ethers.Contract, index: number) =>
                        <Link key={index} to={`/coinlinks/${coinlink.address}`} className="flex items-center gap-2">
                            <Fab color="primary" aria-label="add">
                                <DomainIcon/>
                            </Fab>
                            <Typography variant="h6">OTA #{index + 1}</Typography>
                        </Link>
                    )}
                </div>
                <div className="main-content flex flex-col items-center justify-center text-white">
                    <Typography variant="h4">Status</Typography>
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
                </div>
            </div>
        )
    }
};

export default AdminPanel;
