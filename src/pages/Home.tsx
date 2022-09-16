import {Button, Typography} from "@mui/material";
import {useAppDispatch} from "../store";
import {connectWeb3} from "../store/utils";
import Astronaut from "./../assets/astronaut.png";

const Home = () => {
    const dispatch = useAppDispatch();
    return (
        <div className="flex flex-col items-center gap-3 m-3">
            <img className={"max-w-lg"} src={Astronaut} alt="Astronaut"/>
            <Typography variant={"h6"} color="text.secondary">
                Connect your wallet to manage your tokenlinks
            </Typography>
            <Button
                variant="contained"
                className={'gradient-button'}
                onClick={() => {
                    dispatch(connectWeb3());
                }}
            >
                Connect Wallet
            </Button>
        </div>
    );
};

export default Home;
