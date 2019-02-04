import React from 'react';
import axios from 'axios';
import {Input, Button, Icon, Row} from 'react-materialize';
import Geocode from "react-geocode";
import AuthService from '../Auth/AuthService';
import MyCarousel from '../MyCarousel/';

var tmp_url = require('../../config/conf.jsx');


class ExtendData extends React.Component{

	constructor(props) {
		super(props);

		this.state = {
            toLoad: '',
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
			Pics: [],
			PicsURL: []
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

    componentWillMount() {

console.log(tmp_url.api_url + '/users/checkUReg');
       // if (!this.Auth.getToken()) {
            const data = new FormData();
console.log(this.Auth.getToken());
            data.append('token', this.Auth.getToken());
            axios({
                url: tmp_url.api_url + '/users/checkUReg',

                method: 'post',

                headers: {
                   'Content-Type': 'multipart/form-data',
                },

                 data: data,

                 responseType: 'json',

            }).then(response => {
                    console.log(response.data.Extend_Registration);
                if (parseInt(response.data.Extend_Registration) === 1){
                    this.props.history.replace('/');
                } else {
                    this.setState({
                        toLoad: null
                    });
                }
           
            }).catch(errors => {
           // console.log(errors);
            });
       // }
    }

	submitForm(data) {
        console.log(data);
        axios({
            url: tmp_url.api_url + '/profile/create',

            method: 'post',

            headers: {
                'Content-Type': 'multipart/form-data',
            },

            data: data,

            responseType: 'json',

        }).then(response => {
            console.log(response);

                
          
            //this.props.history.replace('/');
           
        }).catch(errors => {
           // console.log(errors);
        });
        
	}

	prepareForm() {
        const data = new FormData();
        data.append('Token', this.Auth.getToken());
        data.append('FirstName', this.state.FirstName);
        data.append('LastName', this.state.LastName);
        data.append('Age', this.state.Age);
        data.append('Preferences', this.state.Preferences);
        data.append('Bio', this.state.Bio);
        data.append('Gender', this.state.Gender);
        data.append('Tags', this.state.Tags);
        data.append('Sexpref', this.state.Sexpref);
       if (this.state.Pics.length > 0) {
        	this.state.Pics.forEach((currentValue, index) => {
        		data.append('Pics' + index, currentValue);
        	});
        }
		
        if (this.state.City === '' && this.state.Country === '' && this.state.Adress === '') {
             axios.get('https://api.ipify.org?format=json')
                  .then( response => {
                    let reqest = 'http://ip-api.com/json/' + response.data.ip;
                    axios.get(reqest)
                    .then(response => {
                    	data.append('City', response.data.city);
        				data.append('Country', response.data.country);
        				data.append('lat', response.data.lat);
        				data.append('lng', response.data.lon);

        				this.submitForm(data);
                    })
                    .catch( errors => {
                    	window.Materialize.toast('Geolocation faild', 2000, 'red rounded');
                    });
            }).catch(errors => {
        		window.Materialize.toast('Geolocation faild', 2000, 'red rounded');
        	});
        } else {
        	const fAdd = this.state.Country + ' ' + this.state.City + ' ' + this.state.Adress;
        	
        	Geocode.setApiKey("AIzaSyAZui479HQ-RvwHw2DgzKj585znt0i5iL4");
        	Geocode.fromAddress(fAdd)
        	.then(response => {
        	
        		if (this.state.Country !== '') {
        			data.append('Country', this.state.Country);
        		}
        		if (this.state.City !== '') {
        			data.append('City', this.state.City);
        		}
        		data.append('lat', response.results[0].geometry.location.lat);
        		data.append('lng', response.results[0].geometry.location.lng);

        		this.submitForm(data);
        	}).catch(errors => {
        		window.Materialize.toast('Incorect Adress', 2000, 'red rounded');
        	});
        }
    }



    choseGender(event) {
    	this.setState ({
    		Gender: event.target.value
    	});
    	console.log(this.state.Gender);
    }

   chosePrefer(event) {
    	this.setState ({
    		Sexpref: event.target.value
    	});
    	console.log(this.state.Sexpref);
    }

    changeAge(event) {
    	let isnum = /^\d+$/.test(event.target.value);

    	if (isnum || event.target.value === '') {
    		this.setState ({
    			Age: event.target.value
    		});

   	 	} else {
   	 		window.Materialize.toast('I am a toast!', 2000, 'blue rounded');

   	 	}
    }

    changeName(event) {
    	this.setState ({
    		FirstName: event.target.value
    	});
    }

    changeLastName(event) {
    	this.setState ({
    		LastName: event.target.value
    	});
    }

    changeCity(event) {
    	this.setState ({
    		City: event.target.value
    	});
    }

    changeCountry(event) {
    	this.setState ({
    		Country: event.target.value
    	});
    }

    changeAdress(event) {
    	this.setState ({
    		Adress: event.target.value
    	});
    }

    changePreferences(event) {
    	this.setState ({
    		Preferences: event.target.value
    	});
    }

    changeBio(event) {
    	this.setState ({
    		Bio: event.target.value
    	})
    }

    changeTags(event) {
        console.log(this.state.Tags);
        this.setState ({
            Tags: event.target.value
        })
    }

    fileHendler = event => {
    	let tmp = this.state.Pics;
    	let tempURL = this.state.PicsURL;
    	let file = event.target.files[0];
    	let reader = new FileReader();
    	if (file) {
        	reader.readAsDataURL(file);

        	reader.onload = (e) => {
    			if (tmp.length < 5) {
    				tmp.push(e.target.result);
    				tempURL.push(URL.createObjectURL(file));
    			} else {
    				for (let i = 1; i < tmp.length; i++) {
    					tmp[i - 1] = tmp[i];
    					tempURL[i - 1] = tempURL[i];
    				}
    				tmp[4] = e.target.result;
    				tempURL[4] = URL.createObjectURL(file);
    			}
    			this.setState ({
    				Pics: tmp,
    				PicsURL: tempURL
    			});
    		}
    	}
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
        if (!this.state.toLoad) {
    	return(
    		<div className="container">
    		<Row>
                <h4 className="col s3 m4 offset-s2 offset-m4">#######:</h4>
                {this.picDisplay()}
                <input 
                	style={{display: 'none'}} 
                	type="file"
                	accept="image/*"
                	onChange={this.fileHendler}
                	ref={fileInput => this.fileInput = fileInput}
                />
                <Button 
                	waves='light' 
                	className="col s8 m4 offset-s2 offset-m3"  
                	onClick={ () => this.fileInput.click()}
                	>Pick File<Icon right>send</Icon>
                </Button>
                <Input  type="tel" className="validate" label="First name" value={this.state.FirstName} onChange={this.changeName}  s={12} />
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
    					<Input s={12} type='select' label='Select your Gender:' onChange={this.choseGender} defaultValue='Male'>
      						<option value='Male'>Male</option>
      						<option value='Female'>Female</option>
    					</Input>
  					</Row>
  					<Row>
    					<Input s={12} type='select' label='Select your gnder:' onChange={this.chosePrefer} defaultValue='Heterosexual'>
      						<option value='Heterosexual'>Heterosexual</option>
      						<option value='Homosexual'>Homosexual</option>
      						<option value='Bisexual'>Bisexual</option>
    					</Input>
  					</Row>
  				</div>

                <Button waves='light' className="col s8 m4 offset-s2 offset-m3"  onClick={this.prepareForm}>Submit<Icon right>send</Icon></Button>
            </Row>
    		</div>
    	);
        } else {
            return null;
        }
    }
}

export default ExtendData
