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
      axios.get(`${process.env.REACT_APP_API_URL}/api/friendrequests`)
        .then((response) => {
          const userId = localStorage.getItem('odinbook_id');
          const requests = [...response.data].filter((request) => request.receiver._id === userId);
          setRequestList(requests);
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
        { requestList.map((request) => <div key={request._id}>{request.sender.firstName}</div>) }
      </div>
    );
  }
}

export default FriendRequests;