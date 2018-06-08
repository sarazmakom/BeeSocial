import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.upload = this.upload.bind(this);
        this.setFile = this.setFile.bind(this);
    }
    setFile(e) {
        this.file = e.target.files[0];
    }
    upload(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", this.file);
        axios.post("/upload", formData).then(({ data }) => {
            this.props.setImage(data);
        });
    }
    render() {
        return (
            <div id="uploader">
                <div className="x" onClick={this.props.onClick}>
                    X
                </div>
                <div>
                    <input
                        type="file"
                        name="file"
                        id="file"
                        onChange={this.setFile}
                    />
                    <button onClick={this.upload}>Upload</button>
                </div>
            </div>
        );
    }
}
