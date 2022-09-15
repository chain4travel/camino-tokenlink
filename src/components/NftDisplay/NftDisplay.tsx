import {
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography
} from "@mui/material";
import React, {FC} from "react";
// @ts-ignore
import Identicon from 'react-identicons';
import {ethers} from "ethers";
import {sendNft} from "../../services/web3Service";
import {useWeb3} from "../../Web3ModalContext";

export interface NftDisplayProps {
    nft: string;
    removeNft?: (nft: string) => void;
    showSendButton?: boolean;
}

const NftDisplay: FC<NftDisplayProps> = (props) => {
    const web3 = useWeb3();
    const [open, setOpen] = React.useState(false);
    const [receiver, setReceiver] = React.useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSend = async () => {
        if (!web3.signer || !ethers.utils.isAddress(receiver) || !props.removeNft) return;
        console.log(`Sending ${props.nft} to ${receiver}`);
        try {
            await sendNft(web3.signer, receiver, props.nft);
            setOpen(false);
            props.removeNft(props.nft);
        } catch (e) {
            console.error(e);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setReceiver(event.target.value);
    }

    return (
        <div>
            <Card sx={{
                border: '1px solid',
                borderColor: 'grey.500',
                backgroundColor: 'grey.800'
            }}>
                <CardContent className={'flex flex-col items-center gap-2'}>
                    <Identicon string={props.nft} size={100}/>
                    <Typography variant="body2">{props.nft}</Typography>
                    {props.showSendButton && (<Button variant="outlined" onClick={handleClickOpen}>
                        Send
                    </Button>)}
                </CardContent>
            </Card>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Send NFT to address</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To send NFT to a different address, please enter receiver address here.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Web3 address"
                        placeholder='e.g. 0xa218...77e8'
                        fullWidth
                        variant="standard"
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSend} disabled={!ethers.utils.isAddress(receiver)}>Send</Button>
                </DialogActions>
            </Dialog>
        </div>);
};

NftDisplay.defaultProps = {
    showSendButton: false,
}

export default NftDisplay;
