import React from 'react'
import '../css/Profile.css'
import buildUrl from 'build-url'

// Import components
import UserInfo from './UserInfo'
import Stats from './Stats'

class Profile extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            journals : [],
            notes : []
        }
    }

    getJournals = () => {
        const url = buildUrl(this.props.base_url, {
            path : "/api/journals/retrieve",
            queryParams : {
                user_id : this.props.user._id
            }
        })
        fetch(url, { method : 'GET', headers : { 'Accept' : 'application/json' } })
        .then( res => res.json() )
        .then( data => {
            if( 'journals' in data ){
                this.setState({ journals : data.journals })
            }
        } )
    }

    getNotes = () => {
        const url = buildUrl(this.props.base_url, {
            path : "/api/notes/all",
            queryParams : {
                user_id : this.props.user._id
            }
        })
        fetch(url, { method : 'GET', headers : { 'Accept' : 'application/json' } })
        .then( res => res.json() )
        .then( data => {
            if('notes' in data){
                this.setState({ notes : data.notes })
            }
        } )
    }

    componentDidMount(){
        this.getJournals()
        this.getNotes()
    }

    render(){
        return (
            <div>
                
                <UserInfo base_url={this.props.base_url} user={this.props.user} />
                
                <Stats 
                base_url={this.props.base_url} 
                user={this.props.user}
                journals={this.state.journals}
                notes={this.state.notes} />

            </div>
        )
    }
}

export default Profile