import React from 'react'
import buildUrl from 'build-url'
import autosize from 'autosize'

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
            console.log(data)
        } )
    }

    handleSubmit = (event) => {
        event.preventDefault()

        // Check if either the title or text are provided
        if( this.state.title === "" && this.state.text === ""){
            // Set error
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
                console.log(data)
            })
        }
    }

    render(){
        return (
            <form className="data-form" onSubmit={this.handleSubmit} >
                <div className="form-group" ref={this.journalRef}>
                    <label htmlFor="journal-select">Journal</label>
                    <select onChange={this.onJournalChange} className="form-control" 
                    id="journal-select" name="journal-select">
                        <option value="">No Journal</option>
                        {
                            this.state.journals.map( journal => {
                             return <option key={journal._id} value={journal._id} >
                                        {journal.title}
                                    </option>
                            })
                        }
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input ref={this.titleRef} type="text" onChange={this.onTitleChange} className="form-control" 
                    id="title" name="title" placeholder="Note Title"></input>
                </div>
                <div className="form-check">
                    <input ref={this.privateCheckRef} onClick={this.onPrivacyChange} type="checkbox" 
                    className="form-check-input" id="private" name="private" aria-describedby="privateHelp"></input>
                    <label className="form-check-label" htmlFor="private">Private</label>
                    <small id="privateHelp" className="form-text text-muted">
                        All notes created in a private journal will automatically be private
                    </small>
                </div>
                <div className="form-group">
                    <label htmlFor="tags-input">Tags</label>
                    <textarea onChange={this.onTagsChange} type="text" className="form-control" 
                    id="tags-input" name="tags-input" placeholder="Tags" aria-describedby="tagsHelp"
                    value={this.state.tags.join(";")}></textarea>
                    <small id="tagsHelp" className="form-text text-muted">
                        Add semi-colon(;) at the end of text to add it to list of tags
                    </small>
                    <div>
                        { this.state.tags.map( (tag, index) => (
                                <span key={index} className="badge badge-success">{tag}</span>
                            )
                        )}
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="text-input">Text</label>
                    <textarea ref={this.textRef} onChange={this.onTextChange} className="form-control" 
                    id="text-input" name="text-input" placeholder="Text" aria-describedby="textHelp"></textarea>
                </div>

                <button type="submit" className="btn btn-primary">
                    { this.props.note ? "Update Note" : "Create Note" }
                </button>
            </form>
        )
    }
}

export default AddNote