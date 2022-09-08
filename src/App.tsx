import React, {useState} from 'react';
import './App.css';
import {AppBar, Box, Divider, Fab, Toolbar, Typography} from "@mui/material";
import {Link, Route, Routes} from "react-router-dom";
import Coinlink from "./components/Coinlink/Coinlink";
import CaminoLogo from "./assets/camino_logo.png";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import {ethers} from "ethers";
import DomainIcon from "@mui/icons-material/Domain";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import PlusIcon from "@mui/icons-material/Add";
import {deployCoinlink, getCoinlinkFactoryBalance, getDeployedCoinlinks} from "./services/web3Service";
import {useWeb3} from "./Web3ModalContext";

const App = () => {
    const web3 = useWeb3();
    const [coinlinks, setCoinlinks] = useState([]);
    const [factoryBalance, setFactoryBalance] = useState('');
    const [initialAmount, setInitialAmount] = useState('');

    const onDeployCoinlink = async () => {
        if (!web3.signer || !web3.provider) return;
        try {
            const result = await deployCoinlink(web3.signer);
            console.log('result', result);
            setCoinlinks(await getDeployedCoinlinks(web3.signer));
            const balance = await getCoinlinkFactoryBalance(web3.provider);
            setFactoryBalance(ethers.utils.formatEther(balance));
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className={'App h-min-screen'}>
            <Box sx={{flexGrow: 1}}>
                <AppBar position="static">
                    <Toolbar className="toolbar">
                        <div className="flex gap-3">
                            <img src={CaminoLogo} alt="logo"/>
                            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                                Camino
                            </Typography>
                            <Divider className="divider" orientation="vertical" flexItem/>
                            <Typography variant="h6" component="div" className="uppercase camino-title"
                                        sx={{flexGrow: 1}}>
                                Coinlink
                            </Typography>
                        </div>
                    </Toolbar>
                </AppBar>
            </Box>
            <Box component={"main"} className={'flex gap-2 content-center'}>
                <div className="flex flex-col m-4 gap-2 w-1/5">
                    <Link to={`/`} className="flex items-center gap-2">
                        <Fab color="primary" aria-label="add">
                            <HomeIcon/>
                        </Fab>
                        <Typography variant="h6">HOME</Typography>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Fab disabled={!web3.signer || +initialAmount > +factoryBalance} color="primary"
                             aria-label="add" onClick={onDeployCoinlink}>
                            <PlusIcon/>
                        </Fab>
                        <Typography variant="h6">New OTA</Typography>
                    </div>
                    <Divider className="divider" flexItem/>
                    {coinlinks.map((coinlink: ethers.Contract, index: number) =>
                        <Link key={index} to={`/coinlinks/${coinlink.address}`} className="flex items-center gap-2">
                            <Fab color="primary" aria-label="add">
                                <DomainIcon/>
                            </Fab>
                            <Typography variant="h6">OTA #{index + 1}</Typography>
                        </Link>
                    )}
                </div>
                <Routes>
                    <Route path="/" element={<AdminPanel coinlinks={coinlinks} setCoinlinks={setCoinlinks}
                                                         balance={factoryBalance} setBalance={setFactoryBalance}
                                                         initialAmount={initialAmount}
                                                         setInitialAmount={setInitialAmount}/>}/>
                    <Route path="coinlinks/:address" element={<Coinlink/>}/>
                </Routes>
            </Box>
        </div>
    );
}

export default App;
