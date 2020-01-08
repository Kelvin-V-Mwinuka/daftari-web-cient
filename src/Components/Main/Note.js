import React from 'react'
import './css/Note.css'

// Import components
import AddNote from './AddNote'

// Import images
import unliked from '../../img/unliked.svg'
import liked from '../../img/liked.svg'
import edit from '../../img/edit.svg'
import del from '../../img/delete.svg'

class Note extends React.Component {

    noteLiked = () => {
        // Check if the note has been liked
        for(var i=0; i < this.props.liked_notes.length; i++){
            if(this.props.liked_notes[i]._id === this.props.note._id){
                return true
            }
        }
        return false
    }

    getPrivateStatus = () => {
        if(this.props.note.private === "true"){
            return <span className="badge badge-danger">Private</span>
        }
        return <span className="badge badge-info">Public</span>
    }

    getLikeButton = () => {
        this.noteLiked()
        if(!this.noteLiked()){
            return <button onClick={this.likeNote} className="btn btn-secondary btn-sm note-button">
                <span>
                    <img className="note-icon" src={unliked} alt="Liked icon"></img>
                </span>
                <b>Like</b>
                </button>
        } else {
            return <button onClick={this.likeNote} className="btn btn-secondary btn-sm note-button">
                <span>
                    <img className="note-icon" src={liked} alt="Unliked icon"></img>
                </span>
                <b>Unlike</b>
                </button>
        }
    }

    getEditButton = () => {
        // Return edit button if the user owns the note
        if(this.props.user._id === this.props.note.user_id){

            const editButton = 
            <div className="dropdown note-dropdown">
                <button className="btn btn-secondary btn-sm note-button" id="editButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span>
                        <img className="note-icon" src={edit} alt="Edit icon"></img>
                    </span>
                    <b>Edit</b>
                </button>
                <div className="dropdown-menu" aria-labelledby="editButton">
                    <AddNote 
                    base_url={this.props.base_url}
                    user={this.props.user}
                    note={this.props.note}
                    getNotes={this.props.getNotes} />
                </div>
            </div>
            return editButton
        }
    }

    getDeleteButton = () => {
        // Return the delete button if the user owns the note
        if(this.props.user._id === this.props.note.user_id){

            const deleteButton = 
            <div className="dropdown note-dropdown">
                <button className="btn btn-secondary btn-sm note-button" id="deleteButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span>
                        <img className="note-icon" src={del} alt="Delete icon"></img>
                    </span>
                    <b>Delete</b>
                </button>
                <div className="dropdown-menu" aria-labelledby="deleteButton">
                <a className="dropdown-item" href="#">Close</a>
                <a className="dropdown-item" onClick={this.deleteNote} href="#">Delete</a>
                </div>
            </div>

            return deleteButton
        }
    }

    deleteNote = (event) => {
        var data = new FormData()
        data.append('note_id', this.props.note._id)
        data.append('user_id', this.props.user._id)

        fetch(this.props.base_url + "/api/notes/delete", {
            method : 'POST',
            headers : { 'Accept' : 'application/json' },
            body : new URLSearchParams(data)
        })
        .then( res => res.json() )
        .then( data => {
            if('status' in data && data.status === "Success"){
                this.props.getNotes()
            }
        } )
    }

    likeNote = (event) => {
        var data = new FormData()
        data.append('note_id', this.props.note._id)
        data.append('user_id', this.props.user._id)
        
        fetch(this.props.base_url + "/api/notes/like", {
            method : 'POST',
            headers: { 'Accept' : 'application/json' },
            body : new URLSearchParams(data)
        })
        .then( res => res.json() )
        .then( data => {
            if('action' in data){
                // Get liked notes
                this.props.getLikedNotes()
            }
        } )
    }

    render(){
        return (
            <div className="card note-card shadow-lg">
                <div className="card-body">
                    <h5 className="card-title note-title">{this.props.note.title}</h5>
                    <p className="card-text note-text">
                        {this.props.note.text}
                    </p>
                    <p>
                        {
                            this.props.note.tags.split(",").map( (tag, index) => {
                                return <span key={index} className="badge badge-success">{tag.trim()}</span>
                            })
                        }
                    </p>
                    <p>
                        { this.getPrivateStatus() }
                    </p>
                    <div>
                        { this.getLikeButton() }
                        { this.getEditButton() }
                        { this.getDeleteButton() }
                    </div>
                </div>
            </div>
        )
    }
}

export default Note