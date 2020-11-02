import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';

function FriendRequests(props) {
  const { verifyAuth } = props;
  const [requestList, setRequestList] = useState([]);
  
  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  useEffect(() => {
    if (props.state.isLogged) {
      const userId = localStorage.getItem('odinbook_id');
      
      axios.get(`${process.env.REACT_APP_API_URL}/api/users/${userId}/friendrequests`)
        .then((response) => {
          setRequestList(response.data);
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }, [props.state.isLogged]);
  
  if (props.state.loading) {
    return 'Loading...';
  } else if (!props.state.isLogged) {
    return (<Redirect to="/" />);
  } else {
    return (
      <div>
        <h1>Friend requests</h1>
        <hr/>
        
        { requestList.map((request) => 
          <fieldset key={request._id}>
            {request.sender.firstName}<br/>
            <button>Accept</button>
            <button>Decline</button>
          </fieldset>) }
      </div>
    );
  }
}

export default FriendRequests;