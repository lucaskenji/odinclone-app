import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from './Post';

function PostList(props) {
  const { originPath } = props;
  const [postList, setPostList] = useState([]);
  const [didSearch, setDidSearch] = useState(false);
  
  useEffect(() => {
    if (didSearch) {
      return;
    }
        
    axios.get(process.env.REACT_APP_API_URL + originPath)
      .then((response) => {
        setPostList(response.data);        
        setDidSearch(true);
      })
      .catch((err) => {
        console.log(err);
        setDidSearch(true);
      })
  }, [didSearch, originPath]);
  
  return (
    <div>
      { postList.map((post, index) => <Post post={post} key={post._id} />) }
    </div>
  );
}

export default PostList;