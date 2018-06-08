import React from "react";
import axios from "axios";
import Logo from "./logo";
import ProfilePic from "./propic";
import Uploader from "./uploader";
import { BrowserRouter, Link, Route } from "react-router-dom";
import Profile from "./profile";
import BioUpload from "./bioupload";

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
            console.log(data);
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
        console.log("hello");
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
            () => console.log("show", this.state)
        );
    }
    render() {
        if (!this.state.id) {
            return null;
        }
        return (
            <div id="app">
                <Logo />
                <ProfilePic
                    url={this.state.profilePic}
                    onClick={this.showUploader}
                />

                <BrowserRouter>
                    <div>
                        <Route
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
                </BrowserRouter>

                {this.state.uploaderIsVisible && (
                    <Uploader
                        setImage={this.setImage}
                        onClick={this.hideUploader}
                    />
                )}
            </div>
        );
    }
}
