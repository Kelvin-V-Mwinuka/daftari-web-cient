import React from 'react'
import Masonry from 'react-masonry-css'

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

        this.breakpointColumnsObj = {
            default: 3,
            1100: 2,
            700: 1,
            500: 1
          };
    }

    onJournalChange = (event) => {
        this.props.setSelectedJournal.bind(this, event.target.value).call()
    }

    render(){
        return(
            <div>
                <div className="d-flex flex-row">
                    <select onChange={this.onJournalChange} className="custom-select" id="journal-select">
                        <option value="">No Journal</option>
                        {
                            this.props.journals.map( journal => {
                                return  <option key={journal._id} value={journal._id} >
                                            {journal.title}
                                        </option>
                            } )
                        }
                    </select>
                </div>

                <Journal 
                base_url={this.props.base_url} 
                user={this.props.user} 
                journal={this.props.selected_journal} />
                
                <Masonry
                breakpointCols={this.breakpointColumnsObj}
                className="notes-grid"
                columnClassName="notes-column" >
                    {
                        this.props.notes.map( note => {
                            return <Note key={note._id}
                                         base_url={this.props.base_url}
                                         user={this.props.user}
                                         note={note}
                                         liked_notes={this.props.liked_notes}
                                         getLikedNotes={this.props.getLikedNotes} />
                        })
                    }
                </Masonry>
            </div>
        )
    }
}

export default Home