import { Link } from "react-router-dom";
import { Divider, Fab, Typography } from "@mui/material";
import { useWeb3 } from "../../Web3ModalContext";
import { FC, useState } from "react";
import {
  deployCoinlink,
  getCoinlinkFactoryBalance,
  getDeployedCoinlinks,
} from "../../services/web3Service";
import DomainIcon from "@mui/icons-material/Domain";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import PlusIcon from "@mui/icons-material/Add";
import { ethers } from "ethers";

export interface SideBarProps {
  coinlinks: any[];
  initialAmount: string;
  factoryBalance: string;
  onDeployCoinlink: any;
}

const SideBar: FC<SideBarProps> = (props) => {
  const { coinlinks, initialAmount, factoryBalance, onDeployCoinlink } = props;
  const web3 = useWeb3();
  return (
    <div className="flex flex-col m-4 gap-2 w-1/5">
      <Link to={`/`} className="flex items-center gap-2">
        <Fab color="primary" aria-label="add">
          <HomeIcon />
        </Fab>
        <Typography sx={{ color: "primary.contrastText" }} variant="h6">
          HOME
        </Typography>
      </Link>
      <div className="flex items-center gap-2">
        <Fab
          disabled={!web3.signer || +initialAmount > +factoryBalance}
          color="primary"
          aria-label="add"
          onClick={onDeployCoinlink}
        >
          <PlusIcon />
        </Fab>
        <Typography variant="h6">New OTA</Typography>
      </div>
      <Divider className="divider" flexItem />
      {coinlinks.map((coinlink: ethers.Contract, index: number) => (
        <Link
          key={index}
          to={`/coinlinks/${coinlink.address}`}
          className="flex items-center gap-2"
        >
          <Fab color="primary" aria-label="add">
            <DomainIcon />
          </Fab>
          <Typography variant="h6">OTA #{index + 1}</Typography>
        </Link>
      ))}
    </div>
  );
};
export default SideBar;
