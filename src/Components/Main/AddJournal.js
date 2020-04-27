import React from 'react'
import autosize from 'autosize'
import { ToastsContainer, ToastsStore } from 'react-toasts'
import { Button, Form, Badge } from 'react-bootstrap'
import './css/Journal.css'

class AddJournal extends React.Component{
    
    constructor(props){
        super(props)

        this.state = {
            title : "",
            description : "",
            private : false,
            tags : [],
        }

        this.characterIndicator = React.createRef();
        this.submitButton = React.createRef();
        this.tagsContainer = React.createRef();
    }
    
    resetState = () => {
        this.setState({
            title : "",
            description : "",
            private : false,
            tags : [],
        })
    }

    onTitleChange = (event) => {
        var newTitle = event.target.value.trim()
        this.setState({ title : newTitle })
    }

    onPrivacyChange = (event) => {
        this.setState({ private : event.target.checked })
    }

    onDescriptionChange = (event) => {  
        const newDescription = event.target.value.trim()
         
        if(newDescription.length > 140){
            // Set the character indicator red if the text lenght is >= 140
            this.characterIndicator.current.classList.replace("text-success", "text-danger")
        } else {
            // Otherwise, set it to green
            this.characterIndicator.current.classList.replace("text-danger", "text-success")
        }
        this.setState({ description : newDescription })
        // Auto resize the textarea
        autosize(event.target)
    }

    onTagsChange = (event) => {
        const tagList = event.target.value.split(";")
        this.setState({ tags : tagList.map( (tag) => {
            return tag.trim()
        } ) })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const form = event.target
        // Check if title is provided
        if(!(this.state.title === "")){
            const data = new FormData()
            data.append('title', this.state.title)
            data.append('description', this.state.description)
            data.append('private', this.state.private)
            data.append('tags', this.state.tags)
            data.append('user_id', this.props.user._id)

            // Make the api call to submit the form
            fetch(this.props.base_url + "/api/journals/create", {
                method : 'POST',
                headers : {
                    'Accept' : 'application/json'
            },
                body : new URLSearchParams(data)
            })
            .then( res => res.json() )
            .then( data => {
                if( 'status' in data && data.status === "Success"){
                    this.props.getJournals()
                    // Display succes toast
                    ToastsStore.success("Journal created")
                    // Clear form
                    form.reset()
                    this.resetState()
                } else {
                    // Display failed toast
                    ToastsStore.error("Journal creation failed. Try again later")
                }
            })
        } else {
            // Display error to user
            ToastsStore.error("You must provide a title")
        }
    }

    render(){
        return (
            <Form className="data-form" onSubmit={this.handleSubmit} >
                <Form.Group>
                    <Form.Label htmlFor="title">Title</Form.Label>
                    <Form.Control onChange={this.onTitleChange} type="text" name="title" placeholder="Note Title"></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Check
                        onClick={this.onPrivacyChange} 
                        type="checkbox" 
                        name="private"
                        label="Private">
                    </Form.Check>
                    <Form.Text id="privateHelp" className="form-text text-muted">
                        All notes created in a private journal will automatically be private
                    </Form.Text>
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor="tags-input">Tags</Form.Label>
                    <Form.Control as="textarea" onChange={this.onTagsChange} type="text" className="form-control" name="tags-input" placeholder="Tags"></Form.Control>
                    <Form.Text className="text-muted">
                        Add semi-colon(;) at the end of text to add it to list of tags
                    </Form.Text>
                    <div ref={this.tagsContainer}>
                        { this.state.tags.map( tag => (
                                <Badge variant="warning">{tag}</Badge>
                            )
                        )}
                    </div>
                </Form.Group>
                <Form.Group className="form-group">
                    <Form.Label htmlFor="description-input">Description</Form.Label>
                    <Form.Text ref={this.characterIndicator} className="text-success">
                        { 140 - this.state.description.length } characters
                        { this.state.description.length > 140 ? ". Description will be trimmed to 140 characters" : "" }
                    </Form.Text>
                    <Form.Control as="textarea" onChange={this.onDescriptionChange} name="description-input" placeholder="Description"></Form.Control>
                </Form.Group>

                <Button ref={this.submitButton} type="submit" className="btn-primary">
                    Create Journal
                </Button>

                <ToastsContainer store={ToastsStore} />
            </Form>
        )   
    }
}

export default AddJournal