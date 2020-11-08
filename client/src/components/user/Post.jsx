import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Post(props) {
  const { post } = props;
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(props.post.likes.length);
  
  useEffect(() => {
    const userId = localStorage.getItem('odinbook_id');
    const foundUser = post.likes.find(user => user.toString() === userId);
    
    foundUser == null ? setIsLiked(false) : setIsLiked(true);
  }, [ post.likes ]);
  
  const handleLike = async () => {
    const userId = localStorage.getItem('odinbook_id');
    
    try {
      if (!isLiked) {
        setLikes(likes + 1);
        await axios.put(`${process.env.REACT_APP_API_URL}/api/posts/${post._id}/like`, { _id: userId });
      } else {
        setLikes(likes - 1);
        await axios.put(`${process.env.REACT_APP_API_URL}/api/posts/${post._id}/dislike`, { _id: userId });
      }
    } catch (err) {
      console.log(err);
    }
    
    setIsLiked(!isLiked);
  }
  
  return (
    <fieldset>
      {post.content}
      <br/>
      by {post.author.firstName}&nbsp;{post.author.lastName}
      <br/><hr/>
      
      <button onClick={() => handleLike()}>Like</button>
      {likes}&nbsp;{isLiked ? 'You already liked this post.' : 'You have not liked this post yet.'}
      <br/>
      <Link to={"/post/" + post._id}>Comments</Link>      
    </fieldset>
  );
}

export default Post;