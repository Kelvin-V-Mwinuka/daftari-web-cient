import React from 'react'

// Import components
import Note from '../Note'

class Stats extends React.Component {

    render(){
        return (
            <div>
                <h5><b>Liked Notes</b></h5>
                <div className="container-fluid">
                    <div className="row flex-row flex-nowrap">
                        {
                            this.props.liked_notes.map( note => {
                                return <Note
                                key={note._id}
                                note={note}
                                base_url={this.props.base_url}
                                user={this.props.user}
                                liked_notes={this.props.liked_notes}
                                getLikedNotes={this.props.getLikedNotes} />
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Stats