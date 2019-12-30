import React from 'react'

class Main extends React.Component{
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
                        <a className="nav-link" id="pills-home-tab" data-toggle="pill" href="#pills-profile" role="tab" aria-controls="pills-home" aria-selected="false">
                            Profile
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="pills-contact-tab" data-toggle="pill" href="#pills-explore" role="tab" aria-controls="pills-contact" aria-selected="false">
                            Explore
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-add-journal" role="tab" aria-controls="pills-profile" aria-selected="false">
                            Add Journal
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="pills-contact-tab" data-toggle="pill" href="#pills-add-note" role="tab" aria-controls="pills-contact" aria-selected="false">
                            Add Note
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="pills-contact-tab" data-toggle="pill" href="#pills-settings" role="tab" aria-controls="pills-contact" aria-selected="false">
                            Settings
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="pills-contact-tab" data-toggle="pill" href="#pills-contact" role="tab" aria-controls="pills-contact" aria-selected="false">
                            Logout
                        </a>
                    </li>
                </ul>
                <div className="tab-content" id="pills-tabContent">
                    <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                        Home
                    </div>
                    <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-home-tab">
                        Profile
                    </div>
                    <div className="tab-pane fade" id="pills-explore" role="tabpanel" aria-labelledby="pills-home-tab">
                        Explore
                    </div>
                    <div className="tab-pane fade" id="pills-add-journal" role="tabpanel" aria-labelledby="pills-profile-tab">
                        Add Journal
                    </div>
                    <div className="tab-pane fade" id="pills-add-note" role="tabpanel" aria-labelledby="pills-contact-tab">
                        Add Note
                    </div>
                    <div className="tab-pane fade" id="pills-settings" role="tabpanel" aria-labelledby="pills-contact-tab">
                        Settings
                    </div>
                </div>
            </div>
        )
    }
}

export default Main