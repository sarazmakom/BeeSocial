import React from "react";
import ProfilePic from "./propic";
import BioUpload from "./bioupload";
import { BrowserRouter, Link, Route } from "react-router-dom";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
    }
    showUploader() {
        this.setState({
            uploaderIsVisible: true
        });
    }
    render() {
        return (
            <div>
                <h1>
                    Welcome, {this.props.first} {this.props.last}
                </h1>

                <ProfilePic
                    url={this.props.profilePic}
                    onClick={this.props.showUploader}
                />

                <h2>{this.props.bio}</h2>
                <h2 onClick={this.props.showBioUploader}>Edit</h2>
                {this.props.bioUploaderIsVisible && (
                    <BioUpload setBio={this.props.setBio} />
                )}
            </div>
        );
    }
}
