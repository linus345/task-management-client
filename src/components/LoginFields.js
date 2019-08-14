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

const LoginFields = props => {
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
        value={data.values.email}
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
        value={data.values.password}
        onChange={data.handleChange}
        onBlur={data.handleBlur}
        margin="normal"
        variant="outlined"
        className={classes.textField}
      />
    </Fragment>
  )
}

export default LoginFields;