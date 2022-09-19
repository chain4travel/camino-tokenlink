import {useEffect, useState} from "react";
import "./App.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Tokenlink from "./components/Tokenlink/Tokenlink";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import {ethers} from "ethers";
import {deployTokenlink, getTokenlinkFactoryBalance, getDeployedTokenlinks,} from "./services/web3Service";
import {useWeb3} from "./Web3ModalContext";
import MainLayout from "./components/Layout/MainLayout";
import {useAppDispatch} from "./store";
import {connectWeb3} from "./store/utils";
import {useSelector} from "react-redux";
import {getAccounts, getTokenlinks, setTokenlinks} from "./store/wallet";
import Account from "./components/Account/Account";

const App = () => {
    const web3 = useWeb3();
    const dispatch = useAppDispatch();
    const tokenlinks = useSelector(getTokenlinks);
    const accounts = useSelector(getAccounts);
    const [factoryBalance, setFactoryBalance] = useState("");
    const [initialAmount, setInitialAmount] = useState("");

    useEffect(() => {
        dispatch(connectWeb3());
    }, []);

    const onDeployTokenlink = async () => {
        if (!web3.signer || !web3.provider) return;
        try {
            const result = await deployTokenlink(web3.signer);
            console.log("result", result);
            dispatch(setTokenlinks(await getDeployedTokenlinks(web3.signer)));
            const balance = await getTokenlinkFactoryBalance(web3.provider);
            setFactoryBalance(ethers.utils.formatEther(balance));
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <MainLayout
                            tokenlinks={tokenlinks}
                            accounts={accounts}
                            initialAmount={initialAmount}
                            factoryBalance={factoryBalance}
                            onDeployTokenlink={onDeployTokenlink}
                        />
                    }
                >
                    <Route
                        path="/"
                        element={
                            <AdminPanel
                                balance={factoryBalance}
                                setBalance={setFactoryBalance}
                                initialAmount={initialAmount}
                                setInitialAmount={setInitialAmount}
                            />
                        }
                    />
                    <Route path="tokenlinks/:address" element={<Tokenlink/>}/>
                    <Route path="accounts/:address" element={<Account/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
