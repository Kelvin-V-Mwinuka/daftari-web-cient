import React from 'react'
import autosize from 'autosize'
import { ToastsContainer, ToastsStore } from 'react-toasts'
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
                if( 'status' in data && data.status == "Success"){
                    this.props.getJournals()
                    // Display succes toast
                    ToastsStore.success("Journal created")
                } else {
                    // Display failed toast
                    ToastsStore.error("Journal creation failed. Try again later")
                }
            })
        } else {
            // Display error to user
        }
    }

    render(){
        return (
            <form className="data-form" onSubmit={this.handleSubmit} >
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input onChange={this.onTitleChange} type="text" className="form-control" id="title" name="title" placeholder="Note Title"></input>
                </div>
                <div className="form-check">
                    <input onClick={this.onPrivacyChange} type="checkbox" className="form-check-input" id="private" name="private" aria-describedby="privateHelp"></input>
                    <label className="form-check-label" htmlFor="private">Private</label>
                    <small id="privateHelp" className="form-text text-muted">
                        All notes created in a private journal will automatically be private
                    </small>
                </div>
                <div className="form-group">
                    <label htmlFor="tags-input">Tags</label>
                    <textarea onChange={this.onTagsChange} type="text" className="form-control" id="tags-input" name="tags-input" placeholder="Tags" aria-describedby="tagsHelp"></textarea>
                    <small id="tagsHelp" className="form-text text-muted">
                        Add semi-colon(;) at the end of text to add it to list of tags
                    </small>
                    <div ref={this.tagsContainer}>
                        { this.state.tags.map( tag => (
                                <span class="badge badge-warning">{tag}</span>
                            )
                        )}
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="description-input">Description</label>
                    <small ref={this.characterIndicator} id="descriptionHelp" className="form-text text-success">
                        { 140 - this.state.description.length } characters
                        { this.state.description.length > 140 ? ". Description will be trimmed to 140 characters" : "" }
                    </small>
                    <textarea className="form-control" onChange={this.onDescriptionChange} id="description-input" name="description-input" placeholder="Description" aria-describedby="descriptionHelp"></textarea>
                </div>

                <button ref={this.submitButton} type="submit" className="btn btn-primary">
                    Create Journal
                </button>

                <ToastsContainer store={ToastsStore} />
            </form>
        )   
    }
}

export default AddJournal