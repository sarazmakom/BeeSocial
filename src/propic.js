import React from "react";

export default function ProfilePic(props) {
    return (
        <img
            src={props.url || "./user.png"}
            onClick={props.onClick}
            alt={(props.first, props.last)}
        />
    );
}
