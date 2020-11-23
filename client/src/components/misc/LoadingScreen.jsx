import React from 'react';

function LoadingScreen(props) {
  const { loading } = props.state;
  
  return (
    <div className={loading ? "loading-screen" : "loading-screen loading-screen-fade"}>
      <i className="fas fa-spinner loading-spinner"></i>
    </div>
  );
}

export default LoadingScreen;