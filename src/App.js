import React from 'react';
import './App.css';

// Import components
import Auth from './Components/Auth/Auth'
import Main from './Components/Main/Main'

class App extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      user : null,
      // base_url : 'http://localhost:8000',
      base_url : 'https://daftari-api.herokuapp.com/'
    }
  }

  logout = () => {
    // Delete user details from local storage and reset state
    localStorage.removeItem('user')
    this.setState({ user : null })
  }

  getUser = () => {
    // Read user data from local storage, if it's not null, store it to the state
    const userData = JSON.parse(localStorage.getItem('user'))
    if(userData !== null){
      this.setState({user : userData})
    }
  }

  componentDidMount(){
    this.getUser()
  }

  render(){
    return (
      <div>
        { this.state.user === null ? 
            <Auth base_url={this.state.base_url} getUser={this.getUser} /> : 
            <Main base_url={this.state.base_url} user={this.state.user} logout={this.logout} />
        }
      </div>
    )
  }
}

export default App;
