import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from "@mui/material";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DevicesIcon from '@mui/icons-material/Devices';
import EventIcon from '@mui/icons-material/Event';

const drawerWidth = 240;

const NavBar = (props) => {
  console.log(props);
  const { window, show } = props;

  const [mobileOpen, setMobileOpen] = React.useState(false);

  if (!show) return null;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <List>
        <ListItem />
        <ListItemButton component={Link} href="/users">
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary={"Users"} />
        </ListItemButton>
        <ListItemButton component={Link} href="/devices">
          <ListItemIcon>
            <DevicesIcon />
          </ListItemIcon>
          <ListItemText primary={"Devices"} />
        </ListItemButton>
        <ListItemButton component={Link} href="/matches">
          <ListItemIcon>
            <EventIcon />
          </ListItemIcon>
          <ListItemText primary={"Matches"} />
        </ListItemButton>
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="nav menu"
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, top: '6em', zIndex: 0 },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, top: '6em', zIndex: 0 },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

NavBar.propTypes = {
  window: PropTypes.func,
};

export default NavBar;
