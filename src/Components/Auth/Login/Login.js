import React from 'react'
import buildUrl from 'build-url'
import { Button, Alert, Form } from 'react-bootstrap'

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
            if( 'status' in data && data.status === 'Success' ){
                // Save the user to local storage if they are successfully retrieved
                localStorage.setItem('user', JSON.stringify(data.user))
                this.props.getUser()
            } else {
                this.alert.current.classList.remove('d-md-none')
            }
        } )
    }

    render(){
        return (
            <Form className="auth-form" onSubmit={this.handleLogin}>
                <Form.Group>
                <Alert variant="danger" ref={this.alert} className="d-md-none">
                    Wrong username/email or password
                </Alert>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Username or Email</Form.Label>
                    <Form.Control type="text" className="form-control" id="username" name="username" placeholder="Enter username or email"></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" className="form-control" id="password" name="password" placeholder="Password"></Form.Control>
                </Form.Group>
                <Button type="submit" className="btn btn-primary">Submit</Button>
            </Form>
        )
    }
}

export default Login