import React from 'react';
import './index.css';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import RegisterForm from './components/signin/RegisterForm';
import LoginForm from './components/signin/LoginForm';
import Profile from './components/profiles/Profile';
import FriendRequests from './components/user/FriendRequests';

class App extends React.Component {
  state = {
    loading: true,
    isLogged: false
  }
  
  verifyAuth = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/islogged`, { withCredentials: true })
      .then((response) => {
        this.setState({ isLogged: response.data.isLogged, loading: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLogged: false, loading: false });
      });
  }
  
  render() {
    return (
      <div className="App">
        <Router>
        <Switch>
          <Route path="/profile/:userId" children={<Profile state={this.state} verifyAuth={this.verifyAuth} />} />
          <Route path="/register" children={<RegisterForm state={this.state} verifyAuth={this.verifyAuth} />} />
          <Route path="/login" children={<LoginForm state={this.state} verifyAuth={this.verifyAuth} />} />
          <Route path="/requests" children={<FriendRequests state={this.state} verifyAuth={this.verifyAuth} />} />
        </Switch>
        </Router>
      </div>
    );
  }
}

      
export default App;
