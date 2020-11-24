import React, { useState, useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import axios from 'axios';
import PostList from '../user/PostList';
import noAvatar from '../../images/no-avatar.png';
import ErrorPage from '../misc/ErrorPage';
import localStrings from '../../localization';

function Profile(props) {
  const [user, setUser] = useState(null);
  const [isSameUser, setIsSameUser] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [friendRequestId, setFriendRequestId] = useState('');
  const [finishedAsync, setFinishedAsync] = useState(true);
  const [requestedUser, setRequestedUser] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fatalError, setFatalError] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);
  const { userId } = useParams();
  const { verifyAuth } = props;
  const { loggedUserId } = props.state;
  const locale = localStorage.getItem('localizationCode') === 'en-US' ? 'en-US' : 'pt-BR';
  
  useEffect(() => {
    return () => { setIsUnmounted(true) }
  }, []);
  
  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);
  
  useEffect(() => {
    if (!loggedUserId) {
      return;
    }
    
    axios.get(`${process.env.REACT_APP_API_URL}/api/users/${userId}`)
      .then((response) => {
        if (!isUnmounted) {
          setUser({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            birthDate: new Date(response.data.birthDate),
            gender: response.data.gender,
            friends: response.data.friends,
            photo: response.data.photo
          });
        }
        
        const friendIds = [...response.data.friends].map((friend) => friend._id);
        
        if (friendIds.indexOf(loggedUserId) !== -1 && !isUnmounted) {
          setIsFriend(true);
        }
      })
      .catch((err) => {
        setFatalError(true);
      })
  }, [userId, isUnmounted, loggedUserId]);
  
  useEffect(() => {
    if (!loggedUserId) {
      return;
    }
    
    axios.get(`${process.env.REACT_APP_API_URL}/api/users/${userId}/friendrequests`)
      .then((response) => {
        const requestFromUser = response.data.find((request) => request.sender._id === loggedUserId);
        
        if (!isUnmounted) {
          if (requestFromUser == null) {
            setFriendRequestId('');
          } else {
            setFriendRequestId(requestFromUser._id);
          }
        }
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 404) {
            return;
          }
        }
        
        if (!isUnmounted) {
          setFatalError(true);
        }
      })
  }, [userId, isUnmounted, loggedUserId]);
  
  useEffect(() => {
    if (!loggedUserId) {
      return;
    }
    
    axios.get(`${process.env.REACT_APP_API_URL}/api/users/${loggedUserId}/friendrequests`)
      .then((response) => {
        const requestFromUser = response.data.find((request) => request.sender._id === userId);
        
        if (!isUnmounted) {
          if (requestFromUser == null) {
            setRequestedUser(false);
          } else {
            setRequestedUser(true);
          }
        }
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 404) {
            return;
          }
        }
        
        if (!isUnmounted) {
          setFatalError(true);
        }
      })
  }, [userId, isUnmounted, loggedUserId]);
  
  useEffect(() => {
    if (loggedUserId) {
      if (loggedUserId === userId && !isUnmounted) {
        setIsSameUser(true);
      }
    }
  }, [loggedUserId, userId, isUnmounted]);
  
  const handleSendRequest = () => {
    setFinishedAsync(false);
    setErrorMessage('');
    
    const newRequest = {
      sender: loggedUserId,
      receiver: userId
    };
    
    const csrfToken = localStorage.getItem('csrfToken');
    
    axios.post(`${process.env.REACT_APP_API_URL}/api/friendrequests`, newRequest, { withCredentials: true, headers: {csrf: csrfToken} })
      .then((response) => {
        if (!isUnmounted) {
          setFriendRequestId(response.data._id);
          setFinishedAsync(true);
        }
      })
      .catch((err) => {
        if (!isUnmounted) {
          setErrorMessage(localStrings[locale]['profile']['error']['internal']);
        }
      })
  }
  
  const handleCancelRequest = () => {
    setFinishedAsync(false);
    setErrorMessage('');
    
    axios.delete(`${process.env.REACT_APP_API_URL}/api/friendrequests/${friendRequestId}`)
      .then((response) => {
        if (!isUnmounted) {
          setFriendRequestId('');
          setFinishedAsync(true);
        }
      })
      .catch((err) => {
        if (!isUnmounted) {
          setErrorMessage(localStrings[locale]['profile']['error']['internal']);
        }
      })
  }
  
  const handleUnfriend = async () => {
    setFinishedAsync(false);
    setErrorMessage('');
    
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/users/${loggedUserId}/unfriend`, { _id: userId });
      await axios.put(`${process.env.REACT_APP_API_URL}/api/users/${userId}/unfriend`, { _id: loggedUserId });
      
      const newUser = {...user};
      newUser.friends = newUser.friends.filter((friend) => friend._id.toString() !== loggedUserId);
      
      if (!isUnmounted) {
        setIsFriend(false);
        setUser(newUser);
        setFinishedAsync(true);
      }
    } catch (err) {
      if (!isUnmounted) {
        setErrorMessage(localStrings[locale]['profile']['error']['internal']);
      }
    }
  }
  
  const acceptRequest = () => {
    window.location.href = '/requests';
  }
  
  if (fatalError) {
    return (
      <ErrorPage 
        errorTitle={localStrings[locale]['profile']['error']['fatalTitle']} 
        errorMessage={localStrings[locale]['profile']['error']['fatalMessage']} 
      />
    );
  }
  
  if (props.state.loading) {
    return 'Loading auth...';
  } else if (!props.state.isLogged) {
    return (<Redirect to="/" />);
  } else if (user) {
    return (
      <div id="profile">
        <div id="profile-top-bg"/>
        <div id="profile-banner"/>
        <img src={user.photo || noAvatar} alt={localStrings[locale]['profile']['alt']['avatar']} id="profile-avatar" />
        
        <div id="profile-info">
          <h1>{user.firstName}&nbsp;{user.lastName}</h1>
          {localStrings[locale]['profile']['bornPrefix']}&nbsp;{user.birthDate.toLocaleDateString(locale)},&nbsp;
          {
            user.gender === 'undefined' 
            ? localStrings[locale]['profile']['noGender'] 
            : user.gender === 'male'
              ? localStrings[locale]['profile']['male']
              : user.gender === 'female'
                ? localStrings[locale]['profile']['female']
                : localStrings[locale]['profile']['other']
          }
          <br/>
        
          
          {
            isSameUser 
              ? '' 
              : ( isFriend
                  ? <button className="btn btn-primary btn-profile btn-large uses-font" disabled={!finishedAsync} onClick={handleUnfriend}>
                      <i className="fas fa-times"></i>  {localStrings[locale]['profile']['unfriend']}
                    </button>
                  : ( requestedUser
                        ? <button className="btn btn-primary btn-profile btn-large uses-font"  onClick={acceptRequest}>
                            <i className="fas fa-check"></i> {localStrings[locale]['profile']['accept']}
                          </button>
                        : ( friendRequestId 
                            ? <button className="btn btn-primary btn-profile btn-large uses-font"  disabled={!finishedAsync} onClick={handleCancelRequest}>
                                <i className="fas fa-ban"></i> {localStrings[locale]['profile']['cancel']}
                              </button>
                            : <button className="btn btn-primary btn-profile btn-large uses-font"  disabled={!finishedAsync} onClick={handleSendRequest}>
                                <i className="fas fa-plus"></i> {localStrings[locale]['profile']['send']}
                              </button>
                          )
                    )
                ) 
          }
          
          { errorMessage && <span className="error-message">{errorMessage}</span> }
        </div>
        
        <div id="profile-friends-posts">
        
          <div id="profile-sidebar">
            <div id="profile-friends">
              <div id="profile-friends-header">
                <h2>{localStrings[locale]['profile']['headerFriends']}</h2>
                <a className="no-underline" href={"/friends/" + userId}>{localStrings[locale]['profile']['showAllFriends']}</a>
              </div>
              
              <div id="profile-friend-list">
                { user.friends.map((friend) => 
                  <a className="no-underline" key={friend._id} href={"/profile_redirect/" + friend._id}>
                    <div className="profile-friend-container">
                      <img src={friend.photo || noAvatar} alt={localStrings[locale]['profile']['alt']['avatarFriend']} />
                      <span>{friend.firstName} {friend.lastName}</span>
                    </div>
                  </a>)}
              </div>
            </div>
            
            <div id="profile-invisible" />
          </div>
          
          <PostList originPath={"/api/users/" + userId + "/posts"} loggedUserId={loggedUserId} renderCount={0} />
          
        </div>
      </div>
    );
  } else {
    return 'Loading user...';
  }
}

export default Profile;