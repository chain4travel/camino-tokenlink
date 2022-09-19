import React, {useEffect, useState} from 'react';
import './Tokenlink.css';
import {useParams} from "react-router-dom";
import {ethers} from "ethers";
import {
    changeTokenlinkOwner,
    deployAccount,
    getDeployedAccounts,
    saveTokenlinkVariable
} from "../../services/web3Service";
import {
    Button,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from "@mui/material";
import tokenlink from '@tokenlink/contracts/Tokenlink.json';
import {useWeb3} from "../../Web3ModalContext";
import {setAccounts} from "../../store/wallet";
import {useAppDispatch} from "../../store";

const Tokenlink = () => {
    const web3 = useWeb3();
    const params = useParams();
    const dispatch = useAppDispatch();
    const [initialAmount, setInitialAmount] = useState('');
    const [reviewReward, setReviewReward] = useState('');
    const [balance, setBalance] = useState('');
    const [owner, setOwner] = useState('');
    const [newOwner, setNewOwner] = useState('');
    const [key, setKey] = useState('');
    const [value, setValue] = useState('');
    const [tokenlinkContract, setTokenlinkContract] = useState<ethers.Contract>(new ethers.Contract(params.address as string, tokenlink.abi, web3.provider));

    useEffect(() => {
        const fetchData = async () => {
            await web3.connect();
        };
        fetchData().catch(console.error);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!web3.signer || !web3.provider || !web3.account) return;
            try {
                setTokenlinkContract(new ethers.Contract(params.address as string, tokenlink.abi, web3.signer));
                await fetchValues();
                await fetchAccounts();
                await fetchBalance();
                await fetchOwner();
            } catch (error) {
                console.error(error);
            }
        };
        fetchData().catch(console.error);
    }, [web3, params.address]);

    const fetchValues = async () => {
        const varInitialAmount = await tokenlinkContract.vars(0);
        setInitialAmount(ethers.utils.formatEther(varInitialAmount));
        const varReviewReward = await tokenlinkContract.vars(1);
        setReviewReward(ethers.utils.formatEther(varReviewReward));
    }

    const fetchOwner = async () => {
        const varOwner = await tokenlinkContract.owner();
        setOwner(varOwner);
    }

    const fetchBalance = async () => {
        if (!web3.provider) return;
        const balance = await web3.provider.getBalance(tokenlinkContract.address);
        setBalance(ethers.utils.formatEther(balance));
    }

    const onDeployAccount = async () => {
        const result = await deployAccount(tokenlinkContract);
        console.log(result);
        await fetchAccounts();
        await fetchBalance();
    }

    const onChangeOwner = async () => {
        await changeTokenlinkOwner(tokenlinkContract, newOwner);
        await fetchOwner();
    }

    const fetchAccounts = async () => {
        if (!web3.signer) return;
        const accounts = await getDeployedAccounts(tokenlinkContract, web3.signer);
        console.log(accounts);
        dispatch(setAccounts(accounts))
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
                result = await saveTokenlinkVariable(tokenlinkContract, key, ethers.utils.parseEther(value));
            } else {
                result = await saveTokenlinkVariable(tokenlinkContract, key, value);
            }
            console.log('result', result);
            await fetchValues();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="flex flex-col items-start text-white gap-3 mx-5 flex-1" key={params.address}>
            <Typography variant="h5">Company</Typography>
            <Typography variant="body1" className='green-text uppercase'>Address</Typography>
            <Typography variant="body1">
                {tokenlinkContract.address}
            </Typography>
            <Typography variant="body1" className='green-text uppercase'>
                Owner
            </Typography>
            <Typography variant="body1">{owner}</Typography>
            <FormControl className="w-full">
                <TextField placeholder='e.g. 0xa218...77e8' label="New owner" value={newOwner}
                           onChange={handleOwnerChange} fullWidth
                           sx={{
                               color: 'white',
                               backgroundColor: '#1E293B',
                           }}/>
                <Button onClick={onChangeOwner} disabled={!ethers.utils.isAddress(newOwner)} variant={'contained'}>Change
                    Owner</Button>
            </FormControl>
            <Divider className="divider" flexItem/>
            <Typography variant="h5">Coin to enduser</Typography>
            <div className='flex w-full gap-10'>
                <div className='flex flex-col items-start'>
                    <Typography variant="body1" className='green-text uppercase'>Initial Amount</Typography>
                    <Typography variant="body1" className='uppercase'>{initialAmount} CAM</Typography>
                </div>
                <div className='flex flex-col items-start'>
                    <Typography variant="body1" className='green-text uppercase'>Review reward</Typography>
                    <Typography variant="body1" className='uppercase'>{reviewReward} CAM</Typography>
                </div>
                <div className='flex flex-col items-start'>
                    <Typography variant="body1" className='green-text uppercase'>Balance</Typography>
                    <Typography variant="body1" className='uppercase'>{balance} CAM</Typography>
                </div>
            </div>
            <FormControl className='w-full'>
                <div className="flex gap-3">
                    <InputLabel sx={{color: "gray"}}>Variable</InputLabel>
                    <Select
                        sx={{
                            width: 300,
                            color: "white",
                            backgroundColor: "#1E293B",
                        }}
                        value={key}
                        label="Variable"
                        onChange={handleKeyVariableChange}
                    >
                        <MenuItem value={'0'}>Initial amount</MenuItem>
                        <MenuItem value={'1'}>Review reward</MenuItem>
                    </Select>
                    <TextField label="Value" value={value} type="number"
                               sx={{
                                   color: "white",
                                   backgroundColor: "#1E293B",
                               }}
                               onChange={handleValueVariableChange}/>
                    <Button className={'whitespace-nowrap'} variant="contained" onClick={onSaveVariable}
                            disabled={!key}>Save variable</Button>
                </div>
            </FormControl>
            <div className='flex w-full gap-10'>
                <Button className={'whitespace-nowrap'} variant="contained" onClick={onDeployAccount}
                        disabled={initialAmount > balance}>Deploy
                    Account</Button>
            </div>
            <Divider className="divider" flexItem/>
            <Typography variant="h5">Loyalty program</Typography>
        </div>
    )
};

export default Tokenlink;
