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
import FriendList from './components/profiles/FriendList';
import FriendRequests from './components/user/FriendRequests';
import LogoutPrompt from './components/misc/LogoutPrompt';
import Dashboard from './components/user/Dashboard';
import FullPost from './components/user/FullPost';
import SearchResults from './components/user/SearchResults';
import Navbar from './components/user/Navbar';
import ErrorPage from './components/misc/ErrorPage';
import ForceRedirect from './components/misc/ForceRedirect';
import ProfileRedirect from './components/misc/ProfileRedirect';
import UserSettings from './components/profiles/UserSettings';
import LoadingScreen from './components/misc/LoadingScreen';
import LocalizeEnglish from './components/misc/LocalizeEnglish';

class App extends React.Component {
  state = {
    loading: true,
    isLogged: false,
    loggedUserId: ''
  }
  
  verifyAuth = () => {
    return new Promise((resolve, reject) => {
      axios.get(`${process.env.REACT_APP_API_URL}/api/islogged`, { withCredentials: true })
        .then((response) => {
          this.setState({
            isLogged: response.data.isLogged, 
            loading: false, 
            loggedUserId: response.data.isLogged ? response.data.id : ''
          });
          
          resolve();
        })
        .catch((err) => {
          this.setState({
            isLogged: false, 
            loading: false, 
            loggedUserId: ''
          });
          reject();
        });
    });
  }
  
  finishLoading = () => {
    this.setState({ loading: false });
  }
  
  render() {          
    return (    
      <div className="App uses-font">        
        <Router basename={process.env.REACT_APP_MAIN_URL}>
        
        {this.state.isLogged && <Navbar loggedUserId={this.state.loggedUserId} />}
        
        <LoadingScreen state={this.state} />
        
          <Switch>
            <Route 
              exact 
              path="/" 
              children={<Dashboard state={this.state} verifyAuth={this.verifyAuth} />} 
            />
            <Route 
              exact 
              path="/profile/:userId" 
              children={<Profile state={this.state} verifyAuth={this.verifyAuth} />} 
            />
            <Route 
              exact 
              path="/friends/:userId" 
              children={<FriendList state={this.state} verifyAuth={this.verifyAuth} />} 
            />
            <Route 
              exact 
              path="/register" 
              children={<RegisterForm state={this.state} verifyAuth={this.verifyAuth} />} 
            />
            <Route 
              exact 
              path="/requests" 
              children={<FriendRequests state={this.state} verifyAuth={this.verifyAuth} />} 
            />
            <Route 
              exact 
              path="/settings" 
              children={<UserSettings state={this.state} verifyAuth={this.verifyAuth} />} 
            />
            <Route 
              exact 
              path="/logout" 
              children={<LogoutPrompt verifyAuth={this.verifyAuth} />} 
            />
            <Route 
              exact 
              path="/post/:postId" 
              children={<FullPost state={this.state} verifyAuth={this.verifyAuth} />} 
            />
            <Route 
              exact 
              path="/search/:query" 
              children={<SearchResults state={this.state} verifyAuth={this.verifyAuth} />} 
            />
            <Route 
              exact 
              path="/redirect" 
              children={<ForceRedirect />} 
            />
            <Route 
              exact 
              path="/profile_redirect/:profileId" 
              children={<ProfileRedirect/>} 
            />
            <Route 
              exact 
              path="/en" 
              children={<LocalizeEnglish />} 
            />
            <Route 
              path="/" 
              children={<ErrorPage 
                          finishLoading={this.finishLoading} 
                          errorTitle="Page not found" 
                          errorMessage="The page you're trying to access doesn't exist." 
                        />} 
            />
          </Switch>
        </Router>
      </div>
    );
  }
}

      
export default App;
