import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import {Input, Button,  Row} from 'react-materialize'

import AuthService from '../Auth/AuthService'



var tmp_url = require('../../config/conf.jsx');

class Signin extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            Login: "",
            Email: ""
        };
        this.Auth = new AuthService();
        this.handleLoginChange = this.handleLoginChange.bind(this);
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

    handleRegistration() {
        var data = new FormData();
        data.append('find', this.state.Login);
        axios({
            url: tmp_url.api_url + '/signin/password/recover',

            method: 'post',

            headers: {
                'Content-Type': 'multipart/form-data',
            },

            data: data,

            responseType: 'json'
        })
        .then(response => {

            if (!response.data.userExist) {
                window.Materialize.toast('User does not exist!', 2000, 'red rounded');
            }
            if (response.data.userExist && response.data.mailSend) {
                this.props.history.replace('/');
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
                            <h4 className="col s5 m4 offset-s3 offset-m3">Restore Pasword:</h4>
                            <Input  type="email" label="Login" value={this.state.Login} onChange={this.handleLoginChange} s={12} />
                            <Button waves='light' className="col s10 m4 offset-s1 offset-m3"  onClick={this.handleRegistration}>Submit</Button>
                            
                        </div>
                         <div className="col s6 offset-s5 link">
                            <Link to="/signin">Signin</Link>
                        </div>
                    </div>
                </Row>
            </div>
        );
    };
}
export default Signin