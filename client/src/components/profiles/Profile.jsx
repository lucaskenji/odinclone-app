import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Profile(props) {
  const [user, setUser] = useState(null);
  const [isSameUser, setIsSameUser] = useState(false);
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
          birthDate: response.data.birthDate,
          gender: response.data.gender,
          friends: response.data.friends
        });
      })
      .catch((err) => {
        console.log(err);
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
    const newRequest = {
      sender: localStorage.getItem('odinbook_id'),
      receiver: userId
    };
    
    axios.post(`${process.env.REACT_APP_API_URL}/api/friendrequests`, newRequest)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      })
  }
  
  if (user) {
    return (
      <div>
        <h1>Now viewing profile of {user.firstName}&nbsp;{user.lastName}</h1>
        Born on {user.birthDate}<br/>
        {user.gender}<br/>
        Friend list:<br/>
        { user.friends.map((friend) => <div>{friend.firstName}&nbsp;{friend.lastName}</div>) }
        
        <br/>
        { isLogged 
          ? ( isSameUser ? 'Same user.' : <button onClick={handleSendRequest}>Send friend request</button> ) 
          : 'Login to friend this user.' }
      </div>
    );
  } else {
    return 'Loading...';
  }
}

export default Profile;