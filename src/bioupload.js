import React from "react";
import axios from "./axios";

export default class BioUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.uploadBio = this.uploadBio.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }
    uploadBio(e) {
        e.preventDefault();
        axios
            .post("/bioupload", {
                newBio: this.state.newBio
            })
            .then(({ data }) => {
                console.log("this", data);
                this.props.setBio(data);
            });
    }
    handleInput(e) {
        console.log(e.target);
        this.setState(
            {
                [e.target.name]: e.target.value
            },
            () => {
                console.log("yo", this.state);
            }
        );
    }

    render() {
        return (
            <div id="biouploader">
                <textarea name="newBio" onChange={this.handleInput} />
                <button onClick={this.uploadBio}>Upload bio</button>
            </div>
        );
    }
}
