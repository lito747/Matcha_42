// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import '../header.css';
//
// class Block extends React.Component{
//     static propTypes = {
//         items: PropTypes.array.isRequired,
//         isLoading: PropTypes.bool,
//         submit: PropTypes.func
//     };
//
//     constructor(props){
//         super(props);
//         this.state = {
//             login: false,
//             main: true,
//         };
//     }
//
//
//     login() {
//         // alert(this.state.login);
//         this.setState({login: true, main:false})
//     }
//
//     main() {
//         this.setState({login: false, main:true})
//     }
//
//     render(){
//         console.log('items', this.props.items);
//             return(
//                 <div>
//                     {/*{this.props.items.link}*/}
//                     {this.props.items.map((item, index) => <a href={item.link} key={index}>{item.lable}</a>)}
//                 </div>
//             )
//         // if (this.state.login)
//         // {
//         //     return (
//         //         <div className="headerClass">
//         //             <button onClick={this.main.bind(this)}>Main Page</button>
//         //             <button>Sign Up</button>
//         //         </div>
//         //     )
//         // }
//         // if (this.state.main) {
//         //     return (
//         //         <div className="headerClass">
//         //             <button onClick={this.main.bind(this)}>Main Page</button>
//         //             <button onClick={this.login.bind(this)}>Log In</button>
//         //             <button>Sign Up</button>
//         //         </div>
//         //     )
//         // }
//     }
// }
//
// export default Block