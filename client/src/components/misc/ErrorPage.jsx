import React from 'react';

function ErrorPage(props) {
  return (
    <div id="error-container">
      <h1>{ props.errorTitle }</h1>
      {props.errorMessage}
    </div>
  );
}

export default ErrorPage;