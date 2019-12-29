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
        /** Make form elements invalid in order to display the form element's status  */
        element.classList.remove("is-valid")
        element.classList.add("is-invalid")
    }

    makeElementValid = (element) => {
        /** Make form elements valid in order to display the form element's status  */
        element.classList.remove("is-invalid")
        element.classList.add("is-valid")
    }

    handleNameChange = (event) => {
        const nameText = event.target

        if(nameText.value === "") {
            /** If name is empty after user has already previously typed on it,
             * make the name element invalid, and update the 'name' attribute of the state
             */
            this.makeElementInvalid(nameText)
            this.setState({ name : 
                { value : nameText.value, valid : false, error : "Please provide a name" }
            })
        } else {
            /** If name is not empty, make the name element valid
             * and update the 'name' attribute of the state
             */
            this.makeElementValid(nameText)
            this.setState({ name : { value : nameText.value, valid : true } })
        }
    }

    handleEmailChange = (event) => {
        const emailText = event.target

        if(emailText.value === ""){
            /** If email element is empty after the user has already previously typed in it,
             * make the element invalid and update the 'email' attribute of the state
             */
            this.makeElementInvalid(emailText)
            this.setState({ email : 
                { value : emailText.value, valid : false, error : "Please provide an email address"
            } })
        } else {
            // Check email format validity
            if(EmailValidator.validate(emailText.value)){
                // Validate email availability on ther server if email format is valid
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
                        // Set email component to valid if the email is available
                        this.makeElementValid(emailText)
                        this.setState({ email: 
                            { value : emailText.value, valid : true }
                        })
                    } else {
                        /** If the email is unavailable, make the email element invalid
                         * and update the 'email' attribute of the state
                         */
                        this.makeElementInvalid(emailText)
                        this.setState({ email : 
                            { value : emailText.value, valid : false, error : "This email is already in use"}
                        })
                    }
                } )
            } else {
                /** If the email format is invalid, make the element invalid and 
                 * update the 'email' attribute of the state
                 */
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
            /** If the username is empty of shorter than 8 characters after
             * the user has already typed in it, make the element invalid
             * and update the 'username' attribute of the state
             */
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
                    /* If the username is available, make the element valid 
                    and update 'username' attribute of the state. */
                    this.makeElementValid(usernameText)
                    this.setState({ username:
                        { value : usernameText.value, valid : true }
                    })
                } else {
                    /** If the username is not available, make the element incalid
                     * and update the 'username' attribute od the state
                     */
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

        // Retrieve confirm password element as its values are relevant here
        const confirmPasswordText = this.confirmPasswordRef.current

        if(passwordText.value === ""){
            /** If password element is empty after the user has already typed in it, 
             * make the element invalid and update the 'password' attribute of the state
             */
            this.makeElementInvalid(passwordText)
            this.setState({ password :
                { value : passwordText.value, valid : false,  error : "Please create a password"}
            })
        } else {
            /** If the password is not empty, make the element valid and 
             * update the 'password' attribute of the state
             */
            this.makeElementValid(passwordText)
            this.setState({ password :
                { value : passwordText.value, valid : true }
            })
        }

        if(passwordText.value !== confirmPasswordText.value){
            /** If current typed password text is not equal to current typed confirmPassword text,
             * make the confirmPasswordText element invalid and update the 'confirmPassword'
             * attribute of the state
              */
            this.makeElementInvalid(confirmPasswordText)
            this.setState({confirmPassword : 
                { value : confirmPasswordText.value, valid : false, error : "Passwords don't match" }
            })
        } else {
            /** If current typed password text is equal to current typed confirmPassword text AND
             * is not empty, make the confirmPasswordText element valid and update 
             * the 'confirmPassword' attribute of the state
              */
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
            /** If confirmPasswort text is not equal to the current state of the
             * password, make this element invalid and update the 'confirmPassword'
             * attribute of the state
             */
            this.makeElementInvalid(confirmPasswordText)
            this.setState({ confirmPassword : 
                { value : confirmPasswordText.value, valid : false} 
            })
        } else {
            /** If confirmPassword text is equal to current state od the password,
             * AND the current state of the password is NOT empty, set this element 
             * to valid and update the 'confirmPassword' attribute of the state
             */
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
        console.log("All values valid!")

        // Make the API call to register the user

        fetch(this.props.base_url + "/api/user/register", {
            method : 'POST',
            headers: {
                'Accept' : 'application/json',
            },
            body : new URLSearchParams(new FormData(event.target))
        })
        .then( res => res.json() )
        .then( user => {
            // Save data in localStorage
            localStorage.setItem('user', JSON.stringify(user))
            this.props.getUser()
        } )
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
                        <label className="form-check-label" htmlFor="maleRadio">
                            Male
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="gender" id="femaleRadio" value="female"></input>
                        <label className="form-check-label" htmlFor="femaleRadio">
                            Female
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="gender" id="otherRadio" value="other"></input>
                        <label className="form-check-label" htmlFor="otherRadio">
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