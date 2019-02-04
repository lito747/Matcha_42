import React from 'react'
import axios from 'axios'
import {Input, Button, Row} from 'react-materialize'
import AuthService from '../Auth/AuthService'
import { Link } from 'react-router-dom'

import './styles.css'
var tmp_url = require('../../config/conf.jsx');

class Signup extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            FirstName: '',
            LastName: '',
            Login: "",
            Password: "",
            Email: "",
            PasswordConfirm: "",

        };
        this.Auth = new AuthService();
        this.handleLoginChange = this.handleLoginChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordConfirmChange = this.handlePasswordConfirmChange.bind(this);
        this.handleRegistration = this.handleRegistration.bind(this);
        this.handleFirstName = this.handleFirstName.bind(this);
        this.handleLastName = this.handleLastName.bind(this);
    }

    componentWillMount(){
        if(this.Auth.loggedIn())
            this.props.history.replace('/');

    }

    passCheck = (tru) => {
        let test = /^(?=.*[A-Z]).+$/.test(tru);
        let test1 = /^(?=.*[a-z]).+$/.test(tru);
        let test2 = /^(?=.*\d).+$/.test(tru);
        if (!test) {
            window.Materialize.toast('Password should contain capital letters!', 2000, 'red rounded');
            return false;
        }
        if (!test1) {
            window.Materialize.toast('Password should contain lower case letters!', 2000, 'red rounded');
            return false;
        }
        if (!test2) {
            window.Materialize.toast('Password should contain numbers!', 2000, 'red rounded');
            return false;
        }
        if (tru.length < 6) {
            window.Materialize.toast('Password should contain 6 chars!', 2000, 'red rounded');
            return false;
        }
        return true;
    }

    logcheck = (tru) => {
        if (tru.length < 6) {
            window.Materialize.toast('Login should contain 6 chars!', 2000, 'red rounded');
            return false;
        }
        return true;
    }

    is_autentic = (t1, t2) => {
        if (t1 !== t2) {
            window.Materialize.toast('Passwords does not match!', 2000, 'red rounded');
            return false;
        }
        return true;
    }

    email_check = (t) => {
        let tmp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(t);
        if (!tmp) {
            window.Materialize.toast('Email format str@str.str', 2000, 'red rounded');
            return false;
        }
        return true;
    }

    try_name = (t) => {
        if (t.length > 0) {
            if (t[0] >= 'A' && t[0] <= 'Z') {
                return true;
            }
        }
        if (t.length === 0) {
            window.Materialize.toast('Fill name filds!', 2000, 'red rounded');
            return false;
        } 
        window.Materialize.toast('Name starts whith capital!', 2000, 'red rounded');
        return false;
    }

    try_lname = (t) => {
        if (t.length > 0) {
            if (t[0] >= 'A' && t[0] <= 'Z') {
                return true;
            }
        }
        if (t.length === 0) {
            window.Materialize.toast('Fill last name filds!', 2000, 'red rounded');
            return false;
        } 
        window.Materialize.toast('Last name starts whith capital!', 2000, 'red rounded');
        return false;
    }

    handleLoginChange(event) {
        let tmp = event.target.value;
        if (tmp[tmp.length - 1] !== ' ') {
        this.setState({
            Login: event.target.value
        });
        } else {
            window.Materialize.toast('No white spaces!', 2000, 'red rounded');
        }
    }
    handleEmailChange(event) {
        let tmp = event.target.value;
        if (tmp[tmp.length - 1] !== ' ') {
        this.setState({
            Email: event.target.value
        });
        } else {
            window.Materialize.toast('No white spaces!', 2000, 'red rounded');
        }
    }
    handlePasswordChange(event) {
        let tmp = event.target.value;
        if (tmp[tmp.length - 1] !== ' ') {
        this.setState({
            Password: event.target.value
        });
        } else {
            window.Materialize.toast('No white spaces!', 2000, 'red rounded');
        }
    }
    
    handlePasswordConfirmChange(event) {
        let tmp = event.target.value;
        if (tmp[tmp.length - 1] !== ' ') {
        this.setState({
            PasswordConfirm: event.target.value
        });
        } else {
            window.Materialize.toast('No white spaces!', 2000, 'red rounded');
        }
    }


    handleRegistration() {
        if (this.passCheck(this.state.Password)
            && this.is_autentic(this.state.Password, this.state.PasswordConfirm)
            && this.email_check(this.state.Email)
            && this.logcheck(this.state.Login)
            && this.try_lname(this.state.LastName)
            && this.try_name(this.state.FirstName)
            ) {
                var data = new FormData();
                data.append('Login', this.state.Login);
                data.append('Password', this.state.Password);
                data.append('Email', this.state.Email);
                data.append('ConfirmedPassword', this.state.PasswordConfirm);
                data.append('LastName', this.state.LastName);
                data.append('FirstName', this.state.FirstName);

                axios({
                    url: tmp_url.api_url + '/signup',

                    method: 'post', 

                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },

                    data: data,

                    responseType: 'json', 

                }).then(response => {

                    if (response.data.ValidPassword && !response.data.EmailExist) {
                        this.props.history.replace('/');
                    } else if (response.data.EmailExist){
                        window.Materialize.toast('Email alredy exists!', 2000, 'red rounded');
                    } else {
                        window.Materialize.toast('No special chars!', 2000, 'red rounded');
                    }

                }).catch(errors => {
                });
        }
    }

    handleFirstName(event) {
        let tmp = event.target.value;
        if (tmp[tmp.length - 1] !== ' ') {
            this.setState({
                FirstName: event.target.value
            });
        } else {
            window.Materialize.toast('No white spaces!', 2000, 'red rounded');
        }
    }

    handleLastName(event) {
        let tmp = event.target.value;

       if (tmp[tmp.length - 1] !== ' ') {
            this.setState({
                LastName: event.target.value
            });
        } else {
            window.Materialize.toast('No white spaces!', 2000, 'red rounded');
        }
    }

    render() {
        return(
            <div >
            <Row>
                <div className="container ">
                        <div className="col s6 offset-s3 margeblock">
                            <div className='frame'>
                            <h4 className="col s3 m4 offset-s2 offset-m5" >Signup:</h4>
                            <Input type='text' label='First name' value={this.state.FirstName} onChange={this.handleFirstName} s={12}/>
                            <Input type='text' label='Last name' value={this.state.LastName} onChange={this.handleLastName} s={12}/>
                            <Input type='text' label='Login' value={this.state.Login} onChange={this.handleLoginChange} s={12}/>
                            <Input type='text' label='Email' value={this.state.Email} onChange={this.handleEmailChange} s={12}/>
                            <Input type='password' label='Password' value={this.state.Password} onChange={this.handlePasswordChange} s={12}/>
                            <Input type='password' label='Password Confirm' value={this.state.PasswordConfirm} onChange={this.handlePasswordConfirmChange} s={12}/>
                            <Button waves='light' className="col s10 m4 offset-s1 offset-m4 button" onClick={this.handleRegistration}>Submit</Button>
                            </div>
                        </div>
                        <div className="col s4 offset-s5 link">
                            <Link to="/signin">Signin</Link>
                        </div>
                </div>
            </Row>
            </div>
        );
    };
}

export default Signup