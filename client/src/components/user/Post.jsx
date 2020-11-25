import React, { useState, useEffect } from 'react';
import axios from 'axios';
import noAvatar from '../../images/no-avatar.png';
import localStrings from '../../localization';

function Post(props) {
  const { post, loggedUserId } = props;
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(props.post.likes.length);
  const [finishedAsync, setFinishedAsync] = useState(true);
  const locale = localStorage.getItem('localizationCode') === 'en-US' ? 'en-US' : 'pt-BR';
  
  useEffect(() => {
    const foundUser = post.likes.find(user => user.toString() === loggedUserId);
    
    foundUser == null ? setIsLiked(false) : setIsLiked(true);
  }, [ post.likes, loggedUserId ]);
  
  const handleLike = async () => {
    setFinishedAsync(false);
    
    const previousLikes = likes;
    
    try {
      if (!isLiked) {
        setLikes(likes + 1);
        await axios.put(`${process.env.REACT_APP_API_URL}/api/posts/${post._id}/like`, { _id: loggedUserId });
      } else {
        setLikes(likes - 1);
        await axios.put(`${process.env.REACT_APP_API_URL}/api/posts/${post._id}/dislike`, { _id: loggedUserId });
      }
      
      setIsLiked(!isLiked);
    } catch (err) {
      setLikes(previousLikes);
    } finally {    
      setFinishedAsync(true);
    }
  }
  
  if (!post) {
    return '';
  }
  
  return (
    <div className="post">
      <div className="post-info">
        <a href={"/profile/" + post.author._id}>
          <img 
            src={post.author.photo || noAvatar} 
            className="post-avatar" 
            alt={localStrings[locale]['posts']['alt']['userAvatar']} 
          />
        </a>
        <a href={"/profile/" + post.author._id}>
          {post.author.firstName}&nbsp;{post.author.lastName}
        </a>
      </div>
      
      <p className="post-content">
      {post.content}
      </p>
      
      { post.photo 
        && 
        <div className="post-image">
          <img 
            src={post.photo} 
            alt={localStrings[locale]['posts']['alt']['postImagePrefix'] + post.author.firstName} 
          />
        </div> }
      
      <hr/>
      
      <div className="post-options">
        <button 
          className={isLiked ? "btn btn-post uses-font btn-liked" : "btn btn-post uses-font"} 
          disabled={!finishedAsync} 
          onClick={() => handleLike()}>
          <i className="far fa-thumbs-up"></i> Like ({likes})
        </button>
        
        <a className="btn btn-post-comments btn-post" href={"/post/" + post._id}>
          <i className="far fa-comment-dots"></i> {localStrings[locale]['posts']['comments']}
        </a>
      </div>
    </div>
  );
}

export default Post;