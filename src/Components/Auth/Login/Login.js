import React from 'react'
import buildUrl from 'build-url'

class Login extends React.Component{
    
    constructor(props){
        super(props)
        this.alert = React.createRef()
    }

    handleLogin = (event) => {
        event.preventDefault()

        const formData = new FormData(event.target);

        // Build the URL
        const url = buildUrl(this.props.base_url, {
            path : "/api/user/authenticate",
            queryParams : {
                username : formData.get('username'),
                password : formData.get('password')
            }
        })

        fetch(url, { method : 'POST' })
        .then( res => res.json() )
        .then( data => {
            if( ('statusCode' in data) || ('message' in data)){
                console.log(data)
            } else {
                // Save the user to local storage if they are successfully retrieved
                localStorage.setItem('user', JSON.stringify(data))
                this.props.getUser()
            }
        } )
    }

    render(){
        return (
            <form className="auth-form" onSubmit={this.handleLogin}>
                <div className="form-group">
                <div ref={this.alert} className="alert alert-danger d-md-none" role="alert">
                    Wrong username/email or password
                </div>
                </div>
                <div className="form-group">
                    <label>Username or Email</label>
                    <input type="text" className="form-control" id="username" name="username" placeholder="Enter username or email"></input>
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" id="password" name="password" placeholder="Password"></input>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        )
    }
}

export default Login