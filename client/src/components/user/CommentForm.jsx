import React from 'react';
import axios from 'axios';

function CommentForm(props) {
  const { postId, triggerRender } = props;
  
  const handleSubmit = (form) => {
    form.preventDefault();
    
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
      })
      .catch((err) => {
        console.log(err);
      })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="commentinput" className="sr-only">Make a nice comment</label>
      <input type="text" placeholder="Make a nice comment..." id="commentinput" name="content" />
      <button type="submit">Submit</button>
    </form>
  );
}

export default CommentForm;