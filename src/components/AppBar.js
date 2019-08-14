import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar as MUIAppBar,
  Toolbar,
  Button,
  Typography,
  Link,
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';
import {
  AccountCircle,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  spacer: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    minHeight: '100vh',
  },
}));

const AppBar = props => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  
  const handleClose = () => {
    setAnchorEl(null);
  }

  return(
    <MUIAppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Link
          to="/"
          component={RouterLink}
          color="inherit"
          underline="none"
        >
          <Typography variant="h6">Task management</Typography>
        </Link>
        <div className={classes.spacer}/>
        {props.user ? 
          <div>
            <IconButton
              aria-label="current user account"
              aria-controls="account-menu"
              aria-haspopup="true"
              onClick={e => setAnchorEl(e.currentTarget)}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="account-menu"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={isOpen}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
            </Menu>
          </div> :
          <>
            <Button color="inherit" component={RouterLink} to="/login">Login</Button>
            <Button color="inherit" component={RouterLink} to="/signup">Signup</Button>
          </>
        }
      </Toolbar>
    </MUIAppBar>
  )
}

export default AppBar;