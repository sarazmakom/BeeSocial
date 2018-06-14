// import React from 'react'
// // import axios from './axios'
// import { receiveFriendsAndWannabes, acceptFriendshio, endFriendship} from './actions'
// import { connect} from 'react-redux'
//
//
// class Friends extends React.Component {
//     constructor(props){
//         super(props)
//     }
//     componentDidMount(){
//         this.props.dispatch(receiveFriendsAndWannabes())
//     }
//     render(){
//     return (
//         <h1> {this.props.food} </h1>
//     )
// }
// }
//
// const getStateFromRedux = state =>{
//     console.log("getStateFromRedux", state);
//     return {
//         food: state.favoriteFood // gonna take the favoriteFoodfrom the redux state object
//     }
// }
//
// export default connect (null)(Friends)
// // export default connect (getStateFromRedux)(Friends)
