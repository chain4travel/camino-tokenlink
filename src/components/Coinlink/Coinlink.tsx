import React, {useEffect, useState} from 'react';
import './Coinlink.css';
import {useParams} from "react-router-dom";
import {ethers} from "ethers";
import {
    changeCoinlinkOwner,
    deployAccount,
    getDeployedAccounts,
    saveCoinlinkVariable
} from "../../services/web3Service";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from "@mui/material";
import coinlink from '@coinlink/contracts/Coinlink.json';
import {useWeb3} from "../../Web3ModalContext";
import AccountContract from "../AccountContract/AccountContract";

const Coinlink = () => {
    const web3 = useWeb3();
    const params = useParams();
    const [initialAmount, setInitialAmount] = useState('');
    const [reviewReward, setReviewReward] = useState('');
    const [balance, setBalance] = useState('');
    const [owner, setOwner] = useState('');
    const [newOwner, setNewOwner] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [key, setKey] = useState('');
    const [value, setValue] = useState('');
    const [coinlinkContract, setCoinlinkContract] = useState<ethers.Contract>(new ethers.Contract(params.address as string, coinlink.abi, web3.provider));

    useEffect(() => {
        const fetchData = async () => {
            await web3.connect();
            console.log(web3)
            setCoinlinkContract(new ethers.Contract(params.address as string, coinlink.abi, web3.signer));
            await fetchValues();
            await fetchAccounts();
            await fetchBalance();
            await fetchOwner();
        }
        fetchData().catch(console.error);
    }, [params.address]);


    const fetchValues = async () => {
        const varInitialAmount = await coinlinkContract.vars(0);
        setInitialAmount(ethers.utils.formatEther(varInitialAmount));
        const varReviewReward = await coinlinkContract.vars(1);
        setReviewReward(ethers.utils.formatEther(varReviewReward));
    }

    const fetchOwner = async () => {
        const varOwner = await coinlinkContract.owner();
        setOwner(varOwner);
    }

    const fetchBalance = async () => {
        if (!web3.provider) return;
        const balance = await web3.provider.getBalance(coinlinkContract.address);
        setBalance(ethers.utils.formatEther(balance));
    }

    const onDeployAccount = async () => {
        const result = await deployAccount(coinlinkContract);
        console.log(result);
        await fetchAccounts();
        await fetchBalance();
    }

    const onChangeOwner = async () => {
        await changeCoinlinkOwner(coinlinkContract, newOwner);
        await fetchOwner();
    }

    const fetchAccounts = async () => {
        if (!web3.signer) return;
        const accounts = await getDeployedAccounts(coinlinkContract, web3.signer);
        console.log(accounts);
        setAccounts(accounts);
    }

    const handleValueVariableChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setValue(event.target.value);
    };

    const handleKeyVariableChange = (event: SelectChangeEvent) => {
        setKey(event.target.value as string);
    };

    const handleOwnerChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewOwner(event.target.value);
    }

    const onSaveVariable = async () => {
        if (!key || !value) return;
        try {
            let result;
            if (key === '0' || key === '1') {
                result = await saveCoinlinkVariable(coinlinkContract, key, ethers.utils.parseEther(value));
            } else {
                result = await saveCoinlinkVariable(coinlinkContract, key, value);
            }
            console.log('result', result);
            await fetchValues();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Card>
            <CardContent>
                <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                    Owner: {owner}
                </Typography>
                <FormControl>
                    <TextField value={newOwner} onChange={handleOwnerChange} fullWidth/>
                    <Button onClick={onChangeOwner} disabled={!ethers.utils.isAddress(newOwner)} variant={'contained'}>Change
                        Owner</Button>
                </FormControl>
                <Typography variant="h5" component="div">
                    Coinlink
                </Typography>
                <Typography sx={{mb: 1.5}} color="text.secondary">
                    {coinlinkContract.address}
                </Typography>
                <Typography variant="body2">
                    Initial amount: {initialAmount} CAM
                    <br/>
                    Review reward: {reviewReward} CAM
                    <br/>
                    Balance: {balance} CAM
                </Typography>
                <FormControl>
                    <InputLabel>Variable</InputLabel>
                    <Select
                        value={key}
                        label="Variable"
                        onChange={handleKeyVariableChange}
                    >
                        <MenuItem value={'0'}>Initial amount</MenuItem>
                        <MenuItem value={'1'}>Review reward</MenuItem>
                    </Select>
                    <TextField label="Value" value={value} type="number"
                               onChange={handleValueVariableChange}/>
                    <Button variant="contained" onClick={onSaveVariable} disabled={!key}>Save variable</Button>
                </FormControl>
                <div className={'flex flex-col gap-2 m-2 justify-center flex-wrap'}>
                    {accounts.map((account, index) => <AccountContract key={index} accountContract={account}/>)}
                </div>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={onDeployAccount} disabled={initialAmount > balance}>Deploy
                    Account</Button>
                <Button size="small" onClick={fetchAccounts}>Fetch Accounts</Button>
            </CardActions>
        </Card>
    )
};

export default Coinlink;
