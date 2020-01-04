import React from 'react'
import '../css/Profile.css'
import buildUrl from 'build-url'

// Import components
import UserInfo from './UserInfo'
import Stats from './Stats'

class Profile extends React.Component{

    render(){
        return (
            <div>
                
                <UserInfo 
                base_url={this.props.base_url} 
                user={this.props.user} />
                
                <Stats 
                base_url={this.props.base_url} 
                user={this.props.user}
                journals={this.props.journals}
                notes={this.props.notes}
                liked_notes={this.props.liked_notes}
                getLikedNotes={this.props.getLikedNotes} />

            </div>
        )
    }
}

export default Profile