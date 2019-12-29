import React from 'react'

class Login extends React.Component{
    
    constructor(props){
        super(props)
        this.alert = React.createRef()
    }

    handleLogin = (event) => {
        event.preventDefault()
        fetch(this.props.base_url + "/api/user/authenticate", {
            method : 'POST',
            headers: {
                'Accept' : 'application/json'
            },
            body: new URLSearchParams(new FormData(event.target))
        })
        .then( res => {
            if(!res.ok){
                this.alert.current.classList.remove('d-md-none')
                return
            } 
            // Response is ok, save to localStorage and retrieve user
            localStorage.setItem('user', JSON.stringify(res.json()))
            this.props.getUser()
        } )
    }

    render(){
        return (
            <form onSubmit={this.handleLogin}>
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