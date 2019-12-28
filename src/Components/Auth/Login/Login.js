import React from 'react'

class Login extends React.Component{
    
    constructor(props){
        super(props)
        this.state = {
            'username' : null,
            'password' : null
        }
    }

    handleLogin = (event) => {
        event.preventDefault()
    }

    render(){
        return (
            <form onSubmit={this.handleLogin}>
                <div className="form-group">
                    <label>Username or Email</label>
                    <input type="email" className="form-control" id="username" name="username" placeholder="Enter username or email"></input>
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" id="password" name="password" placeholder="Password"></input>
                </div>
                <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="remember" name="rememeber"></input>
                    <label className="form-check-label">Keep me logged in</label>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        )
    }
}

export default Login