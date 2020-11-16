import React from 'react';
import './index.css';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/solid.min.css';
import '@fortawesome/fontawesome-free/css/regular.min.css';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import RegisterForm from './components/signin/RegisterForm';
import Profile from './components/profiles/Profile';
import FriendRequests from './components/user/FriendRequests';
import LogoutPrompt from './components/misc/LogoutPrompt';
import Dashboard from './components/user/Dashboard';
import FullPost from './components/user/FullPost';
import SearchResults from './components/user/SearchResults';
import Navbar from './components/user/Navbar';

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
          
          if (!response.data.isLogged) {
            localStorage.setItem('odinbook_id', '');
          } else {
            localStorage.setItem('odinbook_id', response.data.id);
          }
          
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
      <div className="App uses-font">        
        <Router>
        
        {this.state.isLogged && <Navbar/>}
        
          <Switch>
            <Route path="/profile/:userId" children={<Profile state={this.state} verifyAuth={this.verifyAuth} />} />
            <Route path="/register" children={<RegisterForm state={this.state} verifyAuth={this.verifyAuth} />} />
            <Route path="/requests" children={<FriendRequests state={this.state} verifyAuth={this.verifyAuth} />} />
            <Route path="/logout" children={<LogoutPrompt verifyAuth={this.verifyAuth} />} />
            <Route path="/post/:postId" children={<FullPost state={this.state} verifyAuth={this.verifyAuth} />} />
            <Route path="/search/:query" children={<SearchResults state={this.state} verifyAuth={this.verifyAuth} />} />
            <Route path="/" children={<Dashboard state={this.state} verifyAuth={this.verifyAuth} />} />
          </Switch>
        </Router>
      </div>
    );
  }
}

      
export default App;
