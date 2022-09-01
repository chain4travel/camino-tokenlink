import React from 'react';
import './App.css';
import {AppBar, Box, Divider, Toolbar, Typography} from "@mui/material";
import {Route, Routes} from "react-router-dom";
import Coinlink from "./components/Coinlink/Coinlink";
import CaminoLogo from "./assets/camino_logo.png";
import AdminPanel from "./components/AdminPanel/AdminPanel";

const App = () => {
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
            <Box component={"main"}>
                <Routes>
                    <Route path="/" element={<AdminPanel/>}/>
                    <Route path="coinlinks/:address" element={<Coinlink/>}/>
                </Routes>
            </Box>
        </div>
    );
}

export default App;
