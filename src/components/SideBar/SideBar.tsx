import {Link} from "react-router-dom";
import {Divider, Fab, Typography} from "@mui/material";
import {useWeb3} from "../../Web3ModalContext";
import {FC} from "react";
import DomainIcon from "@mui/icons-material/Domain";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import PlusIcon from "@mui/icons-material/Add";
import {ethers} from "ethers";

export interface SideBarProps {
    tokenlinks: any[];
    accounts: any[];
    initialAmount: string;
    factoryBalance: string;
    onDeployTokenlink: any;
    isAdmin: boolean;
}

const SideBar: FC<SideBarProps> = (props) => {
    const {tokenlinks, accounts, initialAmount, factoryBalance, onDeployTokenlink, isAdmin} = props;
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
            {isAdmin && <div className="flex items-center gap-2">
                <Fab
                    disabled={!web3.signer || +initialAmount > +factoryBalance}
                    color="primary"
                    sx={{backgroundColor: "grey.700"}}
                    aria-label="add"
                    onClick={onDeployTokenlink}
                >
                    <PlusIcon/>
                </Fab>
                <Typography sx={{color: "primary.contrastText"}} variant="h6">New Company</Typography>
            </div>}
            {tokenlinks.length > 0 && (<Divider className="divider" flexItem/>)}
            {tokenlinks.map((tokenlink: ethers.Contract, index: number) => (
                <Link
                    key={index}
                    to={`/tokenlinks/${tokenlink.address}`}
                    className="flex items-center gap-2"
                >
                    <Fab color="primary" sx={{backgroundColor: "grey.700"}} aria-label="add">
                        <DomainIcon/>
                    </Fab>
                    <Typography sx={{color: "primary.contrastText"}} variant="h6">Company #{index + 1}</Typography>
                </Link>
            ))}
            {accounts.length > 0 && (<Divider className="divider" flexItem/>)}
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
