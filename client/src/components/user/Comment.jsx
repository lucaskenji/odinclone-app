import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Comment(props) {
  const { comment } = props;
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(props.comment.likes.length);
  
  useEffect(() => {
    const userId = localStorage.getItem('odinbook_id');
    const foundUser = comment.likes.find(user => user.toString() === userId);
    
    foundUser == null ? setIsLiked(false) : setIsLiked(true);
  }, [ comment.likes ]);
  
  const handleLike = async () => {
    const userId = localStorage.getItem('odinbook_id');
    
    try {
      if (!isLiked) {
        setLikes(likes + 1);
        await axios.put(`${process.env.REACT_APP_API_URL}/api/posts/${comment.post}/comments/${comment._id}/like`, { _id: userId });
      } else {
        setLikes(likes - 1);
        await axios.put(`${process.env.REACT_APP_API_URL}/api/posts/${comment.post}/comments/${comment._id}/dislike`, { _id: userId });
      }
    } catch (err) {
      console.log(err);
    }
    
    setIsLiked(!isLiked);
  }
  
  return (
    <div>
      <hr/>
      {comment.author.firstName}&nbsp;{comment.author.lastName}&nbsp; commented:
      <p>{comment.content}</p>
      
      <button onClick={() => handleLike()}>Like</button>
      {likes}&nbsp;{isLiked ? 'You already liked this post.' : 'You have not liked this post yet.'}
    </div>
  );
}

export default Comment;