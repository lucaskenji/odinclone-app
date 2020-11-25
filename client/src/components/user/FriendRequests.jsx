import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import noAvatar from '../../images/no-avatar.png';
import localStrings from '../../localization';

function FriendRequests(props) {
  const { verifyAuth } = props;
  const { loggedUserId } = props.state;
  const [requestList, setRequestList] = useState([]);
  const [disableButton, setDisableButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const locale = localStorage.getItem('localizationCode') === 'en-US' ? 'en-US' : 'pt-BR';
  
  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  useEffect(() => {
    if (loggedUserId) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/users/${loggedUserId}/friendrequests`)
        .then((response) => {
          setRequestList(response.data);
        })
        .catch((err) => {
          // Show no requests if no answer from the server.
        })
    }
  }, [loggedUserId]);
  
  const handleRequest = async (buttonClicked, requestObject) => {    
    setDisableButton(true);
    setErrorMessage('');
    const friendId = requestObject.sender._id;
    const requestId = requestObject._id;

    const addEachOther = () => {
      return new Promise(async (resolve, reject) => {          
          try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/users/${loggedUserId}/friend`, { _id: friendId });
            await axios.put(`${process.env.REACT_APP_API_URL}/api/users/${friendId}/friend`, { _id: loggedUserId });
            return resolve();
          } catch (err) {            
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
      setErrorMessage(localStrings[locale]['friendRequests']['error']['internal']);
    }
    
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
        <h1>{localStrings[locale]['friendRequests']['header']}</h1>
        
        { requestList.length === 0 ? localStrings[locale]['friendRequests']['noRequest'] : '' }
        
        { requestList.map((request) =>
          <div className="request-div" key={request._id} onClick={() => visitProfile(request.sender._id)}>
            <img 
              src={request.sender.photo || noAvatar} 
              alt={localStrings[locale]['friendRequests']['alt']['avatar']} 
              className="request-avatar" 
            />
            
            <div>
              {request.sender.firstName}&nbsp;{request.sender.lastName}<br/>
              <div className="request-buttons">
                <button className="btn btn-primary uses-font btn-large" 
                        disabled={disableButton} 
                        onClick={(ev) => mapEventHandler(ev, 'accept', request)}>
                  {localStrings[locale]['friendRequests']['accept']}
                </button>
                <button className="btn btn-secondary uses-font btn-large" 
                        disabled={disableButton} 
                        onClick={(ev) => mapEventHandler(ev, 'decline', request)}>
                  {localStrings[locale]['friendRequests']['decline']}
                </button>
              </div>
              { errorMessage && <div className="error-message">{errorMessage}</div> }
            </div>
          </div>) }
      </div>
    );
  }
}

export default FriendRequests;