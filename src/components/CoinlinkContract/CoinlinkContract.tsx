import React, {FC, useEffect, useState} from 'react';
import './CoinlinkContract.css';
import {ethers, providers} from "ethers";
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
import {deployAccount, getDeployedAccounts, saveCoinlinkVariable} from "../../services/web3Service";
import Web3Modal from "web3modal";
import AccountContract from "../AccountContract/AccountContract";

interface CoinlinkContractProps {
    coinlinkContract: ethers.Contract;
    web3Modal: Web3Modal;
}

const CoinlinkContract: FC<CoinlinkContractProps> = (props) => {
    const [initialAmount, setInitialAmount] = useState('');
    const [reviewReward, setReviewReward] = useState('');
    const [balance, setBalance] = useState('');
    const [owner, setOwner] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [key, setKey] = useState('');
    const [value, setValue] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            await fetchValues();
            await fetchAccounts();
            await fetchBalance();
        }
        fetchData().catch(console.error);
    }, []);

    const fetchValues = async () => {
        const varInitialAmount = await props.coinlinkContract.vars(0);
        setInitialAmount(ethers.utils.formatEther(varInitialAmount));
        const varReviewReward = await props.coinlinkContract.vars(1);
        setReviewReward(ethers.utils.formatEther(varReviewReward));
        const varOwner = await props.coinlinkContract.owner();
        setOwner(varOwner);
    }

    const fetchBalance = async () => {
        const provider = new providers.Web3Provider(await props.web3Modal.connect());
        const balance = await provider.getBalance(props.coinlinkContract.address);
        setBalance(ethers.utils.formatEther(balance));
    }

    const onDeployAccount = async () => {
        const result = await deployAccount(props.coinlinkContract);
        console.log(result);
        await fetchAccounts();
        await fetchBalance();
    }

    const fetchAccounts = async () => {
        const provider = await props.web3Modal.connect();
        const accounts = await getDeployedAccounts(props.coinlinkContract, provider);
        console.log(accounts);
        setAccounts(accounts);
    }

    const handleValueVariableChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setValue(event.target.value);
    };

    const handleKeyVariableChange = (event: SelectChangeEvent) => {
        setKey(event.target.value as string);
    };

    const onSaveVariable = async () => {
        if (!key || !value) return;
        try {
            let result;
            console.log(key);
            if (key === '0' || key === '1') {
                result = await saveCoinlinkVariable(props.coinlinkContract, key, ethers.utils.parseEther(value));
            } else {
                result = await saveCoinlinkVariable(props.coinlinkContract, key, value);
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
                <Typography variant="h5" component="div">
                    Coinlink
                </Typography>
                <Typography sx={{mb: 1.5}} color="text.secondary">
                    {props.coinlinkContract.address}
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
                    {accounts.map((account, index) => <AccountContract key={index} accountContract={account}
                                                                       web3Modal={props.web3Modal}/>)}
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

export default CoinlinkContract;
