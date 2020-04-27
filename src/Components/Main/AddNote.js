import React from 'react'
import buildUrl from 'build-url'
import autosize from 'autosize'
import { Button, Form, Badge } from 'react-bootstrap'
import {ToastsContainer, ToastsStore} from 'react-toasts'

class AddNote extends React.Component{
    
    constructor(props){
        super(props)

        this.state = {
            journal_id : "",
            title : "",
            private : false,
            text : "",
            tags : [],

            journals : []  // A list of the user's journals
        }

        this.privateCheckRef = React.createRef()
        this.journalRef = React.createRef()
        this.titleRef = React.createRef()
        this.textRef = React.createRef()
    }

    componentDidMount(){
        // Get the current user's journals
        const url = buildUrl(this.props.base_url, {
            path : "/api/journals/retrieve",
            queryParams : {
                user_id : this.props.user._id
            }
        })

        fetch(url)
        .then( res => res.json() )
        .then ( data => {
            if('journals' in data){
                this.setState({ journals : data['journals'] })
            }
        })

        // If a note is passed, set its values on the form
        if(this.props.note){

            // Make journal selection element invisible
            this.journalRef.current.classList.add('d-none')
            // Set title
            this.titleRef.current.value = this.props.note.title
            // Set private checkbox to checked
            this.privateCheckRef.current.checked = (this.props.note.private === "true")
            // Set the text of the note
            this.textRef.current.value = this.props.note.text

            this.setState({
                title : this.props.note.title,
                private : this.props.private === "true" ? true : false,
                text : this.props.note.text,
                tags : this.props.note.tags.split(",").map( tag => {
                    return tag.trim()
                } )
            })
        }

    }

    resetState = () => {
        this.setState({
            journal_id : "",
            title : "",
            private : false,
            text : "",
            tags : [],
        })
    }

    onJournalChange = (event) => {
        const id = event.target.value
        this.setState({ journal_id : id})

        var privateCheckElement = this.privateCheckRef.current

        this.state.journals.forEach( journal => {
            if(journal._id === id && journal.private === "true"){
                // If current selected journal is private, set private to true and disable checkbox
                this.setState({ private : true })
                privateCheckElement.checked = true
                privateCheckElement.setAttribute('disabled', 'disabled')
            } else {
                // Otherwise, uncheck it and enable it
                privateCheckElement.removeAttribute('disabled')
            }
        } )
    }

    onTitleChange = (event) => {
        const newTitle = event.target.value.trim()
        this.setState({ title : newTitle })
    }

    onPrivacyChange = (event) => {
        this.setState({ private : event.target.checked })
    }

    onTextChange = (event) => {
        const newText = event.target.value.trim()
        this.setState({ text : newText })
        autosize(event.target)
    }

    onTagsChange = (event) => {
        const tagsList = event.target.value.split(";")
        this.setState({ tags : tagsList.map( tag => {
            return tag.trim()
        } ) })
        autosize(event.target)
    }

    updateNote = () => {
        var data = new FormData()
        data.append("note_id", this.props.note._id)
        data.append("user_id", this.props.user._id)
        data.append("title", this.state.title)
        data.append("private", this.state.private)
        data.append("text", this.state.text)
        data.append("tags", this.state.tags)

        fetch(this.props.base_url + "/api/notes/update", {
            method : 'POST',
            headers : { 'Accept' : 'application/json' },
            body : new URLSearchParams(data)
        })
        .then( res => res.json() )
        .then( data => {
            if( 'status' in data && data.status === "Success" ){
                this.props.getNotes()
                // Display success toast
                ToastsStore.success("Note updated")
            } else {
                // Display failed toast
                ToastsStore.error("Failed to update note. Try again later")
            }
        } )
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const form = event.target

        // Check if either the title or text are provided
        if( this.state.title === "" && this.state.text === ""){
            // Set error
            ToastsStore.error("You must provide either a title or text")
        } else {
            // If a note has been passed in props, call the update method instead
            if(this.props.note){
                this.updateNote()
                return
            }

            // Make API call to insert the note
            var data = new FormData()
            data.append('journal_id', this.state.journal_id)
            data.append('title', this.state.title)
            data.append('private', this.state.private)
            data.append('text', this.state.text)
            data.append('tags', this.state.tags)
            data.append('user_id', this.props.user._id)

            fetch(this.props.base_url + "/api/notes/create", {
                method: 'POST',
                headers : {
                    'Accept' : 'application/json'
                },
                body : new URLSearchParams(data)
            })
            .then( res => res.json() )
            .then( data => {
                if( 'status' in data && data.status === "Success" ){
                    this.props.getNotes()
                    // Display success toast
                    ToastsStore.success("Note created")
                    // Clear form after note creation
                    form.reset()
                    this.resetState()
                } else {
                    // Display failed toast
                    ToastsStore.error("Failed to create note. Try again later")
                }
            })
        }
    }

    render(){
        return (
            <Form className="data-form" onSubmit={this.handleSubmit} >
                <Form.Group ref={this.journalRef}>
                    <Form.Label htmlFor="journal-select">Journal</Form.Label>
                    <Form.Control as="select" onChange={this.onJournalChange} name="journal-select">
                        <option value="">No Journal</option>
                        {
                            this.state.journals.map( journal => {
                             return <option key={journal._id} value={journal._id} >
                                        {journal.title}
                                    </option>
                            })
                        }
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor="title">Title</Form.Label>
                    <Form.Control ref={this.titleRef} type="text" onChange={this.onTitleChange} name="title" placeholder="Note Title"></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Check
                        ref={this.privateCheckRef} 
                        onClick={this.onPrivacyChange} 
                        type="checkbox"
                        label="Private"
                        name="private">
                    </Form.Check>
                    <Form.Text className="text-muted">
                        All notes created in a private journal will automatically be private
                    </Form.Text>
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor="tags-input">Tags</Form.Label>
                    <Form.Control as="textarea" onChange={this.onTagsChange} type="text" className="form-control" name="tags-input" placeholder="Tags" value={this.state.tags.join(";")}></Form.Control>
                    <Form.Text className="text-muted">
                        Add semi-colon(;) at the end of text to add it to list of tags
                    </Form.Text>
                    <div>
                        { this.state.tags.map( (tag, index) => (
                                <Badge key={index} variant="success">{tag}</Badge>
                            )
                        )}
                    </div>
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor="text-input">Text</Form.Label>
                    <Form.Control as="textarea" ref={this.textRef} onChange={this.onTextChange} name="text-input" placeholder="Text"></Form.Control>
                </Form.Group>

                <Button type="submit" className="btn-primary">
                    { this.props.note ? "Update Note" : "Create Note" }
                </Button>

                <ToastsContainer store={ToastsStore} />
            </Form>
        )
    }
}

export default AddNote