import React, { useEffect } from 'react';

function ErrorPage(props) {
  const { finishLoading } = props;
  
  useEffect(() => {
    finishLoading();
  }, [finishLoading])
  
  return (
    <div id="error-container">
      <h1>{ props.errorTitle }</h1>
      {props.errorMessage}
    </div>
  );
}

export default ErrorPage;