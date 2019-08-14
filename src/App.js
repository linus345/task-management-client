import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Link,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import { UserContext } from './context/UserContext';
import axios from 'axios';

function Admin() {
  return(
    <h1>Admin</h1>
  )
}

function Index() {
  return(
    <div>
      <h1>Home</h1>
    </div>
  )
}

const useStyles = makeStyles({
  title: {
    flexGrow: 1,
  }
});

function App() {
  const [user, setUser] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    async function isAuthenticated(token) {
      try {
        const url = process.env.REACT_APP_API_URL + '/verify';
        const res = await axios.post(url, {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'content-type': 'application/json',
            'accept': 'application/json',
          },
        });
        console.log('response from client: ', res.data.user);
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
        {/* <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/admin">Admin</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </ul>
        </nav> */}
        <AppBar position="static">
          <Toolbar>
            <Link
              to="/"
              component={RouterLink}
              color="inherit"
              underline="none"
              className={classes.title}
            >
              <Typography variant="h6">Task management</Typography>
            </Link>
            {user ? 
              'User' :
              <>
                <Button color="inherit" component={RouterLink} to="/login">Login</Button>
                <Button color="inherit" component={RouterLink} to="/signup">Signup</Button>
              </>
            }
          </Toolbar>
        </AppBar>
        <Switch>
          <Route exact path="/" component={Index}/>
          <Route exact path="/login" render={() => <Auth isLogin={true} />} />
          <Route exact path="/signup" render={() => <Auth isLogin={false} />} />
          <ProtectedRoute exact path="/admin" component={Admin} />
          <Route render={() => <h1>404<br />Not Found</h1>} />
        </Switch>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
