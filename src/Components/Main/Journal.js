import React from 'react'
import './css/Journal.css'

class Journal extends React.Component {

    getPrivateStatus = (journal) => {
        if(journal.private === "true"){
            return "Private"
        }
        return "Public"
    }

    render(){
        return(
            <div>
                {
                    this.props.journal === null ?
                
                    // Display card showing empty journal
                    <div className="card journal-card">
                        <div className="card-body">
                            <h5 className="card-title">No Journal</h5>
                            <h6 className="card-subtitle mb-2 text-muted">
                                Displaying notes that don't belong to any journal
                            </h6>
                        </div>
                    </div> 
                    
                    :
                
                    // Display card showing journal details
                    <div className="card journal-card">
                        <div className="card-body">
                            <h5 className="card-title">{this.props.journal.title}</h5>
                            <h6 className="card-subtitle mb-2 text-muted">
                                {this.getPrivateStatus(this.props.journal)}
                            </h6>
                            <p className="card-text">
                                {this.props.journal.description}
                            </p>
                            <a href="#" className="card-link">Edit</a>
                            <a href="#" className="card-link">Delete</a>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default Journal