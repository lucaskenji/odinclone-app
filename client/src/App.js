import React from 'react';
import './index.css';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom';

import RegisterForm from './components/signin/RegisterForm';
import LoginForm from './components/signin/LoginForm';
import Profile from './components/profiles/Profile';
import FriendRequests from './components/user/FriendRequests';
import LogoutPrompt from './components/misc/LogoutPrompt';
import Dashboard from './components/user/Dashboard';

class App extends React.Component {
  state = {
    loading: true,
    isLogged: false
  }
  
  verifyAuth = () => {
    return new Promise((resolve, reject) => {
      axios.get(`${process.env.REACT_APP_API_URL}/api/islogged`, { withCredentials: true })
        .then((response) => {
          this.setState({ isLogged: response.data.isLogged, loading: false });
          resolve();
        })
        .catch((err) => {
          console.log(err);
          this.setState({ isLogged: false, loading: false });
          reject();
        });
    });
  }
  
  render() {
    return (
      <div className="App">
        <Router>
          <Link to="/register">Register</Link>&nbsp;
          <Link to="/login">Login</Link>&nbsp;
          <Link to="/logout">Logout</Link>&nbsp;
          <Link to="/requests">Requests</Link><br/>
          
          <Switch>
            <Route path="/profile/:userId" children={<Profile state={this.state} verifyAuth={this.verifyAuth} />} />
            <Route path="/register" children={<RegisterForm state={this.state} verifyAuth={this.verifyAuth} />} />
            <Route path="/login" children={<LoginForm state={this.state} verifyAuth={this.verifyAuth} />} />
            <Route path="/requests" children={<FriendRequests state={this.state} verifyAuth={this.verifyAuth} />} />
            <Route path="/logout" children={<LogoutPrompt verifyAuth={this.verifyAuth} />} />
            <Route path="/dashboard" children={<Dashboard state={this.state} verifyAuth={this.verifyAuth} />} />
          </Switch>
        </Router>
      </div>
    );
  }
}

      
export default App;
