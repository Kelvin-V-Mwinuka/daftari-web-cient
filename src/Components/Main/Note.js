import React from 'react'
import './css/Note.css'

class Note extends React.Component {

    getPrivateStatus = () => {
        if(this.props.note.private === "true"){
            return "Private"
        }
        return "Public"
    }

    likeNote = () => {
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
            console.log(data)
        } )
    }

    render(){
        return (
            <div className="card note-card shadow-lg">
                <div className="card-body">
                    <h5 className="card-title note-title" onClick={this.likeNote}>{this.props.note.title}</h5>
                    <p className="card-text note-text">
                        {this.props.note.text}
                    </p>
                    <p>
                        {
                            this.props.note.tags.split(",").map( tag => {
                                return <span key={tag.trim()} className="badge badge-success">{tag.trim()}</span>
                            })
                        }
                    </p>
                </div>
            </div>
        )
    }
}

export default Note