import React, { useState } from 'react';
import axios from 'axios';

function PostBox(props) {
  const [finishedAsync, setFinishedAsync] = useState(true);
  
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
        setFinishedAsync(true);
      })
      .catch((err) => {
        console.log(err);
      })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="postbox" className="sr-only">Share your thoughts</label>
      <input disabled={!finishedAsync} type="text" id="postbox" name="content" placeholder="Share your thoughts..." />
      <br/>
      <button disabled={!finishedAsync} type="submit">Send</button>
    </form>
  );
}

export default PostBox;