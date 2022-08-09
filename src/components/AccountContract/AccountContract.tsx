import React, {FC, useEffect, useState} from 'react';
import './AccountContract.css';
import {ethers} from "ethers";
import {Card, CardContent, Typography} from "@mui/material";

interface AccountContractProps {
    accountContract: ethers.Contract;
}

const AccountContract: FC<AccountContractProps> = (props) => {
    const [owner, setOwner] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            const varOwner = await props.accountContract.owner();
            setOwner(varOwner);
        }
        fetchData().catch(console.error);
    }, []);

    return (
        <Card className={'bg-black'}>
            <CardContent>
                <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                    Owner: {owner}
                </Typography>
                <Typography variant="h5" component="div">
                    Account
                </Typography>
                <Typography sx={{mb: 1.5}} color="text.secondary">
                    {props.accountContract.address}
                </Typography>
            </CardContent>
        </Card>
    )
};

export default AccountContract;
