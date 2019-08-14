import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardContent,
  Button,
  Link,
  Box,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';

import LoginFields from './LoginFields';
import SignupFields from './SignupFields';

import { UserContext } from '../context/UserContext';

const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  confirmEmail: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(25, 'Username can\'t be longer than 25 characters')
    .required('Username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .max(40, 'Password can\'t be longer than 40 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .max(40, 'Password can\'t be longer than 40 characters')
    .required('Password is required'),
});

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .max(40, 'Password can\'t be longer than 40 characters')
    .required('Password is required'),
});

const useStyles = makeStyles(theme => ({
  card: {
    minWidth: '400px',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
  },

  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(0.5),
  }
}));

const AuthForm = props => {
  const classes = useStyles();
  const [isLogin, setIsLogin] = useState(props.isLogin);
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    setIsLogin(props.isLogin);
  }, [props.isLogin]);

  const handleSignup = async values => {
    try {
      const url = process.env.REACT_APP_API_URL + '/signup';
      const { username, email, password } = values;
      const res = await axios.post(url, {
        username,
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(res);
      return res;
    } catch(error) {
      if(error) {
        console.log(error);
        return error;
      }
    }
  }
  
  const handleLogin = async values => {
    try {
      const url = process.env.REACT_APP_API_URL + '/login';
      const { email, password } = values;
      const res = await axios.post(url, {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(res.data);
      localStorage.setItem('auth_token', res.data.token);
      setUser(res.data.user);
      return;
    } catch(error) {
      console.log(error);
      return error;
    }
  }

  return(
    <Card className={classes.card}>
      <CardContent>
        <Formik
          validationSchema={isLogin ? LoginSchema : SignupSchema}
          initialValues={isLogin ? {
            email: '',
            password: '',
          } : {
            email: '',
            confirmEmail: '',
            username: '',
            password: '',
            confirmPassword: '',
          }}
          enableReinitialize={true}
          onSubmit={isLogin ? handleLogin : handleSignup}
          render={props => (
            <form 
              onSubmit={props.handleSubmit}
              className={classes.form}
            >
              {isLogin ?
                <LoginFields data={props} /> :
                <SignupFields data={props} />
              }
              <Button 
                variant="contained"
                color="primary"
                type="submit"
                className={classes.button}
              >
                <Typography variant="button">
                  {isLogin ? 'Login' : 'Signup'}
                </Typography>
              </Button>
              <Box textAlign="left">
                <Link
                  component={RouterLink}
                  to={isLogin ? '/signup' : '/login'}
                >
                  <Typography variant="caption">
                    {isLogin ? 
                      'Don\'t have an account? Signup' :
                      'Already have an account? Login'
                    }
                  </Typography>
                </Link>
              </Box>
            </form>
          )}
        />
      </CardContent>
    </Card>
  )
}

export default AuthForm;