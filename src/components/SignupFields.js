import React, { Fragment } from 'react';
import {
  TextField,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  textField: {
    marginBottom: '0px',
  },
});

const SignupFields = props => {
  const classes = useStyles();
  const { data } = props;

  return(
    <Fragment>
      <TextField
        error={!!(data.touched.email && data.errors && data.errors.email)}
        helperText={data.touched.email && data.errors && data.errors.email}
        id="outlined-email-input"
        label="Email"
        type="email"
        name="email"
        value={data.values.name}
        onChange={data.handleChange}
        onBlur={data.handleBlur}
        margin="normal"
        variant="outlined"
        className={classes.textField}
      />
      <TextField
        error={!!(data.touched.confirmEmail && data.errors && data.errors.confirmEmail)}
        helperText={data.touched.confirmEmail && data.errors && data.errors.confirmEmail}
        id="outlined-confirmEmail-input"
        label="Confirm email"
        type="email"
        name="confirmEmail"
        value={data.values.name}
        onChange={data.handleChange}
        onBlur={data.handleBlur}
        margin="normal"
        variant="outlined"
        className={classes.textField}
      />
      <TextField
        error={!!(data.touched.username && data.errors && data.errors.username)}
        helperText={data.touched.username && data.errors && data.errors.username}
        id="outlined-username-input"
        label="Username"
        type="text"
        name="username"
        value={data.values.name}
        onChange={data.handleChange}
        onBlur={data.handleBlur}
        margin="normal"
        variant="outlined"
        className={classes.textField}
      />
      <TextField
        error={!!(data.touched.password && data.errors && data.errors.password)}
        helperText={data.touched.password && data.errors && data.errors.password}
        id="outlined-password-input"
        label="Password"
        type="password"
        name="password"
        value={data.values.name}
        onChange={data.handleChange}
        onBlur={data.handleBlur}
        margin="normal"
        variant="outlined"
        className={classes.textField}
      />
      <TextField
        error={!!(data.touched.confirmPassword && data.errors && data.errors.confirmPassword)}
        helperText={data.touched.confirmPassword && data.errors && data.errors.confirmPassword}
        id="outlined-confirmPassword-input"
        label="Confirm password"
        type="password"
        name="confirmPassword"
        value={data.values.name}
        onChange={data.handleChange}
        onBlur={data.handleBlur}
        margin="normal"
        variant="outlined"
        className={classes.textField}
      />
    </Fragment>
  )
}

export default SignupFields;