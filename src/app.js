import React from "react";
import axios from "axios";
import Logo from "./logo";
import ProfilePic from "./propic";
import Uploader from "./uploader";
import { BrowserRouter, Link, Route } from "react-router-dom";
import Profile from "./profile";
import BioUpload from "./bioupload";
import OtherPersonProfile from "./other";
import Friends from "./friends";
import Online from "./online";
import Chat from "./chat";
// import { connect } from "react-redux";
// import { getUserInfo } from "./actions";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.showUploader = this.showUploader.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
        this.setImage = this.setImage.bind(this);
        this.setBio = this.setBio.bind(this);
        this.showBioUploader = this.showBioUploader.bind(this);
    }
    componentDidMount() {
        axios.get("/user").then(({ data }) => {
            this.setState({
                first: data.first,
                last: data.last,
                profilePic: data.image_url,
                id: data.id,
                bio: data.bio
            });
        });
    }

    showUploader() {
        this.setState({
            uploaderIsVisible: true
        });
    }
    hideUploader() {
        this.setState({
            uploaderIsVisible: false
        });
    }
    setImage(imgUrl) {
        this.setState({
            profilePic: imgUrl,
            uploaderIsVisible: false
        });
    }
    setBio(newBio) {
        this.setState(
            {
                bio: newBio,
                bioUploaderIsVisible: false
            },
            () => console.log("bio set", this.state)
        );
    }
    showBioUploader() {
        this.setState(
            {
                bioUploaderIsVisible: true
            },
            () => console.log("show biouploader's this.state", this.state)
        );
    }
    render() {
        if (!this.state.id) {
            return null;
        }
        return (
            <BrowserRouter>
                <div id="app">
                    <div id="header">
                        <div className="grow">
                            <Logo />
                        </div>

                        <h3 className="grow">
                            <Link to="/" className="link-style">
                                Profile
                            </Link>
                        </h3>
                        <br />
                        <h3 className="grow">
                            <Link to="/friends" className="link-style">
                                Friends
                            </Link>
                        </h3>
                        <br />
                        <h3 className="grow">
                            <Link to="/online" className="link-style">
                                Online
                            </Link>
                        </h3>
                        <br />
                        <h3 className="grow">
                            <Link to="/chat" className="link-style">
                                Chat
                            </Link>
                        </h3>
                        <br />
                        <h3 className="grow">
                            <a href="/logout" className="link-style">
                                Logout
                            </a>
                        </h3>

                        <div>
                            <img
                                className="small"
                                src={this.state.profilePic}
                                onClick={this.showUploader}
                            />
                        </div>
                    </div>

                    <div>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    id={this.state.id}
                                    first={this.state.first}
                                    last={this.state.last}
                                    profilePic={this.state.profilePic}
                                    bio={this.state.bio}
                                    setBio={this.setBio}
                                    showBioUploader={this.showBioUploader}
                                    showUploader={this.showUploader}
                                    bioUploaderIsVisible={
                                        this.state.bioUploaderIsVisible
                                    }
                                />
                            )}
                        />
                    </div>

                    {this.state.uploaderIsVisible && (
                        <Uploader
                            setImage={this.setImage}
                            onClick={this.hideUploader}
                        />
                    )}

                    <Route exact path="/friends" component={Friends} />
                    <Route exact path="/online" component={Online} />
                    <Route exact path="/chat" component={Chat} />
                    <Route path="/users/:id" component={OtherPersonProfile} />
                </div>
            </BrowserRouter>
        );
    }
}
