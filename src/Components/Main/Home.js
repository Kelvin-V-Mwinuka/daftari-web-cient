import React from 'react'
import buildUrl from 'build-url'

// Import components
import Journal from './Journal'
import Note from './Note'

class Home extends React.Component {

    constructor(props){
        super(props)
        
        this.state = {
            journals : [],
            notes : [],
            selected_journal : null
        }
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
               console.log(data.journals)
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

    onJournalChange = (event) => {
        // Set selected journal to null if no value is provided (i.e No Journal selected)
        if(event.target.value === ""){
            this.setState({ selected_journal : null }, () => {
                // Retrieve notes after setState is finished
                this.getNotes()
            })
        }
        // Otherwise, select the appropriate journal
        this.state.journals.forEach( journal => {
            if(journal._id === event.target.value){
                this.setState({ selected_journal : journal }, () => {
                    // Retrieve the selected journal's notes after setState is finished
                    this.getNotes()
                })
            }
        } ) 
    }

    componentDidMount(){
        this.getJournals()
        /** Retrieve notes. Since no journal is selected at the start, retrieve
         * notes with no journal
         */
        this.getNotes()
    }

    render(){
        return(
            <div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <label className="input-group-text" htmlFor="joutnal-select">Journal</label>
                    </div>
                    <select onChange={this.onJournalChange} className="custom-select" id="journal-select">
                        <option value="">No Journal</option>
                        {
                            this.state.journals.map( journal => {
                                return  <option key={journal._id} value={journal._id} >
                                            {journal.title}
                                        </option>
                            } )
                        }
                    </select>
                </div>
                <div>
                    <Journal base_url={this.props.base_url} user={this.props.user} journal={this.state.selected_journal} />
                </div>
                <div>
                    {
                        this.state.notes.map( note => {
                            return <Note key={note._id}
                                         base_url={this.props.base_url}
                                         user={this.props.user}
                                         note={note} />
                        })
                    }
                </div>
            </div>
        )
    }
}

export default Home