import React from 'react';
import { Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';

function ForceRedirect(props) {
  // Previously used to set user id and csrf token on localStorage, and now only CSRF token.
  
  localStorage.setItem('csrfToken', Cookies.get('CSRF'));
  return (<Redirect to="/" />);
}

export default ForceRedirect;