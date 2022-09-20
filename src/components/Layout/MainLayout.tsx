import {Box} from "@mui/material";
import {FC, useEffect} from "react";
import {Outlet} from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import SideBar, {SideBarProps} from "../SideBar/SideBar";
import {getAccount, getProvider, getSigner} from "../../store/web3-config";
import Home from "../../pages/Home";
import {useAppDispatch, useAppSelector} from "../../store";
import {connectWallet} from "../../store/utils";

const MainLayout: FC<SideBarProps> = ({
                                          tokenlinks,
                                          accounts,
                                          initialAmount,
                                          factoryBalance,
                                          onDeployTokenlink,
                                          isAdmin
                                      }) => {
    const dispatch = useAppDispatch();
    const signer = useAppSelector(getSigner);
    const account = useAppSelector(getAccount);
    const provider = useAppSelector(getProvider);
    useEffect(() => {
        if (account) dispatch(connectWallet());
    }, [account]);
    if (!provider || !account || !signer)
        return (
            <>
                <NavBar/>
                <Home/>
            </>
        );
    return (
        <>
            <NavBar/>
            <Box sx={{display: "flex"}}>
                <SideBar
                    tokenlinks={tokenlinks}
                    accounts={accounts}
                    initialAmount={initialAmount}
                    factoryBalance={factoryBalance}
                    onDeployTokenlink={onDeployTokenlink}
                    isAdmin={isAdmin}
                />
                <Outlet/>
            </Box>
        </>
    );
};

export default MainLayout;
