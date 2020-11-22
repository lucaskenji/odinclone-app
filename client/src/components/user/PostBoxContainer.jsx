import React, { useState } from 'react';
import PostBox from './PostBox';

function PostBoxContainer(props) {
  const [openModal, setOpenModal] = useState(false);
  const { handleRender, loggedUserId } = props;
  
  const createModal = () => {
    setOpenModal(true);
  }
  
  const handleClose = () => {
    setOpenModal(false);
  }
  
  return (
    <div id="postbox-container-div">
      <button className="btn btn-primary uses-font btn-postbox" onClick={createModal}>New Post</button>
      { openModal ? <PostBox handleRender={handleRender} handleClose={handleClose} loggedUserId={loggedUserId} /> : '' }
    </div>
  );
}

export default PostBoxContainer;