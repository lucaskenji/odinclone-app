import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import noAvatar from '../../images/no-avatar.png';

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
  
  const mapEventHandler = (ev, option, request) => {
    ev.stopPropagation();
    handleRequest(option, request);
  }
  
  const visitProfile = (id) => {
    window.location.href = '/profile/' + id;
  }
  
  if (props.state.loading) {
    return 'Loading...';
  } else if (!props.state.isLogged) {
    return (<Redirect to="/" />);
  } else {
    return (
      <div id="requests-container">
        <h1>Friend Requests</h1>
        
        { requestList.length === 0 ? 'No new requests.' : '' }
        
        { requestList.map((request) =>
          <div className="request-div" key={request._id} onClick={() => visitProfile(request.sender._id)}>
            <img src={request.sender.photo || noAvatar} alt="Request sender's avatar" className="request-avatar" />
            
            <div>
              {request.sender.firstName}&nbsp;{request.sender.lastName}<br/>
              <div className="request-buttons">
                <button className="btn btn-primary uses-font btn-large" 
                        disabled={disableButton} 
                        onClick={(ev) => mapEventHandler(ev, 'accept', request)}>
                  Accept
                </button>
                <button className="btn btn-secondary uses-font btn-large" 
                        disabled={disableButton} 
                        onClick={(ev) => mapEventHandler(ev, 'decline', request)}>
                  Decline
                </button>
              </div>
            </div>
          </div>) }
      </div>
    );
  }
}

export default FriendRequests;