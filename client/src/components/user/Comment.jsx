import React, { useState, useEffect } from 'react';
import axios from 'axios';
import noAvatar from '../../images/no-avatar.png';
import localStrings from '../../localization';

function Comment(props) {
  const { comment, loggedUserId } = props;
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(props.comment.likes.length);
  const [finishedAsync, setFinishedAsync] = useState(true);
  const locale = localStorage.getItem('localizationCode') === 'en-US' ? 'en-US' : 'pt-BR';
  
  useEffect(() => {
    const foundUser = comment.likes.find(user => user.toString() === loggedUserId);
    
    foundUser == null ? setIsLiked(false) : setIsLiked(true);
  }, [ comment.likes, loggedUserId ]);
  
  const handleLike = async () => {
    setFinishedAsync(false);
    
    const previousLikes = likes;
    
    try {
      if (!isLiked) {
        setLikes(likes + 1);
        await axios.put(`${process.env.REACT_APP_API_URL}/api/posts/${comment.post}/comments/${comment._id}/like`, { _id: loggedUserId });
      } else {
        setLikes(likes - 1);
        await axios.put(`${process.env.REACT_APP_API_URL}/api/posts/${comment.post}/comments/${comment._id}/dislike`, { _id: loggedUserId });
      }
      
      setIsLiked(!isLiked);
    } catch (err) {
      setLikes(previousLikes);
    } finally {
      setFinishedAsync(true);
    }
  }
  
  return (
    <div className="comment">
      <a className="comment-link" href={"/profile/" + comment.author._id}>
        <img 
          src={comment.author.photo || noAvatar} 
          alt={localStrings[locale]['posts']['alt']['commenterAvatar']} 
          className="post-avatar" 
        />
      </a>
      
      <div className="comment-content">
        <a href={"/profile/" + comment.author._id}>{comment.author.firstName}&nbsp;{comment.author.lastName}</a>
        <p>{comment.content}</p>
        
        <button className={isLiked ? "btn btn-post uses-font btn-liked" : "btn btn-post uses-font"} disabled={!finishedAsync} onClick={() => handleLike()}>
          <i className="far fa-thumbs-up"></i> Like ({likes})
        </button>
      </div>
    </div>
  );
}

export default Comment;