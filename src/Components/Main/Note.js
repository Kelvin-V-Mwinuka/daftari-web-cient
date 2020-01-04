import React from 'react'
import './css/Note.css'

// Import images
import unliked from '../../img/unliked.svg'
import liked from '../../img/liked.svg'

class Note extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            liked : false
        }
    }

    componentDidMount(){
        this.setState({ liked : this.props.note.likes.includes(this.props.user._id) })
    }

    getPrivateStatus = () => {
        if(this.props.note.private === "true"){
            return "Private"
        }
        return "Public"
    }

    getLikeButton = () => {
        if(!this.state.liked){
            return <button onClick={this.likeNote} className="btn btn-secondary like-button">
                <span>
                    <img className="like-icon" src={unliked} alt="Liked icon"></img>
                </span>
                Like
                </button>
        } else {
            return <button onClick={this.likeNote} className="btn btn-secondary like-button">
                <span>
                    <img className="like-icon" src={liked} alt="Unliked icon"></img>
                </span>
                Unlike
                </button>
        }
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
                this.setState({ liked : data.action === "Liked" })
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
                            this.props.note.tags.split(",").map( tag => {
                                return <span key={tag.trim()} className="badge badge-success">{tag.trim()}</span>
                            })
                        }
                    </p>
                    <p>
                        { this.getLikeButton() }
                    </p>
                </div>
            </div>
        )
    }
}

export default Note