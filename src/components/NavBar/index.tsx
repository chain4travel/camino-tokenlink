import { AppBar, Divider, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import CaminoLogo from "../../assets/camino_logo.png";
const NavBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar className="toolbar">
          <div className="flex gap-3">
            <img src={CaminoLogo} alt="logo" />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Camino
            </Typography>
            <Divider className="divider" orientation="vertical" flexItem />
            <Typography
              variant="h6"
              component="div"
              className="uppercase camino-title"
              sx={{ flexGrow: 1 }}
            >
              Coinlink
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
