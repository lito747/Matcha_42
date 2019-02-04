import React from 'react';
import axios from 'axios';
import MyCarousel from '../MyCarousel/';
import MyMap from '../MyMap';

var tmp_url = require('../../config/conf.jsx');

class Profile extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            user: []
        }
    }

    componentDidMount() {
        axios({
            url: tmp_url.api_url + '',

            method: 'post',

            headers: {
                'Content-Type': 'multipart/form-data',
            },
            data: data,

            responseType: 'json',
        })
        .then(response => {
            this.serState({
                user: response.data
            });
        });
    }

    getName = () => {
        return this.state.name;
    }

    picDisplay = () => {
        if (this.state.Pics.length === 0) {
            return (
                <Row>
                    <div className="col  offset-s3">
                        <img  src={require('../../img_src/account.png')} alt={''}/>
                    </div>
                </Row>
                );
        } 
        else {
            return (
                <Row>
                    <div className="col s12 m4 offset-m3">
                        <MyCarousel data={this.state.PicsURL}/>
                    </div>
                </Row>
                );
        }
    }



    render() {
        return (
            <div className="container">
                <Row>
                    <h4 className="col s3 m4 offset-s2 offset-m4">{this.getName} profile:</h4>
                    {this.picDisplay()}
                    <MyMap lat={this.state.user.lat} lng={this.state.user.lng}/>
                    <h2>First name:</h2>
                    <Input  type="tel" className="validate" value={this.state.FirstName} disabled  s={12}/>
                    <h2>Last name:</h2>
                    <Input  type="tel"  value={this.state.LastName} disabled s={12}/>
                    <h2>Preferences:</h2>
                    <Input  type="tel"  value={this.state.Preferences} disabled s={12}/>
                    <h2>Tags:</h2>
                    <Input  type="tel"  value={this.state.Tags} disabled s={12}/>
                    <h2>Age:</h2>
                    <Input  type="tel"  value={this.state.Age} disabled s={12}/>
                    <h2>Biography:</h2>
                    <Input type="textarea" value={this.state.Bio} disabled s={12}/>
                </Row>
            </div>
        );
    }
}

export default Profile