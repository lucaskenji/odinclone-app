import React from 'react';
import './index.css';

import RegisterForm from './components/signin/RegisterForm';
import LoginForm from './components/signin/LoginForm';

function App() {
  return (
    <div className="App">
      <h1>Sign up!</h1>
      <RegisterForm/>
      <h1>Sign in!</h1>
      <LoginForm/>
    </div>
  );
}

export default App;
