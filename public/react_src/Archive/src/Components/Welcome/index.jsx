import React from "react"
import axios from "axios"
import AuthService from '../Auth/AuthService'
import withAuth from '../Auth/withAuth'
import NavbarMy from '../Navbar'
import ExtendData from '../ExtendData'
import MainPage from '../MainPage'
var tmp_url = require('../../config/conf.jsx');
const Auth = new AuthService();


class Welcome extends React.Component{
    constructor(props){
        super(props);
        //this.ShowUsers = this.ShowUsers.bind(this);
        this.state = {
            users: ""
        };
        //this.ShowUsers();
    }

    // ShowUsers() {
    //     var data = new FormData();
    //     data.append('Login', "");
    //     axios({
    //         url: tmp_url.api_url + '/users',

    //         method: 'post', // default

    //         headers: {
    //             'Content-Type': 'multipart/form-data',
    //         },

    //         data: data,

    //         responseType: 'json', // default

    //     }).then(response => {
    //         console.log(response.data);
    //         self.setState({users: response.data});
    //     }).catch(errors => {
    //         alert(errors)
    //     });

    // }
    render()
    {
        // var i = 0;
        // var ret = '';
        // while(this.state.users[i])
        // {
        //     ret += this.state.users[i].Email + " |";
        //     i++;
        // }
        return(
            <div>
                            <NavbarMy/>
                            <div >
                                <MainPage history={this.props.history} user={this.state.user}/>
                            </div>

            </div>
        )
    }
}

export default withAuth(Welcome);


                            // <div >
                            //     <ExtendData/>
                            // </div>