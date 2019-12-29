import React from 'react'
import * as EmailValidator from 'email-validator'
import buildUrl from 'build-url'

class Register extends React.Component{

    constructor(props){
        super(props)
        
        this.state = {
            name : { value : "", valid : false, error : "Please provide a name" }, 
            email : { value : "", valid : false, error : "Email already in use" }, 
            username : { value : "", valid : false, error : "Unavailable" },
            password : { value : "", valid : false, error : "Please provide a password" },
            confirmPassword : { value : "", valid : false },
            gender : { value : "other", valid : true }
        }

        this.confirmPasswordRef = React.createRef()
    }

    makeElementInvalid = (element) => {
        element.classList.remove("is-valid")
        element.classList.add("is-invalid")
    }

    makeElementValid = (element) => {
        element.classList.remove("is-invalid")
        element.classList.add("is-valid")
    }

    handleNameChange = (event) => {
        const nameText = event.target
        if(nameText.value === "") {
            this.makeElementInvalid(nameText)
            this.setState({ name : 
                { value : nameText.value, valid : false, error : "Please provide a name" }
            })
        } else {
            this.makeElementValid(nameText)
            this.setState({ name : { value : nameText.value, valid : true } })
        }
    }

    handleEmailChange = (event) => {
        const emailText = event.target
        if(emailText.value === ""){
            this.makeElementInvalid(emailText)
            this.setState({ email : 
                { value : emailText.value, valid : false, error : "Please provide an email address"
            } })
        } else {
            // Check email format validity
            if(EmailValidator.validate(emailText.value)){
                // Validate email availability on ther server
                const url = buildUrl(this.props.base_url, {
                    path : 'api/validate/email',
                    queryParams : {
                        email : emailText.value
                    }
                });

                fetch(url)
                .then( res => res.json() )
                .then( data => {
                    if(data.available === true){
                        // Set component to valid if the email is available
                        this.makeElementValid(emailText)
                        this.setState({ email: 
                            { value : emailText.value, valid : true }
                        })
                    } else {
                        this.makeElementInvalid(emailText)
                        this.setState({ email : 
                            { value : emailText.value, valid : false, error : "This email is already in use"}
                        })
                    }
                } )

                this.makeElementValid(emailText)
            } else {
                this.makeElementInvalid(emailText)
                this.setState({ email :
                    { value : emailText.value, valid : false, error : "Please provide a valid email"}
                })
            }
        }
    }

    handleUsernameChange = (event) => {
        const usernameText = event.target
        if(usernameText.value === "" || usernameText.value.length < 8){
            this.makeElementInvalid(usernameText)
            this.setState({ username : 
                { value : usernameText.value, valid : false, error : "Username must be at least 8 characters long" }
            })
        } else {
            // Check username availability on the server
            const url = buildUrl(this.props.base_url, {
                path : 'api/validate/username',
                queryParams : {
                    username : usernameText.value
                }
            });
            
            fetch(url)
            .then( res => res.json() )
            .then( data => {
                if(data.available === true){
                    this.makeElementValid(usernameText)
                    this.setState({ username:
                        { value : usernameText.value, valid : true }
                    })
                } else {
                    this.makeElementInvalid(usernameText)
                    this.setState({ username : 
                        { value : usernameText.value, valid : false, error : "Username unavailable" }
                     })
                }
            } )
        }
    }

    handlePasswordChange = (event) => {
        const passwordText = event.target
        const confirmPasswordText = this.confirmPasswordRef.current

        if(passwordText.value === ""){
            this.makeElementInvalid(passwordText)
            this.setState({ password :
                { value : passwordText.value, valid : false,  error : "Please create a password"}
            })
        } else {
            this.makeElementValid(passwordText)
            this.setState({ password :
                { value : passwordText.value, valid : true }
            })
        }

        if(passwordText.value !== confirmPasswordText.value){
            this.makeElementInvalid(confirmPasswordText)
            this.setState({confirmPassword : 
                { value : confirmPasswordText.value, valid : false, error : "Passwords don't match" }
            })
        } else {
            if(passwordText.value !== ""){
                this.makeElementValid(confirmPasswordText)
                this.setState({ confirmPassword :
                    { value : confirmPasswordText.value, valid : true }
                })
            }
        }
    }

    handleConfirmPasswordChange = (event) => {
        const confirmPasswordText = event.target

        if(confirmPasswordText.value !== this.state.password.value){
            this.makeElementInvalid(confirmPasswordText)
            this.setState({ confirmPassword : 
                { value : confirmPasswordText.value, valid : false} 
            })
        } else {
            if(this.state.password.value !== ""){
                this.makeElementValid(confirmPasswordText)
                this.setState({ confirmPassword :
                    { value : confirmPasswordText.value, valid : true }
                })
            }
        }

    }

    handleFormSubmit = (event) => {
        event.preventDefault()
        // Make sure all the information is valid before sending it to the server
        Object.keys(this.state).forEach( (key) => {
            if(!this.state[key].valid){
                console.log( key + " is not valid" );
                return // End the form submission as soon as an invalid property is detected
            }
        } )
        // Make the API call to register the user
    }

    render(){
        return (
            <form onSubmit={this.handleFormSubmit}>
                <div className="form-group">
                    <label forhtml="email">Name</label>
                    <input onChange={this.handleNameChange} type="text" className="form-control" id="name" name="name" aria-describedby="nameHelp" placeholder="Enter name"></input>
                    <small id="nameHelp" className="form-text text-muted">You may choose wether to display this publicly to other Daftari users</small>
                    <div className="valid-feedback">Awesome!</div>
                    <div className="invalid-feedback">{this.state.name.error}</div>
                </div>
                <div className="form-group">
                    <label forhtml="email">Email</label>
                    <input onChange={this.handleEmailChange} type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" placeholder="Enter email"></input>
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    <div className="valid-feedback">Awesome!</div>
                    <div className="invalid-feedback">{this.state.email.error}</div>
                </div>
                <div className="form-group">
                    <label forhtml="email">Username</label>
                    <input onChange={this.handleUsernameChange} type="text" className="form-control" id="username" name="username" aria-describedby="usernameHelp" placeholder="Enter username"></input>
                    <small id="usernameHelp" className="form-text text-muted">This will be publicly visible to other Daftari users.</small>
                    <div className="valid-feedback">Awesome!</div>
                    <div className="invalid-feedback">{this.state.username.error}</div>
                </div>
                <div className="form-group">
                    <label forhtml="password">Password</label>
                    <input onChange={this.handlePasswordChange} type="password" className="form-control" id="password" name="password" placeholder="Password"></input>
                    <div className="valid-feedback">Awesome!</div>
                    <div className="invalid-feedback">{this.state.password.error}</div>
                </div>
                <div className="form-group">
                    <label forhtml="confirmPassword">Confirm password</label>
                    <input onChange={this.handleConfirmPasswordChange} ref={this.confirmPasswordRef} type="password" className="form-control" id="confirmPassword" name="confirmPassword" placeholder="Password"></input>
                    <div className="valid-feedback">Passwords match!</div>
                    <div className="invalid-feedback">Passwords don't match</div>
                </div>
                
                <div className="form-group">
                    <label>Gender: </label>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="gender" id="maleRadio" value="male"></input>
                        <label className="form-check-label" for="maleRadio">
                            Male
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="gender" id="femaleRadio" value="female"></input>
                        <label className="form-check-label" for="femaleRadio">
                            Female
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="gender" id="otherRadio" value="other"></input>
                        <label className="form-check-label" for="otherRadio">
                            Other
                        </label>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        )
    }
}

export default Register