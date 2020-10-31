import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Profile(props) {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  
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
  });
  
  if (user) {
    return (
      <div>
        <h1>Now viewing profile of {user.firstName}&nbsp;{user.lastName}</h1>
        Born on {user.birthDate}<br/>
        {user.gender}<br/>
        Friend list:<br/>
        { user.friends.map((friend) => <div>{friend.firstName}&nbsp;{friend.lastName}</div>) }
      </div>
    );
  } else {
    return "";
  }
}

export default Profile;