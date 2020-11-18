import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';

function ForceRedirect(props) {
  // Not a good way of doing things, but this is here so I can set the user ID on localStorage when logging with FB.
  const { verifyAuth } = props;
  const [verified, setVerified] = useState(false);
  
  useEffect(() => {
    localStorage.setItem('csrfToken', Cookies.get('CSRF'));
    
    verifyAuth()
      .then(() => {
        setVerified(true);
      })
      .catch(() => {
        setVerified(true);
      })
  }, [verifyAuth]);
  
  if (verified) {
    return (
      <Redirect to="/" />
    );
  } else {
    return '';
  }
}

export default ForceRedirect;