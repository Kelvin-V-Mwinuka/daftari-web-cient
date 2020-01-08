import React from 'react'
import './css/Journal.css'

// Import logos

class Journal extends React.Component {

    getPrivateStatus = (journal) => {
        if(journal.private === "true"){
            return "Private"
        }
        return "Public"
    }

    getEditButton = () => {
        // Return the edit button if the journal belongs to the user 
    }

    getDeleteButton = () => {
        // Return the delete button if the journal belongs to the user
    }

    render(){
        return(
                    this.props.journal === null ?
                
                    // Display card showing empty journal
                    <div className="card journal-card shadow-lg">
                        <div className="card-body">
                            <h5 className="card-title journal-title">No Journal</h5>
                            <h6 className="card-text journal-text">
                                Notes that don't belong to any journal
                                { this.getEditButton() }
                                { this.getDeleteButton() }
                            </h6>
                        </div>
                    </div> 
                    
                    :
                
                    // Display card showing journal details
                    <div className="card journal-card shadow-lg">
                        <div className="card-body">
                            <h5 className="card-title journal-title">
                                {this.props.journal.title}
                            </h5>
                            <p className="card-text journal-text">
                                {this.props.journal.description}
                            </p>
                            <p>
                                {
                                    this.props.journal.tags.split(",").map( tag => {
                                        return <span key={tag} className="badge badge-warning">{tag.trim()}</span>
                                    })
                                }
                            </p>
                        </div>
                    </div>
        )
    }
}

export default Journal