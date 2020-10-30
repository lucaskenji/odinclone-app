import React from 'react';
import './index.css';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

// import RegisterForm from './components/signin/RegisterForm';
// import LoginForm from './components/signin/LoginForm';
import Profile from './components/profiles/Profile';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          
          <Route path="/profile/:userId" children={<Profile/>} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
