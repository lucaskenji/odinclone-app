import React, { useState } from 'react';
import axios from 'axios';

function PostBox(props) {
  const [finishedAsync, setFinishedAsync] = useState(true);
  const [inputUrlVisible, setInputUrlVisible] = useState(false);
  const { handleRender, handleClose } = props;
  
  const closeModal = () => {
    if (finishedAsync) {
      handleClose();
    }
  }
  
  const handleSubmit = (form) => {
    form.preventDefault();
    setFinishedAsync(false);
    
    const newPost = {
      author: localStorage.getItem('odinbook_id'),
      content: form.target.content.value,
      timestamp: new Date()
    }
    
    const csrfToken = localStorage.getItem('csrfToken');
    
    axios.post(`${process.env.REACT_APP_API_URL}/api/posts`, newPost, { withCredentials: true, headers: { csrf: csrfToken } })
      .then((response) => {
        console.log(response);
        form.target.reset();
        handleRender();
        setFinishedAsync(true);
        closeModal();
      })
      .catch((err) => {
        console.log(err);
        setFinishedAsync(true);
      })
  }
  
  const handleClickImage = () => {
    setInputUrlVisible(!inputUrlVisible);
  }
  
  return (
    <div id="post-form-container">
      <div className="dark-screen" onClick={closeModal} />
      <div className="post-form">
        <div id="post-form-header">
          <h2>Create a post</h2>
          <i onClick={closeModal} className="fas fa-times"></i>
        </div>
              
        <form onSubmit={handleSubmit}>
          <label htmlFor="postbox" className="sr-only">Share your thoughts</label>
          <div id="postbox-container">
            <textarea 
              className="uses-font" 
              disabled={!finishedAsync} 
              id="postbox" 
              name="content" 
              maxLength="250" 
              placeholder="Share your thoughts..."></textarea>
            
            <div id="postbox-buttons">
              <div>
                <button type="button" className="btn btn-photo uses-font" onClick={handleClickImage}>
                  <i className="fas fa-images"></i>&nbsp;Image
                </button>
                
                <label htmlFor="photo-url" className={inputUrlVisible ? "sr-only turn-visible" : "sr-only"}>Photo URL</label>
                <input 
                  type="text" 
                  className={inputUrlVisible ? "uses-font post-form-input turn-visible" : "uses-font post-form-input"} 
                  disabled={!finishedAsync} 
                  id="photo-url" 
                  name="photo-url" 
                  placeholder="Photo URL" 
                />
              </div>
              
              <button className="btn btn-primary uses-font" disabled={!finishedAsync} type="submit" id="postbox-submit">
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostBox;