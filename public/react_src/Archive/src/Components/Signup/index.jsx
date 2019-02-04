import React from 'react'
import axios from 'axios'
import {Input, Button, Icon} from 'react-materialize'
import AuthService from '../Auth/AuthService'
var tmp_url = require('../../config/conf.jsx');

class Signup extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            Login: "",
            Password: "",
            Email: "",
            PasswordConfirm: ""
        };
        this.Auth = new AuthService();
        this.handleLoginChange = this.handleLoginChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordConfirmChange = this.handlePasswordConfirmChange.bind(this);
        this.handleRegistration = this.handleRegistration.bind(this);
    }

    componentWillMount(){
        if(this.Auth.loggedIn())
            this.props.history.replace('/');
    }

    handleLoginChange(event) {
        console.log('Login changed');
        this.setState({
            Login: event.target.value
        });
    }
    handleEmailChange(event) {
        console.log('Email changed');
        this.setState({
            Email: event.target.value
        });
    }
    handlePasswordChange(event) {
        console.log('Password changed');
        this.setState({
            Password: event.target.value
        });
    }
    handlePasswordConfirmChange(event) {
        console.log('Password changed');
        this.setState({
            PasswordConfirm: event.target.value
        });
    }

    handleRegistration() {
        var data = new FormData();
        data.append('Login', this.state.Login);
        data.append('Password', this.state.Password);
        data.append('Email', this.state.Email);
        data.append('ConfirmedPassword', this.state.PasswordConfirm);
        axios({
            url: tmp_url.api_url + '/signup',

            method: 'post', // default

            headers: {
                'Content-Type': 'multipart/form-data',
            },

            data: data,

            responseType: 'json', // default

        }).then(response => {
            this.props.history.replace('/');
            console.log(response.data);
        }).catch(errors => {
            alert(errors)
        });

    }

    render() {
        return(

            <div className="container row col s6 offset-s3">
                <div className="col s6 offset-s3">
                    <h4 className="col s3 m4 offset-s2 offset-m4">Signup:</h4>
                    <Input type='text' label='Login' value={this.state.Login} onChange={this.handleLoginChange} s={12}/>
                    <Input type='text' label='Email' value={this.state.Email} onChange={this.handleEmailChange} s={12}/>
                    <Input type='password' label='Password' value={this.state.Password} onChange={this.handlePasswordChange} s={12}/>
                    <Input type='password' label='Password Confirm' value={this.state.PasswordConfirm} onChange={this.handlePasswordConfirmChange} s={12}/>
                    <Button waves='light' className="col s8 m4 offset-s2 offset-m4" onClick={this.handleRegistration}>Submit<Icon right>send</Icon></Button>
                </div>
            </div>
        );
    };
}

export default Signup