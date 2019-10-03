import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  loadingContainer: {
    // position: 'absolute',
    width: '100%',
    height: '100vh',
    backgroundColor: theme.palette.common.white,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: theme.zIndex.drawer + 1,
  },
  spinner: {
    width: '60px',
    height: '60px',
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderRadius: '50%',
    borderTop: `6px solid ${theme.palette.secondary.main}`,
    borderLeft: `6px solid ${theme.palette.secondary.main[50]}`,
    borderBottom: `6px solid ${theme.palette.secondary.main[50]}`,
    borderRight: '6px solid rgba(255, 255, 255, 0)',
    animation: '$spinning 0.8s infinite linear',
  },
  '@keyframes spinning': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    }
  },
}));

const Loading = () => {
  const classes = useStyles();
  return(
    <div className={classes.loadingContainer}>
      <div className={classes.spinner}></div>
    </div>
  )
}

export default Loading;