import React from 'react';
import axios from 'axios';
import {Collapsible, CollapsibleItem, Row, Input, Card, CardTitle, Col, Chip} from 'react-materialize';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import AuthService from '../Auth/AuthService';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
var tmp_url = require('../../config/conf.jsx');

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
const Handle = Slider.Handle;

class MainPage extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			Age: 100,
			AgeMax: 200,
			Pop: 0,
			PopMax: 500,
			Sexpref: 'Heterosexual'
		};
    this.Auth = new AuthService();
		this.updateAgeFilter = this.updateAgeFilter.bind(this);
		this.updatePopFilter = this.updatePopFilter.bind(this);
		this.handle = this.handle.bind(this);
	}



	componentDidMount(){
     if (parseInt(this.Auth.isReg()) === 0) {

       this.props.history.replace('/extendreg');
    } else  if(this.Auth.loggedIn()) {
        this.props.history.replace('/');
    }

		axios({
            url: tmp_url.api_url + '/users/all',

            method: 'post',

            headers: {
                'Content-Type': 'multipart/form-data',
            },

            responseType: 'json',

        }).then(response => {
            console.log(response.data);
            this.setState({
              AgeMax: response.data.maxAge,
              PopMax: response.data.maxPopular
            });
            
        }).catch(errors => {
            console.log(errors);
        });
	}

	updateAgeFilter(event) {
		this.setState ({
			Age: event
		});
		console.log(this.state.Age);
	}

	updatePopFilter(event) {
		this.setState ({
			Pop: event
		});
		console.log(this.state.Age);
	}

	changePreferences(event) {
    	this.setState ({
    		Sexpref: event.target.value
    	});
    }

	handle = (props) => {
  		const { value, dragging, index, ...restProps } = props;
  		return (
    		<Tooltip
      			prefixCls="rc-slider-tooltip"
      			overlay={value}
      			visible={dragging}
      			placement="top"
      			key={index}
    		>
      			<Handle value={value} {...restProps} />
    		</Tooltip>
  		);
	};

	render() {
    	return(
    		<Row>
    			<div className="container">
    				<Collapsible s={8}>
    					<CollapsibleItem header='Search' icon='filter_drama'>
    						<Row>
    							<h4>Age:</h4>
    							<Slider
    								min={16}
    								max={this.state.AgeMax}
    								defaultValue={this.state.AgeMax}
    								onChange={this.updateAgeFilter}
    								handle={this.handle}
    								s={8}
    							/>
    						</Row>
    						<Row>
    							<h4>Popularity:</h4>
    							<Slider
    								min={0}
    								max={this.state.PopMax}
    								defaultValue={this.state.PopMax}
    								onChange={this.updatePopFilter}
    								handle={this.handle}
    							/>
    						</Row>
    						<Row>
    							<Input s={12} type='select' label='Sex preferances:' onChange={this.chosePrefer} defaultValue='Heterosexual'>
      								<option value='Heterosexual'>Heterosexual</option>
      								<option value='Homosexual'>Homosexual</option>
      								<option value='Bisexual'>Bisexual</option>
    							</Input>
  							</Row>
  						</CollapsibleItem>
    				</Collapsible>
            <Row>
              <Col s={6}>
              <Card  
                header={<CardTitle  image="https://lorempixel.com/350/350/nature/2"></CardTitle>} 
                className={'pink lighten-2'}
                actions={[<a key={11} href='#'>Name</a>]}
              >
              <div>
                <Row>
                    <Chip className={'amber darken-3'}>
                    hi
                    </Chip>
                    <Chip>
                    hi
                    </Chip>
                    <Chip>
                    hi
                    </Chip>
                    <Chip>
                    hihgmggdfj,fyj,fjhk.gjk.gjl/.g
                    </Chip>
                    <Chip>
                    hi
                    </Chip>
                    <Chip>
                    hi
                    </Chip>
                    <Chip>
                    hi
                    </Chip>
                    <Chip>
                    hi
                    </Chip>
                  </Row>
                  <Row>
                    <img className={'col offset-s10'} src={require('../../img_src/female.png')} alt={''} width={"42px"} />
                  </Row>
                     
              </div>
            
               
              </Card>
              </Col>
            </Row>
    			</div>
    		</Row>
    	);
    }
}

export default MainPage
