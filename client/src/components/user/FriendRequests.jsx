import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';

function FriendRequests(props) {
  const { verifyAuth } = props;
  const [requestList, setRequestList] = useState([]);
  const [disableButton, setDisableButton] = useState(false);
  
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
  
  const handleRequest = async (buttonClicked, requestObject) => {
    setDisableButton(true);
    const friendId = requestObject.sender._id;
    const requestId = requestObject._id;

    const addEachOther = () => {
      return new Promise(async (resolve, reject) => {
          const userId = localStorage.getItem('odinbook_id');
          
          try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/users/${userId}/friend`, { _id: friendId });
            await axios.put(`${process.env.REACT_APP_API_URL}/api/users/${friendId}/friend`, { _id: userId });
            return resolve();
          } catch (err) {
            if (err.response) {
              console.log(err.response);
            }
            
            return reject(err);
          }
      });
    }
    
    try { 
      if (buttonClicked === 'accept') {
        await addEachOther();
      }
      
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/friendrequests/${requestId}`);
      setRequestList( [...requestList].filter((request) => request._id !== requestObject._id) );
    } catch (err) {
      console.log(err);
    }
    
    console.log('Operations done.');
    setDisableButton(false);
  }
  
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
            <button disabled={disableButton} onClick={() => handleRequest('accept', request)}>Accept</button>
            <button disabled={disableButton} onClick={() => handleRequest('decline', request)}>Decline</button>
          </fieldset>) }
      </div>
    );
  }
}

export default FriendRequests;