import React from 'react'
import './css/Note.css'

class Note extends React.Component {

    getPrivateStatus = (note) => {
        if(note.private === "true"){
            return "Private"
        }
        return "Public"
    }

    render(){
        return (
            <div class="card note-card">
                <div class="card-body">
                    <h5 class="card-title">{this.props.note.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">
                        {this.getPrivateStatus(this.props.note)}
                    </h6>
                    <p class="card-text">
                        {this.props.note.text}
                    </p>
                    <a href="#" class="card-link">Edit</a>
                    <a href="#" class="card-link">Delete</a>
                </div>
            </div>
        )
    }
}

export default Note