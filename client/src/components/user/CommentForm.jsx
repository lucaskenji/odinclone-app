import React, { useState } from 'react';
import axios from 'axios';

function CommentForm(props) {
  const { postId, triggerRender } = props;
  const [finishedAsync, setFinishedAsync] = useState(true);
  
  const handleSubmit = (form) => {
    form.preventDefault();
    setFinishedAsync(false);
    
    const userId = localStorage.getItem('odinbook_id');
    const newComment = {
      author: userId,
      content: form.target.content.value
    }
    
    axios.post(`${process.env.REACT_APP_API_URL}/api/posts/${postId}/comments`, newComment)
      .then((response) => {
        console.log(response);
        triggerRender();
        form.target.reset();
        setFinishedAsync(true);
      })
      .catch((err) => {
        console.log(err);
      })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="commentinput" className="sr-only">Make a nice comment</label>
      <input disabled={!finishedAsync} type="text" placeholder="Make a nice comment..." id="commentinput" name="content" />
      <button disabled={!finishedAsync} type="submit">Submit</button>
    </form>
  );
}

export default CommentForm;