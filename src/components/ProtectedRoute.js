import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = ({ component: Component, ...rest}) => {
  const { user } = useContext(UserContext);
  return(
    <Route {...rest} render={props => {
      if(user) {
        return <Component {...props} />
      } else {
        return <Redirect to="/login" />
      }
    }} />
  )
}

export default ProtectedRoute;