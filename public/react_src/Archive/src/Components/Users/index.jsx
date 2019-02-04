import React from 'react'
import axios from 'axios'
var tmp_url = require('../../config/conf.jsx');

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Users: 0,
            userreq: "",
            login : this.props.match.params.login
        };
        this.userPage = this.userPage.bind(this);
    }

    userPage(login)
    {
        var data = new FormData();
        axios({
            url: tmp_url.api_url + login,

            method: 'post', // default

            headers: {
                'Content-Type': 'multipart/form-data',
            },

            data: data,

            responseType: 'json', // default

        }).then(response => {
            console.log(response.data);
        }).catch(errors => {
            alert(errors)
        });
        // console.log(res);
    }

    render() {
        // var login = "Aika";
       this.userPage(this.state.login);
        return (
            <div> Users </div>
        );
    }
}

export default Users