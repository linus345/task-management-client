import React from 'react';
import AuthLayout from '../layouts/AuthLayout';
import AuthForm from '../components/AuthForm';

const Auth = props => {
  return(
    <AuthLayout>
      <AuthForm isLogin={props.isLogin} />
    </AuthLayout>
  )
}

export default Auth;