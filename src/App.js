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
      base_url : 'http://localhost:8000'
    }
  }

  componentDidMount(){
    // Read user data from local storage, if it's not null, store it to the state
    const userData = JSON.parse(localStorage.getItem('userData'))
    if(userData !== null){
      this.setState({user : userData})
    }
  }

  render(){
    return (
      <div>
        { this.state.user === null ? 
            <Auth base_url={this.state.base_url} /> : 
            <Main base_url={this.state.base_url} user={this.state.user} /> 
        }
      </div>
    )
  }
}

export default App;
