import React from 'react'

// Import images
import boy from '../../../img/boy.svg'
import girl from '../../../img/girl.svg'
import neutral from '../../../img/neutral.svg'

class UserInfo extends React.Component {

    getAvatar = (user) => {
        switch(user.gender){
            case "male":
                return <img className="avatar" src={boy} alt="Male avatar"/>
            case "female":
                return <img className="avatar" src={girl} alt="Female avatar"/>
            default:
                return <img className="avatar" src={neutral} alt="Other avatar"/>
        }
    }

    render(){
        return (
            <div>
            <div className="card profile-card">
                <div className="media">
                    <div className="d-flex" href="#">
                        { this.getAvatar(this.props.user) }
                    </div>
                    <div className="media-body">
                        <h5>{this.props.user.name}</h5>
                        <h6 className="text-muted">
                            {this.props.user.username}
                        </h6>
                        <p>
                            {
                                this.props.user.private === "true" ?
                                <span className="badge badge-danger">Private</span> :
                                <span className="badge badge-primary">Public</span>
                            }
                        </p>
                        {/** 
                        <p>
                            <button className="btn btn-primary btn-sm">Edit</button>
                        </p>
                        */}
                    </div>
                </div>
            </div>
            </div>
        )
    }
}

export default UserInfo