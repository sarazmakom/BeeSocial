import React from "react";
import axios from "axios";
import Logo from "./logo";
import ProfilePic from "./profile";
import Uploader from "./uploader";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.showUploader = this.showUploader.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
        this.setImage = this.setImage.bind(this);
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
        // alert(9);
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

// in the index.js - app get profile we can check if the profilepic is there or in the profile pic componenet
// if props.url is undefined use default pic
//uploaderIsVisible - true the parent app need to pass a function to make the uploaderIsVisible show

// <img src={props.url} onClick= {props.onClick}
//upload button - label with hidden input
//s3 updating th erow in the database ajax response with th uploadurl image
