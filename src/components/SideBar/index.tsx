import {Link} from "react-router-dom";
import {Divider, Fab, Typography} from "@mui/material";
import {useWeb3} from "../../Web3ModalContext";
import {FC} from "react";
import DomainIcon from "@mui/icons-material/Domain";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import PlusIcon from "@mui/icons-material/Add";
import {ethers} from "ethers";

export interface SideBarProps {
    coinlinks: any[];
    accounts: any[];
    initialAmount: string;
    factoryBalance: string;
    onDeployCoinlink: any;
}

const SideBar: FC<SideBarProps> = (props) => {
    const {coinlinks, accounts, initialAmount, factoryBalance, onDeployCoinlink} = props;
    const web3 = useWeb3();
    return (
        <div className="flex flex-col m-4 gap-3 w-1/5">
            <Link to={`/`} className="flex items-center gap-2">
                <Fab color="primary" className={'gradient-button'} aria-label="add">
                    <HomeIcon/>
                </Fab>
                <Typography sx={{color: "primary.contrastText"}} variant="h6">
                    HOME
                </Typography>
            </Link>
            <div className="flex items-center gap-2">
                <Fab
                    disabled={!web3.signer || +initialAmount > +factoryBalance}
                    color="primary"
                    sx={{backgroundColor: "grey.700"}}
                    aria-label="add"
                    onClick={onDeployCoinlink}
                >
                    <PlusIcon/>
                </Fab>
                <Typography sx={{color: "primary.contrastText"}} variant="h6">New OTA</Typography>
            </div>
            <Divider className="divider" flexItem/>
            {coinlinks.map((coinlink: ethers.Contract, index: number) => (
                <Link
                    key={index}
                    to={`/coinlinks/${coinlink.address}`}
                    className="flex items-center gap-2"
                >
                    <Fab color="primary" sx={{backgroundColor: "grey.700"}} aria-label="add">
                        <DomainIcon/>
                    </Fab>
                    <Typography sx={{color: "primary.contrastText"}} variant="h6">OTA #{index + 1}</Typography>
                </Link>
            ))}
            <Divider className="divider" flexItem/>
            {accounts.map((account: ethers.Contract, index: number) => (
                <Link
                    key={index}
                    to={`/accounts/${account.address}`}
                    className="flex items-center gap-2"
                >
                    <Fab color="primary" sx={{backgroundColor: "grey.700"}} aria-label="add">
                        <DomainIcon/>
                    </Fab>
                    <Typography sx={{color: "primary.contrastText"}} variant="h6">Account #{index + 1}</Typography>
                </Link>
            ))}
        </div>
    );
};
export default SideBar;
