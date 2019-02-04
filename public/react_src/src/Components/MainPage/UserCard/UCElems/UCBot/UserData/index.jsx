import React from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import MyMap from '../../../../../MyMap';
import {Button, Row,  Input, Chip}  from 'react-materialize';

import './style.css';

const style = {
  width: '25%',
  height: '25%',
  marginLeft: '10%'
}

var tmp_url = require('../../../../../../config/conf.jsx');

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    marginRight           : '-50%',
    height                : '80%',
    transform             : 'translate(-50%, -50%)'
  }
};

class UserData extends React.Component {
 constructor() {
    super();

    this.state = {
      modalIsOpen: false,
      status: false,
      data: ''
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  afterOpenModal() {
    this.subtitle.style.color = '#f00';
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  componentWillMount() {
    Modal.setAppElement('body');
  }

  returnelem = () => {
    if (this.props.status) {
      return <p>UserOnline</p>;
    }
    return <p>{this.props.time}</p>;
  }

  likecheck = () => {
    if (this.props.liked) {
      return (
        <div>
          <Chip className='green' waves='light'>'You like this yser)'</Chip>
          </div>
        );
    }
  }

  sendreport = () => {
       const data1 = new FormData();

                  data1.append('reportedToken', this.props.uid.token);
                  data1.append('reporterToken', this.props.cuidt);
            axios({
                  url: tmp_url.api_url + '/report/fake',
                  method: 'post',
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                  data: data1,

                  responseType: 'json',
                }).then(response => {
                }).catch(errors => {
     
          });
  }

  render() {
    let {
      uid,
    } = this.props

    let tmp = [];


      if(uid.photos.length) {
        for (let i = 0; i < uid.photos.length; i++) {
            if(uid.photos[i].url.search('https://')) {
              tmp.push(tmp_url.api_url + '/' + uid.photos[i].url);
            } else {
              tmp.push(uid.photos[i].url);
            }
        }
      }
      if (tmp.length === 0 && uid.Avatar !== null) {
        if (uid.Avatar.search('https://')) {
            tmp.push(tmp_url.api_url + '/' + uid.Avatar);
        }
        tmp.push(uid.Avatar);
      }

    return (
      <div>
        
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
          
        >
        <Row>
          <h2 ref={subtitle => this.subtitle = subtitle}>{uid.FirstName} {uid.LastName}</h2>
            <Row>           
                {tmp.map(function(elem) {
                  return <img key={elem} src={elem} alt='' style={style}/>;
                })}
            </Row>
            {this.returnelem()}
            {this.likecheck()}
            <Button className='red' waves='light'  onClick={this.sendreport}>Report</Button>
            <h2 >First name:</h2>
            <Input  type="tel" className="validate" defaultValue={uid.FirstName} disabled  s={12}/>
            <h2>Last name:</h2>
            <Input  type="tel"  defaultValue={uid.LastName} disabled s={12}/>
            <h2>Preferences:</h2>
            <Input  type="tel"  defaultValue={uid.Preferences} disabled s={12}/>
            <h2>Tags:</h2>
            {uid.Tags.map(function(element, i){
              return <Chip key={element.tag}>{element.tag}</Chip>;
            })}
            <h2>Age:</h2>
            <Input  type="tel"  defaultValue={uid.Age} disabled s={12}/>
            <h2>Biography:</h2>
            <Input type="textarea" defaultValue={uid.Bio} disabled s={12}/>

          </Row>
         <MyMap lat={uid.map_width} lng={uid.map_height}/>
        </Modal>

      </div>
    );
  }
}

export default UserData;