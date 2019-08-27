// TODO: Implement global loading variable to show loading screen when fetching data (this will probably solve issue with protected routes as well)
// TODO: Make a axios function in a separate file to keep it DRY

import React, { useState, useEffect, useReducer } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
// import { purple } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/styles';
import axios from 'axios';

import Auth from './pages/Auth';
import Boards from './pages/Boards';
import Board from './pages/Board';
import Drawer from './components/Drawer';
import AppBar from './components/AppBar';
import ProtectedRoute from './components/ProtectedRoute';
import Loading from './components/Loading';

import ErrorAlert from './components/alerts/Error';
import SuccessAlert from './components/alerts/Success';

import { UserContext } from './context/UserContext';
import { AlertContext } from './context/AlertContext';

import { alertsReducer, SUCCESS_ALERT, ERROR_ALERT } from './reducers/alerts';

const theme = createMuiTheme({
  // palette: {
  //   primary: purple,
  //   // action: {
  //   //   //hover: 'red',
  //   //   selected: purple[50],
  //   // }
  // },
});

const useStyles = makeStyles(theme => ({
  app: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    minHeight: '100vh',
  },
  toolbar: theme.mixins.toolbar,
}));

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alerts, dispatch] = useReducer(alertsReducer, {
    error: null,
    success: null,
  });
  const classes = useStyles();

  useEffect(() => {
    async function isAuthenticated(token) {
      try {
        const url = process.env.REACT_APP_API_URL + '/verify';
        const res = await axios.post(url, {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log('User when verifying: ', res.data.user);
        setUser(res.data.user);
        setIsLoading(false);
      } catch(error) {
        setUser(null);
        setIsLoading(false);
        console.log(error.response);
      }
    }
    const token = localStorage.getItem('auth_token');
    if(token) {
      setIsLoading(true);
      isAuthenticated(token);
    } else {
      setIsLoading(false);
      setUser(null);
    }
  }, []);

  // if(isLoading) return <Loading />;
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <UserContext.Provider value={{ user, setUser }}>
          <AlertContext.Provider value={{ alerts, dispatch }}>
            {/* Display any success or error messages if there are any */}
            {alerts.success && <SuccessAlert message={alerts.success} onClose={() => dispatch({ type: SUCCESS_ALERT, message: null })}/>}
            {alerts.error && <ErrorAlert message={alerts.error} onClose={() => dispatch({ type: ERROR_ALERT, message: null })}/>}
            {/* {isLoading && <Loading />} */}
            <div className={classes.app}>
              <AppBar user={user} />
              {user ? <Drawer /> : ''}
              <main className={classes.content}>
                <div className={classes.toolbar} />
                <Switch>
                  <Route exact path="/" component={Index}/>
                  <Route exact path="/login" render={() => <Auth isLogin={true} />} />
                  <Route exact path="/signup" render={() => <Auth isLogin={false} />} />
                  <Route exact path="/boards" component={Boards} />
                  <Route exact path="/boards/:id" component={Board} />
                  <Route render={() => <h1>404<br />Not Found</h1>} />
                </Switch>
              </main>
            </div>
          </AlertContext.Provider>
        </UserContext.Provider>
      </Router>
    </ThemeProvider>
  );
}

const Index = () => {
  return(
    <div>
      <h1>Home</h1>
    </div>
  )
}

export default App;
