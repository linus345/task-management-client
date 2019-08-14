import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

import Auth from './pages/Auth';
import Drawer from './components/Drawer';
import AppBar from './components/AppBar';
import ProtectedRoute from './components/ProtectedRoute';

import { UserContext } from './context/UserContext';

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
      } catch(error) {
        setUser(null);
        console.log(error.response);
      }
    }
    const token = localStorage.getItem('auth_token');
    if(token) {
      isAuthenticated(token);
    }
  }, []);

  return (
    <Router>
      <UserContext.Provider value={{ user, setUser }}>
        <div className={classes.app}>
          <AppBar user={user} />
          {user ? <Drawer /> : ''}
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Switch>
              <Route exact path="/" component={Index}/>
              <Route exact path="/login" render={() => <Auth isLogin={true} />} />
              <Route exact path="/signup" render={() => <Auth isLogin={false} />} />
              <ProtectedRoute exact path="/admin" component={Admin} />
              <Route render={() => <h1>404<br />Not Found</h1>} />
            </Switch>
          </main>
        </div>
      </UserContext.Provider>
    </Router>
  );
}

const Admin = () => {
  return(
    <h1>Admin</h1>
  )
}

const Index = () => {
  return(
    <div>
      <h1>Home</h1>
    </div>
  )
}

export default App;
