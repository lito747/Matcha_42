import React from 'react'
import axios from 'axios'
import {Input, Button,  Row} from 'react-materialize'
import { Link } from 'react-router-dom'
import AuthService from '../Auth/AuthService'

import './styles.css'

var tmp_url = require('../../config/conf.jsx');

class Signin extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            Login: "",
            Password: "",

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

        this.setState({
            Login: event.target.value
        });
    }
    handlePasswordChange(event) {

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

            if (this.tmp === true) {
                if (response.data.token) {
                    if (response.data.FullRegister === 0) {
                        this.props.history.replace('/extendreg');
                    }
                    if (response.data.EmailConfirm === 0) {
                        window.Materialize.toast('Walidate your mail!', 2000, 'red rounded');
                    } else if (response.data.EmailConfirm !== 0 && response.data.FullRegister === 0) {
                        this.Auth.setExtend(parseInt(response.data.FullRegister, 10));
                        this.Auth.setToken(response.data.token);
                        this.props.history.replace('/extendreg');
                    } else if (response.data.EmailConfirm !== 0 && response.data.FullRegister !== 0) {
                        this.Auth.setExtend(parseInt(response.data.FullRegister, 10));
                        this.Auth.setToken(response.data.token);
                        this.props.history.replace('/');
                    }
                }
                if (response.data.token === null) {
                    window.Materialize.toast('Wrong user data!', 2000, 'red rounded');
                }
            }
        })
        .catch(errors => {
  
        });
    }

    componentDidMount() {
        this.tmp = true;
    }

    componentWillUnmount() {
        this.tmp = false;
    }

    render() {
        return(
            <div >
                <Row>
                    <div className="container block">
                        <div className="col s8 offset-s2 m6 offset-m3">
                            <h4 className="col s3 m4 offset-s4 offset-m4">Signin:</h4>
                            <Input  type="email" label="Login" value={this.state.Login} onChange={this.handleLoginChange} s={12} />
                            <Input  type="password" label="Password" value={this.state.Password} onChange={this.handlePasswordChange} s={12} />
                            <Button waves='light' className="col s10 m4 offset-s1 offset-m3"  onClick={this.handleRegistration}>Submit</Button>
                            
                        </div>
                        <div className="col s4 offset-s4 link">
                            <Link to="/restor">Restor Pass</Link>
                            <span>Or </span>
                            <Link to="/signup">Signup</Link>
                        </div>
                    </div>
                </Row>
            </div>
        );
    };
}
export default Signin