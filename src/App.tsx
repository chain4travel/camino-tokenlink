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

const App = () => {
    const [coinlinks, setCoinlinks] = useState([]);

    return (
        <div className={'App h-screen'}>
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
                <div className="flex flex-col m-4 gap-2">
                    <Link to={`/`} className="flex items-center gap-2">
                        <Fab color="primary" aria-label="add">
                            <HomeIcon/>
                        </Fab>
                        <Typography variant="h6">HOME</Typography>
                    </Link>
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
                        <Route path="/" element={<AdminPanel coinlinks={coinlinks} setCoinlinks={setCoinlinks}/>}/>
                        <Route path="coinlinks/:address" element={<Coinlink/>}/>
                    </Routes>
            </Box>
        </div>
    );
}

export default App;
