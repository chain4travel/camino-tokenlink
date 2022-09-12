import React, {FC, useEffect, useState} from "react";
import "./AdminPanel.css";
import {
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import {useWeb3} from "../../Web3ModalContext";
import {
  getCoinlinkFactoryBalance,
  getCoinlinkFactoryInitialAmount,
  getDeployedCoinlinks,
  saveCoinlinkFactoryVariable,
} from "../../services/web3Service";
import {ethers} from "ethers";
import {getNfts} from "../../store/wallet";
import {useSelector} from "react-redux";

export interface AdminPanelProps {
  coinlinks: any[];
  setCoinlinks: any;
  balance: string;
  setBalance: any;
  initialAmount: string;
  setInitialAmount: any;
}

const AdminPanel: FC<AdminPanelProps> = (props) => {
  const web3 = useWeb3();
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const nfts = useSelector(getNfts);

  useEffect(() => {
    const fetchData = async () => {
      await web3.connect();
    };
    fetchData().catch(console.error);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await connectWallet();
    };
    fetchData().catch(console.error);
  }, [web3]);

  const connectWallet = async () => {
    if (!web3.signer || !web3.provider || !web3.account) return;
    try {
      const initialAmount = await getCoinlinkFactoryInitialAmount(web3.signer);
      props.setInitialAmount(ethers.utils.formatEther(initialAmount));
      const balance = await getCoinlinkFactoryBalance(web3.provider);
      props.setBalance(ethers.utils.formatEther(balance));
      console.log(nfts);
      const coinlinks = await getDeployedCoinlinks(web3.signer);
      props.setCoinlinks(coinlinks);
    } catch (error) {
      console.error(error);
    }
  };

  const onSaveVariable = async () => {
    if (!web3.signer || !key || !value) return;
    try {
      let result;
      if (key === "0") {
        result = await saveCoinlinkFactoryVariable(
          key,
          ethers.utils.parseEther(value),
          web3.signer
        );
      } else {
        result = await saveCoinlinkFactoryVariable(key, value, web3.signer);
      }
      console.log("result", result);
      const initialAmount = await getCoinlinkFactoryInitialAmount(web3.signer);
      props.setInitialAmount(ethers.utils.formatEther(initialAmount));
    } catch (error) {
      console.error(error);
    }
  };

  const handleValueVariableChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setValue(event.target.value);
  };

  const handleKeyVariableChange = (event: SelectChangeEvent) => {
    setKey(event.target.value as string);
  };

  return (
    <div className="flex flex-col items-start justify-center text-white gap-3 mx-5 flex-1">
      <Typography variant="h5">Status</Typography>
      <div className={"flex flex-col items-start"}>
        <Typography variant="body1" className="green-text uppercase">
          Connection Status
        </Typography>
        <Typography variant="body1">
          {!!web3.account ? "True" : "False"}
        </Typography>
      </div>
      <div className={"flex flex-col items-start"}>
        <Typography variant="body1" className="green-text uppercase">
          Wallet Address
        </Typography>
        <Typography variant="body1">{web3.account}</Typography>
      </div>
      {nfts.length > 0 && (
        <Typography variant="body1" className="green-text uppercase">
          Wallet NFTs
        </Typography>
      )}
      <div className={"flex gap-2 m-2 justify-center flex-wrap"}>
        {nfts.map((nft, index) => (
          <Card key={index}>
            <CardContent>
              <Typography variant="body2">{nft}</Typography>
            </CardContent>
          </Card>
        ))}
      </div>
      <Divider className="divider" flexItem />
      <Typography variant="h5">Coinlinks</Typography>
      <FormControl className='w-full'>
        <div className="flex">
          <InputLabel sx={{ color: "gray" }}>Variable</InputLabel>
          <Select
            sx={{
              width: 300,
              color: "white",
              backgroundColor: "#1E293B",
            }}
            value={key}
            label={"Variable"}
            onChange={handleKeyVariableChange}
            variant={"outlined"}
          >
            <MenuItem value={"0"}>Initial amount</MenuItem>
          </Select>
          <TextField
            label="Value"
            value={value}
            type="number"
            onChange={handleValueVariableChange}
            sx={{
              color: "white",
              backgroundColor: "#1E293B",
            }}
          />
          <Button
            variant="contained"
            onClick={onSaveVariable}
            disabled={!web3.signer || !key}
          >
            Save variable
          </Button>
        </div>
      </FormControl>
      <div className="flex w-full gap-10">
        <div className="flex flex-col items-start">
          <Typography variant="body1" className="green-text uppercase">
            Initial Amount
          </Typography>
          <Typography variant="body1" className="uppercase">
            {props.initialAmount} CAM
          </Typography>
        </div>
        <div className="flex flex-col items-start">
          <Typography variant="body1" className="green-text uppercase">
            Balance
          </Typography>
          <Typography variant="body1" className="uppercase">
            {props.balance} CAM
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
