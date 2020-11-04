import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PostList(props) {
  const [postList, setPostList] = useState([]);
  const [likeList, setLikeList] = useState([]);
  const [didSearch, setDidSearch] = useState(false);
  
  useEffect(() => {
    if (didSearch) {
      return;
    }
    
    const userId = localStorage.getItem('odinbook_id');
    
    axios.get(`${process.env.REACT_APP_API_URL}/api/posts/relevant/${userId}`)
      .then((response) => {
        setPostList(response.data);
        setLikeList([...response.data].map((post) => {
          return {
            count: post.likes,
            liked: false
          };
        }));
        
        setDidSearch(true);
      })
      .catch((err) => {
        console.log(err);
        setDidSearch(true);
      })
  }, [didSearch]);
  
  const handleLike = async (index) => {
    const newList = [...likeList];
    const postId = postList[index]._id;
    
    if (!likeList[index].liked) {
      newList[index].count++;
      await axios.put(`${process.env.REACT_APP_API_URL}/api/posts/${postId}/like`);
    } else {
      newList[index].count--;
      await axios.put(`${process.env.REACT_APP_API_URL}/api/posts/${postId}/dislike`);
    }
    
    newList[index].liked = !newList[index].liked;
    setLikeList(newList);
  }
  
  return (
    <div>
      {
        postList.map((post, index) => 
          <fieldset key={post._id}>
            {post.content}
            <br/>
            by {post.author.firstName}&nbsp;{post.author.lastName}
            <br/><hr/>
            <button onClick={() => handleLike(index)}>Like</button>
            {likeList[index] ? likeList[index].count : ''}
          </fieldset>) 
      }
    </div>
  );
}

export default PostList;