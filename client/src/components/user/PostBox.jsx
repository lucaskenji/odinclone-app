import React, { useState } from 'react';
import axios from 'axios';
import localStrings from '../../localization';

function PostBox(props) {
  const [finishedAsync, setFinishedAsync] = useState(true);
  const [inputUrlVisible, setInputUrlVisible] = useState(false);
  const { handleRender, handleClose, loggedUserId } = props;
  const [errorMessage, setErrorMessage] = useState('');
  
  const [photoUrl, setPhotoUrl] = useState('');
  const [urlIsValid, setUrlIsValid] = useState(true);
  const [validatedUrl, setValidatedUrl] = useState(true);
  
  const locale = localStorage.getItem('localizationCode') === 'en-US' ? 'en-US' : 'pt-BR';
  
  const closeModal = () => {
    if (finishedAsync) {
      handleClose();
    }
  }
  
  const handleSubmit = (form) => {
    form.preventDefault();
    setFinishedAsync(false);
    setErrorMessage('');
    
    if (!validatedUrl || !urlIsValid) {
      setFinishedAsync(true);
      return;
    }
    
    const newPost = {
      author: loggedUserId,
      content: form.target.content.value,
      timestamp: new Date(),
      photo: form.target.photoUrl.value || ''
    }
    
    const csrfToken = localStorage.getItem('csrfToken');
    
    axios.post(`${process.env.REACT_APP_API_URL}/api/posts`, newPost, { withCredentials: true, headers: { csrf: csrfToken } })
      .then((response) => {
        form.target.reset();
        handleRender();
        setFinishedAsync(true);
        closeModal();
      })
      .catch((err) => {
        if (err.response) {
          setErrorMessage(localStrings[locale]['postbox']['error']['badRequest']);
        } else {
          setErrorMessage(localStrings[locale]['postbox']['error']['internal']);
        }
        
        setFinishedAsync(true);
      })
  }
  
  const handleClickImage = () => {
    setInputUrlVisible(!inputUrlVisible);
  }
  
  const handleInputUrl = (input) => {
    setValidatedUrl(false);
    setPhotoUrl(input.target.value);
  }
  
  const handleLoadImage = () => {
    setUrlIsValid(true);
    setValidatedUrl(true);
  }
  
  const handleErrorImage = () => {
    setValidatedUrl(true);
    
    if (photoUrl.length === 0) {
      setUrlIsValid(true);
      return;
    }
    
    setUrlIsValid(false);
  }
  
  return (
    <div id="post-form-container">
      <div className="dark-screen" onClick={closeModal} />
      <div className="post-form">
        <div id="post-form-header">
          <h2>{localStrings[locale]['postbox']['header']}</h2>
          <i onClick={closeModal} className="fas fa-times"></i>
        </div>
        
        <form onSubmit={handleSubmit}>
          { errorMessage && <div className="error-message">{errorMessage}</div> }
          
          <label htmlFor="postbox" className="sr-only">{localStrings[locale]['postbox']['postTip']}</label>
          <div id="postbox-container">
            <textarea 
              className="uses-font" 
              disabled={!finishedAsync} 
              id="postbox" 
              name="content" 
              maxLength="250" 
              placeholder={localStrings[locale]['postbox']['postTip']}></textarea>
            
            <img 
              id="image-preview-form" 
              src={photoUrl} 
              onLoad={handleLoadImage} 
              onError={handleErrorImage} 
              aria-hidden="true" 
              alt="" 
            />
            
            { urlIsValid 
              || 
              <span className="error-message">
                <i className="fas fa-exclamation-circle"></i> {localStrings[locale]['postbox']['error']['badUrl']}
              </span> }
            
            <div id="postbox-buttons">
              <div>
                <button type="button" className="btn btn-photo uses-font" onClick={handleClickImage}>
                  <i className="fas fa-images"></i>&nbsp;{localStrings[locale]['postbox']['imageButton']}
                </button>
                
                <label htmlFor="photo-url" className={inputUrlVisible ? "sr-only turn-visible" : "sr-only"}>
                  {localStrings[locale]['postbox']['urlTip']}
                </label>
                <input 
                  type="text" 
                  className={inputUrlVisible ? "uses-font post-form-input turn-visible" : "uses-font post-form-input"} 
                  disabled={!finishedAsync} 
                  id="photoUrl" 
                  name="photoUrl" 
                  placeholder={localStrings[locale]['postbox']['urlTip']} 
                  onChange={handleInputUrl}
                />
              </div>
              
              <button className="btn btn-primary uses-font" disabled={!finishedAsync} type="submit" id="postbox-submit">
                {localStrings[locale]['postbox']['send']}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostBox;