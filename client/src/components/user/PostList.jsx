import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from './Post';

function PostList(props) {
  const { originPath, userId } = props;
  const [postList, setPostList] = useState([]);
  const [searchedUser, setSearchedUser] = useState('');
  
  useEffect(() => {
    if (searchedUser === userId) {
      return;
    }
        
    axios.get(process.env.REACT_APP_API_URL + originPath)
      .then((response) => {
        setPostList(response.data);        
        setSearchedUser(userId);
      })
      .catch((err) => {
        console.log(err);
        setPostList([]);
        setSearchedUser(userId);
      })
  }, [searchedUser, originPath]);

  return (
    <div id="post-list">
      { postList.map((post, index) => <Post post={post} key={post._id} />) }
    </div>
  );
}

export default PostList;