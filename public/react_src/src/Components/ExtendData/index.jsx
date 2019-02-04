import React from 'react';
import axios from 'axios';
import {Input, Button, Icon, Row} from 'react-materialize';
import Geocode from "react-geocode";
import AuthService from '../Auth/AuthService';
import MyCarousel from '../MyCarousel/';



var tmp_url = require('../../config/conf.jsx');
var ip_api = '?access_key=6d0e94f778374b1b428d920705a90adc';

class ExtendData extends React.Component{

	constructor(props) {
		super(props);

		this.state = {
            toLoad: false,
			City: '',
			Country: '',
			Adress: '',
			Preferences: '',
			Age: '',
			Bio: '',
            Tags: '',
			Gender: 'Male',
			Sexpref: 'Bisexual',
			Pics: [],
			PicsURL: [],

		}
		this.Auth = new AuthService();
		this.prepareForm = this.prepareForm.bind(this);
		this.submitForm = this.submitForm.bind(this);
		this.choseGender = this.choseGender.bind(this);
		this.chosePrefer = this.chosePrefer.bind(this);
		this.changeAge = this.changeAge.bind(this);
		this.changeCity = this.changeCity.bind(this);
		this.changeCountry = this.changeCountry.bind(this);
		this.changeAdress = this.changeAdress.bind(this);
		this.changeBio = this.changeBio.bind(this);
        this.changeTags = this.changeTags.bind(this);
		this.changePreferences = this.changePreferences.bind(this);
	}
    /**/
    componentDidMount() {
        this.tempCheck = true;
        if (this.Auth.getToken()) {

            const data = new FormData();

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
                if (parseInt(response.data.Extend_Registration, 10) === 1){
                    this.Auth.setExtend('1');
                    this.props.history.replace('/');
                } else {
                    if(this.tempCheck) {
                        this.setState({
                            toLoad: true
                        });
                    }
                }
            }).catch(errors => {
            });
        } else {
            if (!this.Auth.getToken()) {

                this.props.history.replace('/');
            }
        }
    }





    componentWillUnmount() {
        this.tempCheck = false;
    }

	submitForm(data) {
        axios({
            url: tmp_url.api_url + '/profile/create',

            method: 'post',

            headers: {
                'Content-Type': 'multipart/form-data',
            },

            data: data,

            responseType: 'json',

        }).then(response => {

            if (!response.data.Bio) {
                window.Materialize.toast('No bio try again', 5000, 'red rounded');
            }
            if (!response.data.Age) {
                window.Materialize.toast('No age try again', 5000, 'red rounded');
            }
            if (!response.data.City) {
                window.Materialize.toast('No age try again', 5000, 'red rounded');
            }
            if (!response.data.Preferences) {
                window.Materialize.toast('No Preferences try again', 5000, 'red rounded');
            }
            if (!response.data.Tags) {
                window.Materialize.toast('No Tags try again', 5000, 'red rounded');
            }
            if (response.data.Complete)
                this.Auth.setExtend('1');
            this.props.history.replace('/');
           
        }).catch(errors => {

        });
        
	}

	prepareForm() {
        if (this.precheckTags()) {
            const data = new FormData();
            let tmp = this.state.Gender;


            tmp = tmp.toLowerCase();
            data.append('Token', this.Auth.getToken());
            data.append('Age', this.state.Age);
            data.append('Preferences', this.state.Preferences);
            data.append('Bio', this.state.Bio);
            data.append('Gender', tmp);
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

                        let reqest = 'http://api.ipstack.com/' + response.data.ip + ip_api;
                        axios.get(reqest)
                        .then(response => {
                        	data.append('City', response.data.city);
            				data.append('Country', response.data.country_name);
            				data.append('lng', response.data.latitude);
            				data.append('lat', response.data.longitude);
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
            		} else {
                        data.append('Country', 'default');
                    }
            		if (this.state.City !== '') {
            			data.append('City', this.state.City);
            		} else {
                        data.append('City', 'default');
                    }
            		data.append('lng', response.results[0].geometry.location.lat);
            		data.append('lat', response.results[0].geometry.location.lng);

            		this.submitForm(data);
            	}).catch(errors => {
            		window.Materialize.toast('Incorect Adress', 2000, 'red rounded');
            	});
            }
        }
    }



    choseGender(event) {
    	this.setState ({
    		Gender: event.target.value
    	});

    }

   chosePrefer(event) {
    	this.setState ({
    		Sexpref: event.target.value
    	});
    }

    changeAge(event) {
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
        let tmp = event.target.value;
        if (tmp.length < 100) {
        	this.setState ({
        		Preferences: event.target.value
        	});
        } else {
            window.Materialize.toast('Preferences to long!', 2000, 'red rounded');
        }
    }

    changeBio(event) {
    let tmp = event.target.value;
    if (tmp.length < 100) {
    	this.setState ({
    		Bio: event.target.value
    	})
    }else {
            window.Materialize.toast('Biography to long!', 2000, 'red rounded');
        }
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

    changeTags(event) {
            this.setState ({
                Tags: event.target.value
            })
       // } else {
        //    window.Materialize.toast('Start whith #', 2000, 'red rounded');
       // }
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
    					<MyCarousel data={this.state.PicsURL} style={{width: '100%', height: '100%'}}/>
    				</div>
    			</Row>
    			);
    	}
    }

    render() {
        if (this.state.toLoad) {
    	return(
            <div >
    		<div className="container">
    		<Row>
                <h4 className="col s3 m6 offset-s2 offset-m4">ExtendReg:</h4>
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
    					<Input s={12} type='select' label='Select your gnder:' onChange={this.chosePrefer} defaultValue='Bisexual'>
      						<option value='Heterosexual'>Heterosexual</option>
      						<option value='Homosexual'>Homosexual</option>
      						<option value='Bisexual'>Bisexual</option>
    					</Input>
  					</Row>
  				</div>

                <Button waves='light' className="col s8 m4 offset-s2 offset-m3"  onClick={this.prepareForm}>Submit<Icon right>send</Icon></Button>
                                <a href='/logout' className="col s8 m4 offset-s2 offset-m3">Or Logout</a>
            </Row>
    		</div>
            </div>
    	);
        } else {
            return null;
        }
    }
}

export default ExtendData
