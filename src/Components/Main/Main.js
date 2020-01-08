import React from 'react'
import buildUrl from 'build-url'

// Import components
import AddJournal from './AddJournal'
import AddNote from './AddNote'
import Profile from './Profile/Profile'
import Home from './Home'
/*
import Explore from './Explore/Explore'
import Settings from './Settings' */

class Main extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            journals : [],
            notes : [],
            liked_notes : [],
            selected_journal : null
        }
    }

    componentDidMount(){
        // Get user's journals
        this.getJournals()
        // Get user's notes for current selected journal
        this.getNotes()
        // Get user's liked notes
        this.getLikedNotes()
    }

    getJournals = () => {
        // Retrieve all of the user's journals
        const url = buildUrl(this.props.base_url, {
            path : "api/journals/retrieve",
            queryParams : {
                user_id : this.props.user._id
            }
        })
        fetch(url)
        .then( res => res.json() )
        .then( data => {
           if('journals' in data){
               this.setState({ journals : data.journals })
           }
        })
    }

    getNotes = () => {
        // Retrieve all of the user's notes from the selected journal
        var id = null

        this.state.selected_journal === null ? id = '' : id = this.state.selected_journal._id

        const url = buildUrl(this.props.base_url, {
            path : "/api/notes/retrieve",
            queryParams : {
                user_id : this.props.user._id,
                journal_id : id
            }
        })

        fetch(url, { method : 'GET', headers : { 'Accept' : 'application/json' } })
        .then( res => res.json() )
        .then( data => {
            if('notes' in data){
                this.setState({ notes : data.notes })
            }
        })
    }

    setSelectedJournal = (id) => {
        // Set selected journal to null if no id value is provided (i.e No Journal selected)
        if(id === ""){
            this.setState({ selected_journal : null }, () => {
                // Retrieve notes after setState is finished
                this.getNotes()
            })
        }
        // Otherwise, select the appropriate journal
        this.state.journals.forEach( journal => {
            if(journal._id === id){
                this.setState({ selected_journal : journal }, () => {
                    // Retrieve the selected journal's notes after setState is finished
                    this.getNotes()
                })
            }
        } ) 
    }

    getLikedNotes = () => {
        const url = buildUrl(this.props.base_url, {
            path : "/api/notes/liked",
            queryParams : {
                user_id : this.props.user._id
            }
        })
        fetch(url, { method : 'GET', headers : { 'Accept' : 'application/json' } })
        .then( res => res.json() )
        .then( data => {
            if('notes' in data){
                this.setState({ liked_notes : data.notes })
            }
        } )
    }

    render(){

        return(
            <div>
                <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab" aria-controls="pills-home" aria-selected="true">
                            Home
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-profile" role="tab" aria-controls="pills-profile" aria-selected="false">
                            Profile
                        </a>
                    </li>
                    {/*
                    <li className="nav-item">
                        <a className="nav-link" id="pills-contact-tab" data-toggle="pill" href="#pills-explore" role="tab" aria-controls="pills-contact" aria-selected="false">
                            Explore
                        </a>
                    </li> */}
                    <li className="nav-item">
                        <a className="nav-link" id="pills-journal-tab" data-toggle="pill" href="#pills-add-journal" role="tab" aria-controls="pills-add-journal" aria-selected="false">
                            Add Journal
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="pills-note-tab" data-toggle="pill" href="#pills-add-note" role="tab" aria-controls="pills-add-note" aria-selected="false">
                            Add Note
                        </a>
                    </li>
                    {/** 
                    <li className="nav-item">
                        <a className="nav-link" id="pills-contact-tab" data-toggle="pill" href="#pills-settings" role="tab" aria-controls="pills-contact" aria-selected="false">
                            Settings
                        </a>
                    </li>*/}
                    <li className="nav-item">
                        <a className="nav-link" id="pills-logout-tab" data-toggle="modal" data-target="#logoutModal" aria-selected="false">
                            Logout
                        </a>
                    </li>
                </ul>
                <div className="tab-content" id="pills-tabContent">
                    <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                        <Home
                        base_url={this.props.base_url} 
                        user={this.props.user}
                        journals={this.state.journals}
                        notes={this.state.notes}
                        liked_notes={this.state.liked_notes}
                        selected_journal={this.state.selected_journal}
                        setSelectedJournal={this.setSelectedJournal}
                        getLikedNotes={this.getLikedNotes}
                        getNotes={this.getNotes} />
                    </div>
                    <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-home-tab">
                        <Profile
                        base_url={this.props.base_url} 
                        user={this.props.user}
                        journals={this.state.journals}
                        notes={this.state.notes}
                        liked_notes={this.state.liked_notes}
                        getLikedNotes={this.getLikedNotes} />
                    </div>
                    {/*
                    <div className="tab-pane fade" id="pills-explore" role="tabpanel" aria-labelledby="pills-home-tab">
                        <Explore />
                    </div> */}
                    <div className="tab-pane fade" id="pills-add-journal" role="tabpanel" aria-labelledby="pills-profile-tab">
                        <AddJournal 
                        base_url={this.props.base_url} 
                        user={this.props.user}
                        getJournals={this.getJournals} />
                    </div>
                    <div className="tab-pane fade" id="pills-add-note" role="tabpanel" aria-labelledby="pills-contact-tab">
                        <AddNote 
                        base_url={this.props.base_url} 
                        user={this.props.user}
                        getNotes={this.getNotes} />
                    </div>
                    {/*
                    <div className="tab-pane fade" id="pills-settings" role="tabpanel" aria-labelledby="pills-contact-tab">
                        <Settings user={this.props.user} />
                    </div>
                    */}
                </div>

                {/* Logout Modal */}
                <div className="modal fade" id="logoutModal" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-body">
                        <p>Are you sure you want to log out?</p>
                        <button type="button" className="btn btn-secondary note-button" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.props.logout}>Logout</button>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        )
    }
}

export default Main