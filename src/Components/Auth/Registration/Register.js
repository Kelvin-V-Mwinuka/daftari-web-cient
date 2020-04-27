import React from 'react'
import * as EmailValidator from 'email-validator'
import buildUrl from 'build-url'
import { Button, Form, FormControl } from 'react-bootstrap'

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
                var data = new FormData()
                data.append('email', emailText.value)

                fetch(this.props.base_url + "/api/validate/email", { 
                    method : 'POST', 
                    body : new URLSearchParams(data)
                })
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
            var data = new FormData()
            data.append('username', usernameText.value)

            fetch(this.props.base_url + "/api/validate/username", { 
                method : 'POST',
                body : new URLSearchParams(data)
            })
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

    detailsValid = () => {
        var valid = true
        Object.keys(this.state).forEach( (key) => {
            if(!this.state[key].valid){
                console.log( key + " is not valid" );
                valid = false
            }
        } )
        return valid
    }

    handleFormSubmit = (event) => {
        event.preventDefault()
        
        // Make sure all the information is valid before sending it to the server
        if(!this.detailsValid()){
            // Exit the function if not all details are valid
            return
        }

        // Make the API call to register the user

        fetch(this.props.base_url + "/api/user/register", {
            method : 'POST',
            headers: {
                'Accept' : 'application/json',
            },
            body : new URLSearchParams(new FormData(event.target))
        })
        .then( res => res.json() )
        .then( data => {
            if( 'status' in data && data.status === "Success" ){
                // Save data in localStorage
                localStorage.setItem('user', JSON.stringify(data.user))
                this.props.getUser()
            } else {
                // Display signup error
            }
        } )
    }

    render(){
        return (
            <Form className="auth-form" onSubmit={this.handleFormSubmit}>
                <Form.Group className="form-group">
                    <Form.Label forhtml="email">Name</Form.Label>
                    <Form.Control onChange={this.handleNameChange} type="text" className="form-control" id="name" name="name" aria-describedby="nameHelp" placeholder="Enter name"></Form.Control>
                    <Form.Text id="nameHelp" className="form-text text-muted">You may choose wether to display this publicly to other Daftari users</Form.Text>
                    <FormControl.Feedback type="valid">Awesome!</FormControl.Feedback>
                    <FormControl.Feedback type="invalid">{this.state.name.error}</FormControl.Feedback>
                </Form.Group>
                <Form.Group  className="form-group">
                    <Form.Label forhtml="email">Email</Form.Label>
                    <Form.Control onChange={this.handleEmailChange} type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" placeholder="Enter email"></Form.Control>
                    <Form.Text id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</Form.Text>
                    <FormControl.Feedback type="valid">Awesome!</FormControl.Feedback>
                    <FormControl.Feedback type="invalid">{this.state.email.error}</FormControl.Feedback>
                </Form.Group>
                <Form.Group  className="form-group">
                    <Form.Label forhtml="email">Username</Form.Label>
                    <Form.Control onChange={this.handleUsernameChange} type="text" className="form-control" id="username" name="username" aria-describedby="usernameHelp" placeholder="Enter username"></Form.Control>
                    <Form.Text id="usernameHelp" className="form-text text-muted">This will be publicly visible to other Daftari users.</Form.Text>
                    <FormControl.Feedback type="valid">Awesome!</FormControl.Feedback>
                    <FormControl.Feedback type="invalid">{this.state.username.error}</FormControl.Feedback>
                </Form.Group>
                <Form.Group  className="form-group">
                    <Form.Label forhtml="password">Password</Form.Label>
                    <Form.Control onChange={this.handlePasswordChange} type="password" className="form-control" id="password" name="password" placeholder="Password"></Form.Control>
                    <FormControl.Feedback type="valid">Awesome!</FormControl.Feedback>
                    <FormControl.Feedback type="invalid">{this.state.password.error}</FormControl.Feedback>
                </Form.Group >
                <Form.Group  className="form-group">
                    <Form.Label forhtml="confirmPassword">Confirm password</Form.Label>
                    <Form.Control onChange={this.handleConfirmPasswordChange} ref={this.confirmPasswordRef} type="password" className="form-control" id="confirmPassword" name="confirmPassword" placeholder="Password"></Form.Control>
                    <FormControl.Feedback type="valid">Passwords match!</FormControl.Feedback>
                    <FormControl.Feedback type="invalid">Passwords don't match</FormControl.Feedback>
                </Form.Group>
                
                <Form.Group  className="form-group">
                    <Form.Label>Gender: </Form.Label>
                        <Form.Check 
                            inline
                            type="radio" 
                            name="gender" 
                            id="maleRadio" 
                            value="male"
                            label="Male">
                        </Form.Check>
                        <Form.Check 
                            inline
                            type="radio" 
                            name="gender" 
                            id="femaleRadio" 
                            value="female"
                            label="Female">
                        </Form.Check>
                        <Form.Check 
                            inline
                            type="radio" 
                            name="gender" 
                            id="otherRadio" 
                            value="other"
                            label="Other">
                        </Form.Check>
                </Form.Group>
                <Button type="submit" className="btn btn-primary">Submit</Button>
            </Form>
        )
    }
}

export default Register