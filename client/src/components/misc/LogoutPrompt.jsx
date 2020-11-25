import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

function LogoutPrompt(props) {
  const [loggedOut, setLoggedOut] = useState(false);
  const [updatedState, setUpdatedState] = useState(false);
  const { verifyAuth } = props;
  
  useEffect(() => {
    if (!loggedOut) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/logout`, { withCredentials: true })
        .then((response) => {
          setLoggedOut(true);
        })
        .catch((err) => {
          // It's hard for this route to fail, but a connection error would probably logout the user anyway
          setLoggedOut(true);
        })
    } else {
      verifyAuth()
        .then(() => {
          setUpdatedState(true);
        })
        .catch((err) => {
          // It's hard for verifyAuth' route to fail, but a connection error would probably logout the user anyway
          setUpdatedState(true);
        })
    }
  }, [loggedOut, verifyAuth]);
  
  if (loggedOut && updatedState) {
    return <Redirect to="/" />
  } else {
    return 'Logging out...';
  }
}

export default LogoutPrompt;