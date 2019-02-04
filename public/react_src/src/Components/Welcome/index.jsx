import React from "react";
import ExtendData from '../ExtendData';
import axios from 'axios';
import withAuth from '../Auth/withAuth';
import NavbarMy from '../Navbar';
import FooterMy from '../Footer';
import AuthService from '../Auth/AuthService';
import MainPage from '../MainPage';
import Users from '../Users';
import ChangeData from '../ChangeData';
var tmp_url = require('../../config/conf.jsx');



class Welcome extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            users: "",
            Bs: ""
        };
        this.Auth = new AuthService();

    }


    getnotif = () => {
        const data = new FormData();

        data.append('token', this.Auth.getToken());
        axios({
            url: tmp_url.api_url + '/notification/check',

            method: 'post',

            headers: {
                'Content-Type': 'multipart/form-data',
            },

            data: data,

            responseType: 'json',

        }).then(response => {

            if (response.data.notification) {


                let times = response.data.message.length;
                let counter = 0;
                let interval = setInterval(function(){

                    window.Materialize.toast(response.data.message[counter].Type, 2000, 'red rounded');
                    counter++;
                    if (counter === times) {
                        clearInterval(interval);
                    }
                }, 700);
          }
        }).catch(errors => {

        });
    }


    componentDidMount() {
        this.interval = setInterval(this.getnotif, 4000);


    this.interval = setInterval(this.getnotif, 4000);
    const data = new FormData();
    data.append('token', this.Auth.getToken());
    
    axios({
            url: tmp_url.api_url + '/signin/user/logged',

            method: 'post',

            headers: {
                'Content-Type': 'multipart/form-data',
            },

            data: data,

            responseType: 'json',

        }).then(response => {
        
            if(response.data.is_reg === false || response.data.is_reg === '0') {
                if(response.data.token === false || response.data.token === '0') {
                    this.Auth.logout();
                    this.props.history.replace('/Signin');
                }
                this.props.history.replace('/extendreg');
            }
        }).catch(errors => {

        });
}

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    tldr = () => {

        if (parseInt(this.Auth.isReg(), 10) === 0) {
                return <ExtendData history={this.props.history} user={this.state.user}/>;
            } else if(this.props.history.location.search && this.Auth.loggedIn()) {
                    let tmp = this.props.history.location.search.split('=');
                    if (tmp[1] === 'user') {
                        return (    <div >
                                        <NavbarMy/>
                                            <div >
                                            <Users history={this.props.history} user={this.state.user}/>
                                            </div>
                                        <FooterMy/>
                                    </div>
                        );
                    } else if (tmp[1] === 'changeData') {
                             return (           <div >
                                        <NavbarMy/>
                                            <div >
                                            <ChangeData history={this.props.history} user={this.state.user}/>
                                            </div>
                                        <FooterMy/>
                                    </div>
                                    );
                    }
            } else if(this.Auth.loggedIn()) {
            return (            <div >
                            <NavbarMy/>
                            <div >
                                <MainPage history={this.props.history} user={this.state.user}/>
                            </div>
                            <FooterMy/>

                    </div>
                );
            }
    }


    render()
    {

        return(
                <div >
                              
                {this.tldr()}
                </div>
        )
    }
}

export default withAuth(Welcome);
