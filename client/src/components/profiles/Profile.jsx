import React, { useState, useEffect } from 'react';
import { useParams, Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import PostList from '../user/PostList';
import noAvatar from '../../images/no-avatar.png';
import ErrorPage from '../misc/ErrorPage';

function Profile(props) {
  const [user, setUser] = useState(null);
  const [isSameUser, setIsSameUser] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [friendRequestId, setFriendRequestId] = useState('');
  const [finishedAsync, setFinishedAsync] = useState(true);
  const [requestedUser, setRequestedUser] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fatalError, setFatalError] = useState(false);
  const { userId } = useParams();
  const { verifyAuth } = props;
  const { isLogged } = props.state;
  
  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);
  
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/users/${userId}`)
      .then((response) => {
        setUser({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          birthDate: new Date(response.data.birthDate),
          gender: response.data.gender,
          friends: response.data.friends,
          photo: response.data.photo
        });
        
        const loggedUser = localStorage.getItem('odinbook_id');
        const friendIds = [...response.data.friends].map((friend) => friend._id);
        
        if (friendIds.indexOf(loggedUser) !== -1) {
          setIsFriend(true);
        }
      })
      .catch((err) => {
        setFatalError(true);
      })
  }, [userId]);
  
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/users/${userId}/friendrequests`)
      .then((response) => {
        const loggedUser = localStorage.getItem('odinbook_id');
        const requestFromUser = response.data.find((request) => request.sender._id === loggedUser);
        
        if (requestFromUser == null) {
          setFriendRequestId('');
        } else {
          setFriendRequestId(requestFromUser._id);
        }
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 404) {
            return;
          }
        }
        
        setFatalError(true);
      })
  }, [userId]);
  
  useEffect(() => {
    const loggedUser = localStorage.getItem('odinbook_id');
    
    axios.get(`${process.env.REACT_APP_API_URL}/api/users/${loggedUser}/friendrequests`)
      .then((response) => {
        const requestFromUser = response.data.find((request) => request.sender._id === userId);
        
        if (requestFromUser == null) {
          setRequestedUser(false);
        } else {
          setRequestedUser(true);
        }
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 404) {
            return;
          }
        }
        
        setFatalError(true);
      })
  }, [userId]);
  
  useEffect(() => {
    if (isLogged) {
      if (localStorage.getItem('odinbook_id') === userId) {
        setIsSameUser(true);
      }
    }
  }, [isLogged, userId]);
  
  const handleSendRequest = () => {
    setFinishedAsync(false);
    setErrorMessage('');
    
    const newRequest = {
      sender: localStorage.getItem('odinbook_id'),
      receiver: userId
    };
    
    const csrfToken = localStorage.getItem('csrfToken');
    
    axios.post(`${process.env.REACT_APP_API_URL}/api/friendrequests`, newRequest, { withCredentials: true, headers: {csrf: csrfToken} })
      .then((response) => {
        console.log(response);
        setFriendRequestId(response.data._id);
        setFinishedAsync(true);
      })
      .catch((err) => {
        setErrorMessage('An error occurred. Please try again later.');
      })
  }
  
  const handleCancelRequest = () => {
    setFinishedAsync(false);
    setErrorMessage('');
    
    axios.delete(`${process.env.REACT_APP_API_URL}/api/friendrequests/${friendRequestId}`)
      .then((response) => {
        console.log(response);
        setFriendRequestId('');
        setFinishedAsync(true);
      })
      .catch((err) => {
        setErrorMessage('An error occurred. Please try again later.');
      })
  }
  
  const handleUnfriend = async () => {
    setFinishedAsync(false);
    setErrorMessage('');
    
    const requesterId = localStorage.getItem('odinbook_id');
    
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/users/${requesterId}/unfriend`, { _id: userId });
      await axios.put(`${process.env.REACT_APP_API_URL}/api/users/${userId}/unfriend`, { _id: requesterId });
      
      const newUser = {...user};
      newUser.friends = newUser.friends.filter((friend) => friend._id.toString() !== requesterId);
      
      setIsFriend(false);
      setUser(newUser);
      setFinishedAsync(true);
    } catch (err) {
      setErrorMessage('An error occurred. Please try again later.');
    }
  }
  
  const acceptRequest = () => {
    window.location.href = '/requests';
  }
  
  if (fatalError) {
    return (<ErrorPage errorTitle="Uh-oh!" errorMessage="An error occurred on the server. Please try again later." />);
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
        <img src={user.photo || noAvatar} alt="User's avatar" id="profile-avatar" />
        
        <div id="profile-info">
          <h1>{user.firstName}&nbsp;{user.lastName}</h1>
          Born on {user.birthDate.toLocaleDateString('en-US')}, {user.gender === 'undefined' ? 'no gender defined' : user.gender}<br/>
        
          
          {
            isSameUser 
              ? '' 
              : ( isFriend
                  ? <button className="btn btn-primary btn-profile btn-large uses-font" disabled={!finishedAsync} onClick={handleUnfriend}>
                      <i className="fas fa-times"></i>  Unfriend
                    </button>
                  : ( requestedUser
                        ? <button className="btn btn-primary btn-profile btn-large uses-font"  onClick={acceptRequest}>
                            <i className="fas fa-check"></i> Accept friend request
                          </button>
                        : ( friendRequestId 
                            ? <button className="btn btn-primary btn-profile btn-large uses-font"  disabled={!finishedAsync} onClick={handleCancelRequest}>
                                <i className="fas fa-ban"></i> Cancel friend request
                              </button>
                            : <button className="btn btn-primary btn-profile btn-large uses-font"  disabled={!finishedAsync} onClick={handleSendRequest}>
                                <i className="fas fa-plus"></i> Send friend request
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
                <h2>Friends</h2>
                <Link className="no-underline" to={"/friends/" + userId}>Show all friends</Link>
              </div>
              
              <div id="profile-friend-list">
                { user.friends.map((friend) => 
                  <Link className="no-underline" key={friend._id} to={"/profile_redirect/" + friend._id}>
                    <div className="profile-friend-container">
                      <img src={friend.photo || noAvatar} alt="Avatar from user's friend" />
                      <span>{friend.firstName} {friend.lastName}</span>
                    </div>
                  </Link>)}
              </div>
            </div>
            
            <div id="profile-invisible" />
          </div>
          
          <PostList originPath={"/api/users/" + userId + "/posts"} userId={userId} renderCount={0} />
          
        </div>
      </div>
    );
  } else {
    return 'Loading user...';
  }
}

export default Profile;