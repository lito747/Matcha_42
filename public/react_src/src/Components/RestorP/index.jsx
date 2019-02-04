import React from 'react'
import axios from 'axios'
import {Input, Button, Row} from 'react-materialize'
import { Link } from 'react-router-dom'
import AuthService from '../Auth/AuthService'




var tmp_url = require('../../config/conf.jsx');

class RestorP extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            Password: "",
            Passwordnew: ""

        };
        this.Auth = new AuthService();
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePasswordnewChange = this.handlePasswordnewChange.bind(this);
        this.handleRegistration = this.handleRegistration.bind(this);
    }

    componentWillMount() {
        if(this.Auth.loggedIn())
            this.props.history.replace('/');

    }
    handlePasswordChange(event) {

        this.setState({
            Password: event.target.value
        });
    }
    handlePasswordnewChange(event) {

        this.setState({
            Passwordnew: event.target.value
        });
    }



    handleRegistration() {

        if (this.props.location.search) {
        let tmp = this.props.location.search.split('=');
                var data = new FormData();
        data.append('Password', this.state.Passwordnew);
        data.append('repeatPassword', this.state.Password);
        data.append('token', tmp[1]);
        axios({
            url: tmp_url.api_url + '/signin/password/new',

            method: 'post', 

            headers: {
                'Content-Type': 'multipart/form-data',
            },

            data: data,

            responseType: 'json'
        })
        .then(response => {

            if (!response.data.pass_match) {
                window.Materialize.toast('Password does not match!', 2000, 'red rounded');
            } else {

                this.props.history.replace('/');
            }
        })
        .catch(errors => {
  
        });
        }
    }

    render() {
        return(
            <div >
                <Row>
                    <div className="container block">
                        <div className="col s8 offset-s2 m6 offset-m3">
                            <h4 className="col s3 m4 offset-s4 offset-m4">Restor password:</h4>
                            <Input  type="password" label="Password" value={this.state.Password} onChange={this.handlePasswordChange} s={12} />
                            <Input  type="password" label="Password" value={this.state.Passwordnew} onChange={this.handlePasswordnewChange} s={12} />
                            <Button waves='light' className="col s10 m4 offset-s1 offset-m3"  onClick={this.handleRegistration}>Submit</Button>
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
export default RestorP