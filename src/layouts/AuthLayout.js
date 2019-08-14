import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => {
  return({
    grid: {
      minHeight: 'calc(100vh - 56px)',
      width: '100%',
    },
    [theme.breakpoints.up('sm')]: {
      grid: {
        minHeight: 'calc(100vh - 64px)',
      },
    },
  })
});

const AuthLayout = props => {
  const classes = useStyles();
  return(
    <Grid
      className={classes.grid}
      container
      direction="row"
      justify="center"
      alignItems="center"
    >
      {props.children}
    </Grid>
  )
}

export default AuthLayout;