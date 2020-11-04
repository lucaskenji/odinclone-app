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
          console.log(response);
          setLoggedOut(true);
        })
        .catch((err) => {
          console.log(err);
        })
    } else {
      verifyAuth()
        .then(() => {
          setUpdatedState(true);
        })
        .catch((err) => {
          console.log(err);
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