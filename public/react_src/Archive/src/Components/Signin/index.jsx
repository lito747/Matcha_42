import React from 'react'
import axios from 'axios'
import {Input, Button, Icon} from 'react-materialize'
import AuthService from '../Auth/AuthService'

var tmp_url = require('../../config/conf.jsx');

class Signin extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            Login: "",
            Password: ""
        };
        this.Auth = new AuthService();
        this.handleLoginChange = this.handleLoginChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleRegistration = this.handleRegistration.bind(this);
    }

    componentWillMount() {
        if(this.Auth.loggedIn())
            this.props.history.replace('/');
    }
    handleLoginChange(event) {
        console.log('Email changed');
        this.setState({
            Login: event.target.value
        });
    }
    handlePasswordChange(event) {
        console.log('Email changed');
        this.setState({
            Password: event.target.value
        });
    }

    handleRegistration() {
        var data = new FormData();
        data.append('Login', this.state.Login);
        data.append('Password', this.state.Password);
        axios({
            url: tmp_url.api_url + '/signin',

            method: 'post', 

            headers: {
                'Content-Type': 'multipart/form-data',
            },

            data: data,

            responseType: 'json'
        })
        .then(response => {
            if (response.data) {
                if (parseInt(response.data.FullRegister) === 0) {
                    this.props.history.replace('/extendreg');
                }
                this.Auth.setExtend(parseInt(response.data.FullRegister));
                this.Auth.setToken(response.data.token);
                this.props.history.replace('/');
            }
        })
        .catch(errors => {
            console.log(errors);
        });
    }

    render() {
        return(
            <div className="container row col s6 offset-s3">
                <div className="col s6 offset-s3">
                    <h4 className="col s3 m4 offset-s2 offset-m4">Signin:</h4>
                    <Input  type="email" label="Login" value={this.state.Login} onChange={this.handleLoginChange} s={12} />
                    <Input  type="password" label="Password" value={this.state.Password} onChange={this.handlePasswordChange} s={12} />
                    <Button waves='light' className="col s8 m4 offset-s2 offset-m4"  onClick={this.handleRegistration}>Submit<Icon right>send</Icon></Button>
                </div>
            </div>

        );
    };
}
export default Signin