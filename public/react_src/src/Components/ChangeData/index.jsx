import React from 'react';
import axios from 'axios';

import {Input, Button, Row} from 'react-materialize';
import Geocode from "react-geocode";
import AuthService from '../Auth/AuthService';


var tmp_url = require('../../config/conf.jsx');


class ChangeData extends React.Component{

	constructor(props) {
		super(props);

		this.state = {
            toLoad: '',
            Login: '',
            Email: '',
			FirstName: '',
			LastName: '',
			City: '',
			Country: '',
			Adress: '',
			Preferences: '',
			Age: '',
			Bio: '',
            Tags: '',
			Gender: 'Male',
			Sexpref: 'Heterosexual',
            current: []
		}
		this.Auth = new AuthService();
		this.prepareForm = this.prepareForm.bind(this);
		this.submitForm = this.submitForm.bind(this);
		this.choseGender = this.choseGender.bind(this);
		this.chosePrefer = this.chosePrefer.bind(this);
		this.changeAge = this.changeAge.bind(this);
		this.changeName = this.changeName.bind(this);
		this.changeLastName = this.changeLastName.bind(this);
		this.changeCity = this.changeCity.bind(this);
		this.changeCountry = this.changeCountry.bind(this);
		this.changeAdress = this.changeAdress.bind(this);
		this.changeBio = this.changeBio.bind(this);
        this.changeTags = this.changeTags.bind(this);
		this.changePreferences = this.changePreferences.bind(this);
	}

    componentDidMount() {
        this.st = true;
    	let tmp = this.Auth.getToken();
            const data = new FormData();
            data.append('token', tmp);
            axios({
                url: tmp_url.api_url + '/users/' + tmp,

                method: 'post',

                headers: {
                   'Content-Type': 'multipart/form-data',
                },

                 data: data,

                 responseType: 'json',

            }).then(response => {
                    if (this.st) {
    	                this.setState({
    	                	current: response.data
    	                })
                    }
            }).catch(errors => {
 
            });
    }

    componentWillUnmount(){
        this.st = false;
    }

	submitForm(data) {
        axios({
            url: tmp_url.api_url + '/users/update/' + this.Auth.getToken(),

            method: 'post',

            headers: {
                'Content-Type': 'multipart/form-data',
            },

            data: data,

            responseType: 'json',

        }).then(response => {
                this.Auth.setExtend('1');
            this.props.history.replace('/');
           
        }).catch(errors => {
        });
        
	}

    precheckTags = () => {
        let tmpEv = this.state.Tags;
        let tmpTest = tmpEv.split(' ');
        let test = 0;
        if (this.state.Tags === '') {
            return true;
        }
        for (let i = 0; i < tmpTest.length; i++) {
            if (tmpTest[i][0] === '#') {

                test += 1;
            }
        }
        if (test === tmpTest.length ) {
            return true;
        } else {
           window.Materialize.toast('Start whith #', 2000, 'red rounded');
       }
       return false;
    }

	prepareForm() {
        const data = new FormData();
        let tmp = this.state.Gender;

       
            tmp = tmp.toLowerCase();
            if (this.precheckTags() ) {
                data.append('Token', this.Auth.getToken());
                if (this.state.FirstName === '') {
                	data.append('FirstName', this.state.current.FirstName);
                } else {
                	data.append('FirstName', this.state.FirstName);
                }
                if (this.state.Login === '') {
                	data.append('Login', this.state.current.Login);
                } else {
                	data.append('Login', this.state.Login);
                }
               	if (this.state.Email === '') {
                	data.append('Email', this.state.current.Email);
                } else {
                	data.append('Email', this.state.Email);
                }
                if (this.state.LastName === '') {
                	 data.append('LastName', this.state.current.LastName);
                } else {
                	data.append('LastName', this.state.LastName);
                }
                if (this.state.Age === '') {
                	data.append('Age', this.state.current.Age);
                } else {
                	data.append('Age', this.state.Age);
                }
                if (this.state.Preferences === '') {
                	data.append('Preferences', this.state.current.Preferences);
                } else {
                	data.append('Preferences', this.state.Preferences);
                }
                if (this.state.Bio === '') {
                	data.append('Bio', this.state.current.Bio);
                } else {
                	data.append('Bio', this.state.Bio);
                }

               	if (this.state.Gender === 'Male') {
                	data.append('Gender', this.state.current.Gender);
                } else {
                	data.append('Gender', this.state.Gender);
                }

                data.append('Gender', tmp);
                data.append('Tags', this.state.Tags);
                data.append('Sexpref', this.state.Sexpref);

        		
                if (this.state.City === '' && this.state.Country === '' && this.state.Adress === '') {
                    data.append('Country', this.state.current.Country);
                    data.append('City', this.state.current.City);
                    data.append('lat', this.state.current.map_width);
                    data.append('lng', this.state.current.map_height);
                	this.submitForm(data);

                } else {
                	const fAdd = this.state.Country + ' ' + this.state.City + ' ' + this.state.Adress;
                	
                	Geocode.setApiKey("AIzaSyAZui479HQ-RvwHw2DgzKj585znt0i5iL4");
                	Geocode.fromAddress(fAdd)
                	.then(response => {
                	
                		if (this.state.Country !== '') {
                			data.append('Country', this.state.Country);
                		} else {
                            data.append('Country', 'default');
                        }
                		if (this.state.City !== '') {
                			data.append('City', this.state.City);
                		} else {
                            data.append('City', 'default');
                        }
                		data.append('lat', response.results[0].geometry.location.lat);
                		data.append('lng', response.results[0].geometry.location.lng);

                		this.submitForm(data);
                	}).catch(errors => {
                		window.Materialize.toast('Incorect Adress', 2000, 'red rounded');
                	});
                }
            }
    }



