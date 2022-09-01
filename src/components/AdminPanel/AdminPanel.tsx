import React, {FC, useEffect, useState} from 'react';
import './AdminPanel.css';
import Astronaut from './../../assets/astronaut.png';
import {
    Button,
    Card,
    CardContent,
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

interface AdminPanelProps {
    coinlinks: any[];
    setCoinlinks: any;
}

const AdminPanel: FC<AdminPanelProps> = (props) => {
    const web3 = useWeb3();
    const [key, setKey] = useState('0');
    const [value, setValue] = useState('');
    const [initialAmount, setInitialAmount] = useState('');
    const [balance, setBalance] = useState('');
    const [nfts, setNfts] = useState<string[]>([]);

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
            props.setCoinlinks(coinlinks);
        } catch (error) {
            console.error(error);
        }
    };

    const onDeployCoinlink = async () => {
        if (!web3.signer || !web3.provider) return;
        try {
            const result = await deployCoinlink(web3.signer);
            console.log('result', result);
            props.setCoinlinks(await getDeployedCoinlinks(web3.signer));
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
            props.setCoinlinks(result);
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
            <div className="flex flex-col items-start justify-center text-white gap-3 mx-5">
                <Typography variant="h5">Status</Typography>
                <div className={'flex flex-col items-start'}>
                    <Typography variant="body1" className='green-text uppercase'>Connection Status</Typography>
                    <Typography variant="body1">{!!web3.account ? 'True' : 'False'}</Typography>
                </div>
                <div className={'flex flex-col items-start'}>
                    <Typography variant="body1" className='green-text uppercase'>Wallet Address</Typography>
                    <Typography variant="body1">{web3.account}</Typography>
                </div>
                {nfts.length > 0 && <Typography variant="body1" className='green-text uppercase'>Wallet NFTs</Typography>}
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
        )
    }
};

export default AdminPanel;
