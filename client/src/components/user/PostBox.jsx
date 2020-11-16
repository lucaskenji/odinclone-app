import React, { useState } from 'react';
import axios from 'axios';

function PostBox(props) {
  const [finishedAsync, setFinishedAsync] = useState(true);
  const { handleRender } = props;
  
  const handleSubmit = (form) => {
    form.preventDefault();
    setFinishedAsync(false);
    
    const newPost = {
      author: localStorage.getItem('odinbook_id'),
      content: form.target.content.value,
      timestamp: new Date()
    }
    
    axios.post(`${process.env.REACT_APP_API_URL}/api/posts`, newPost)
      .then((response) => {
        console.log(response);
        form.target.reset();
        handleRender();
        setFinishedAsync(true);
      })
      .catch((err) => {
        console.log(err);
        setFinishedAsync(true);
      })
  }
  
  return (
    <div className="post-form">
      <form onSubmit={handleSubmit}>
        <label htmlFor="postbox" className="sr-only">Share your thoughts</label>
        <div id="postbox-container">
          <input className="uses-font" disabled={!finishedAsync} type="text" id="postbox" name="content" placeholder="Share your thoughts..." />
          <button className="btn btn-primary uses-font" disabled={!finishedAsync} type="submit" id="postbox-submit">Send</button>
        </div>
      </form>
    </div>
  );
}

export default PostBox;