    choseGender = (event) => {
    	this.setState ({
    		Gender: event.target.value
    	});
    }

   chosePrefer = (event) => {
    	this.setState ({
    		Sexpref: event.target.value
    	});
    }

        changeAge = (event) => {
        let isnum = /^\d+$/.test(event.target.value);
        let tmp = event.target.value
        let age = parseInt(tmp, 10);

        if ((isnum && age < 110) || event.target.value === '') {
            this.setState ({
                Age: event.target.value
            });

        } else if (!isnum) {
            window.Materialize.toast('Numbers only!', 2000, 'red rounded');
        } else {
             let rAge = tmp + ' really!';
             window.Materialize.toast(rAge, 2000, 'red rounded');
        }
    }

    changeName = (event) => {
        let tmp = event.target.value;
        if (tmp[tmp.length - 1] !== ' ') {
    	this.setState ({
    		FirstName: event.target.value
    	});
        } else {
            window.Materialize.toast('No white spaces!', 2000, 'red rounded');
        }
    }

    changeLastName = (event) => {
         let tmp = event.target.value;
        if (tmp[tmp.length - 1] !== ' ') {
    	this.setState ({
    		LastName: event.target.value
    	});
        } else {
            window.Materialize.toast('No white spaces!', 2000, 'red rounded');
        }

    }

    changeCity = (event) => {
    	this.setState ({
    		City: event.target.value
    	});

    }

    changeCountry = (event) => {
    	this.setState ({
    		Country: event.target.value
    	});

    }

    changeAdress = (event) => {
    	this.setState ({
    		Adress: event.target.value
    	});

    }

    changePreferences = (event) => {
    	this.setState ({
    		Preferences: event.target.value
    	});

    }

    changeBio = (event) => {
    	this.setState ({
    		Bio: event.target.value
    	});

    }

    changeTags = (event) => {
        this.setState ({
            Tags: event.target.value
        })
    }

    changeLogin = (event) => {
        let tmp = event.target.value;
        if (tmp[tmp.length - 1] !== ' ') {
    	this.setState({
    		Login: event.target.value
    	})
        } else {
            window.Materialize.toast('No white spaces!', 2000, 'red rounded');
        }
    }

   changeEmail = (event) => {
    let tmp = event.target.value;
        if (tmp[tmp.length - 1] !== ' ') {
    	this.setState({
    		Email: event.target.value
    	})
        } else {
            window.Materialize.toast('No white spaces!', 2000, 'red rounded');
        }
    }



    tmplogin = () => {
        if (this.state.Login) {
            return (
                <div>
                <Input  type="tel" label="Login" value={this.state.Login} onChange={this.changeLogin} s={12} />
                </div>
                );
        }
        return null;
    }

    render() {
        if (!this.state.toLoad) {
    	return(
    		<div className="container">
    		<Row>
                <h4 className="col s3 m6 offset-s2 offset-m4">ChangeData:</h4>
                <Input  type="tel" label="Login" value={this.state.Login} onChange={this.changeLogin} s={12} />
                <Input  type="tel" label="Email" value={this.state.Email} onChange={this.changeEmail} s={12} />
                <Input  type="tel" label="First name" value={this.state.FirstName} onChange={this.changeName}  s={12} />
                <Input  type="tel" label="Last name" value={this.state.LastName} onChange={this.changeLastName} s={12} />
                <Input  type="tel" label="Preferences" value={this.state.Preferences} onChange={this.changePreferences} s={12} />
                <Input  type="tel" label="Tags" value={this.state.Tags} onChange={this.changeTags} s={12} />
                <Input  type="tel" label="Age" value={this.state.Age} onChange={this.changeAge} s={12} />
                <Input  type="tel" label="Country" value={this.state.Country} onChange={this.changeCountry} s={12} />
                <Input  type="tel" label="City" value={this.state.City} onChange={this.changeCity} s={12} />
                <Input  type="text" label="Adress" value={this.state.Adress} onChange={this.changeAdress} s={12} />
                <Input type="textarea" label="Biography:" value={this.state.Bio} onChange={this.changeBio} s={12}/>
                <div className="col s12 ">
                	<Row>
    					<Input s={12} type='select' label='Select your Gender:' onChange={this.choseGender} defaultValue={this.state.Gender}>
      						<option value='Male'>Male</option>
      						<option value='Female'>Female</option>
    					</Input>
  					</Row>
  					<Row>
    					<Input s={12} type='select' label='Select your gnder:' onChange={this.chosePrefer} defaultValue={this.state.Sexpref}>
      						<option value='Heterosexual'>Heterosexual</option>
      						<option value='Homosexual'>Homosexual</option>
      						<option value='Bisexual'>Bisexual</option>
    					</Input>
  					</Row>
  				</div>

                <Button waves='light' className="col s8 m4 offset-s2 offset-m3"  onClick={this.prepareForm}>Submit</Button>
            </Row>
    		</div>
    	);
        } else {
            return null;
        }
    }
}

export default ChangeData
