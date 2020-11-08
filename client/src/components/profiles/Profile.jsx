import React, { useState, useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import axios from 'axios';
import PostList from '../user/PostList';

function Profile(props) {
  const [user, setUser] = useState(null);
  const [isSameUser, setIsSameUser] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
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
        
        const loggedUser = localStorage.getItem('odinbook_id');
        const friendIds = [...response.data.friends].map((friend) => friend._id);
        
        if (friendIds.indexOf(loggedUser) !== -1) {
          setIsFriend(true);
        }
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
  
  const handleUnfriend = async () => {
    const requesterId = localStorage.getItem('odinbook_id');
    
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/users/${requesterId}/unfriend`, { _id: userId });
      await axios.put(`${process.env.REACT_APP_API_URL}/api/users/${userId}/unfriend`, { _id: requesterId });
      
      const newUser = {...user};
      newUser.friends = newUser.friends.filter((friend) => friend._id.toString() !== requesterId);
      
      setIsFriend(false);
      setUser(newUser);
    } catch (err) {
      console.log(err.response);
    }
  }
  
  if (props.state.loading) {
    return 'Loading auth...';
  } else if (!props.state.isLogged) {
    return (<Redirect to="/" />);
  } else if (user) {
    return (
      <div>
        <h1>Now viewing profile of {user.firstName}&nbsp;{user.lastName}</h1>
        Born on {user.birthDate}<br/>
        {user.gender}<br/>
        Friend list:<br/>
        { user.friends.map((friend) => <div key={friend._id}>{friend.firstName}&nbsp;{friend.lastName}</div>) }
        
        <br/>
        { isLogged 
          ? ( isSameUser 
              ? 'Same user.' 
              : ( isFriend
                  ? <button onClick={handleUnfriend}>Unfriend</button>
                  : <button onClick={handleSendRequest}>Send friend request</button>
                ) 
            ) 
          : 'Login to friend this user.' }
          
        <PostList originPath={"/api/users/" + userId + "/posts"} />
      </div>
    );
  } else {
    return 'Loading user...';
  }
}

export default Profile;