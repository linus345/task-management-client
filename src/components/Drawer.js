import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Drawer as MUIDrawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
} from  '@material-ui/core';
import {
  Mail as MailIcon,
  MoveToInbox,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 200;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  list: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  listItem: {
    borderRadius: '4px',
  },
  toolbar: theme.mixins.toolbar,
}));

const Drawer = () => {
  const classes = useStyles();

  return(
    <MUIDrawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.toolbar} />
      <List className={classes.list}>
        {[{
          text: 'Home',
          path: '/',
        }, {
          text: 'Groups',
          path: '/groups',
        }, {
          text: 'Friends',
          path: '/friends',
        }, {
          text: 'Boards',
          path: '/boards',
        }].map(({ text, path }, index) => (
          <Link
            to={path}
            component={RouterLink}
            color="inherit"
            underline="none"
            key={text}
          >
            <ListItem button className={classes.listItem}>
              <ListItemIcon>{index % 2 === 0 ? <MoveToInbox /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
      <List className={classes.list}>
        {['Activity', 'Analytics'].map((text, index) => (
          <Link
            to="/"
            component={RouterLink}
            color="inherit"
            underline="none"
            key={text}
          >
            <ListItem button className={classes.listItem}>
              <ListItemIcon>{index % 2 === 0 ? <MoveToInbox /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          </Link>
        ))}
      </List>
    </MUIDrawer>
  )
}

export default Drawer;