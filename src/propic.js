import React from "react";

export default function ProfilePic(props) {
    return (
        <img
            className="big"
            src={props.url || "./user.png"}
            onClick={props.onClick}
            alt={(props.first, props.last)}
        />
    );
}
