import React from 'react';
import axios from 'axios';


import UserData from './UserData';
import {Button,  Icon}  from 'react-materialize';
import './styles.css';



var tmp_url = require('../../../../../config/conf.jsx');

class UCBot extends React.Component{

  constructor() {
    super();

    this.state = {
      modalIsOpen: false,
      liked_by: false,
      liked: false,
      status: false,
      data: ''

    };


    this.accessModel = this.accessModel.bind(this);
  }

  accessModel() {
    this.refs.child.openModal();
    const data = new FormData();

      data.append('token', this.props.uid.token);
     axios({
                url: tmp_url.api_url + '/notification/online',

                method: 'post',

                headers: {
                   'Content-Type': 'multipart/form-data',
                },

                 data: data,

                 responseType: 'json',

            }).then(response => {
                  this.setState({
                    status: response.data.status,
                    data: response.data.date
                  });
                  const data1 = new FormData();

                  data1.append('token', this.props.uid.token);
                  axios({
                    url: tmp_url.api_url + '/popularity/add',

                      method: 'post',

                      headers: {
                        'Content-Type': 'multipart/form-data',
                    },

                    data: data1,

                    responseType: 'json',

                  }).then(response => {
                      const data2 = new FormData();

                      data2.append('viewedToken', this.props.uid.token);
                      data2.append('viewerToken', this.props.cuid.token);
                  axios({
                    url: tmp_url.api_url + '/history/addVisits',

                      method: 'post',

                      headers: {
                        'Content-Type': 'multipart/form-data',
                    },

                    data: data2,

                    responseType: 'json',

                  }).then(response => {
                    const data3 = new FormData();
                    data3.append('targetToken', this.props.uid.token);
                    data3.append('sourceToken', this.props.cuid.token);
                    let tmp2 = 'You hes been visited by ' + this.props.cuid.FirstName + ' ' + this.props.cuid.LastName;
                    data3.append('Type', tmp2);
                axios({
                    url: tmp_url.api_url + '/notification/add',

                    method: 'post',

                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },

                    data: data3,

                    responseType: 'json',

              }).then(response => {

              });
                  }).catch(errors =>{});


                  }).catch(errors => {

                  });
            }).catch(errors => {

            });

  }

  componentDidMount() {
            this.load = true;
            const data = new FormData();

            data.append('targetToken', this.props.cuid.token);
            data.append('sourceToken', this.props.uid.token);
            axios({
                url: tmp_url.api_url + '/like/is_liked',

                method: 'post',

                headers: {
                   'Content-Type': 'multipart/form-data',
                },

                 data: data,

                 responseType: 'json',

            }).then(response => {
              if (this.load) {
                  this.setState({
                    liked: response.data.liked
                  });
                }
                const data1 = new FormData();
                data1.append('sourceToken', this.props.cuid.token);
                data1.append('targetToken', this.props.uid.token);
                axios({
                url: tmp_url.api_url + '/like/is_liked',

                method: 'post',

                headers: {
                   'Content-Type': 'multipart/form-data',
                },

                 data: data1,

                 responseType: 'json',

            }).then(response => {
              if(this.load) {
                this.setState({
                  liked_by: response.data.liked
                });
              }
            }).catch(errors => {

            })
            }).catch(errors => {

            });
  }

  componentWillUnmount(){
      this.load = false;
  }

  toblock = () => {
    this.props.blockCall(this.props.uid.token);
    this.props.hide();
  }

  vraplikes = () => {
      if ( this.props.cuid.Avatar !== null) {
        if (this.state.liked) {
          return (
                  <Button floating large className='red boutline toback' waves='light' onClick={this.tolike} >
                      <Icon className="icon-marge">loyalty</Icon>
                    </Button>
                  );
        }
        return (
                    <Button floating large className='boutline toback' waves='light' onClick={this.tolike} >
                      <Icon className="icon-marge">loyalty</Icon>
                    </Button>
          );
    }
  }

  vrapchat = () => {
    if (this.state.liked && this.state.liked_by) {
        return (
              <Button floating large className='boutline toback' waves='light' onClick={this.chatColl1}>
                <Icon className="icon-marge">chat</Icon>
              </Button>
          );
    }
    return null;
  }

  tolike = () => {
    this.props.likeCall(this.props.uid.token, this.state.liked);
    if (this.state.liked) {
      this.setState({
        liked: false
      });
    } else {
      this.setState({
        liked: true
      });
    }
  }

  chatColl1 = () => {
    this.props.chatCall(this.props.uid.token);
  }


  render(){
    let{
      uid,
      cuid
    } = this.props;

    let tmp = [];
    tmp.push(uid.Avatar);

    return(

    <div className= 'ucbot-card-desc'>
   
		<Button floating large className='red boutline toback' onClick={this.toblock} waves='light' > 
		  <Icon className="icon-marge">report</Icon> 
		</Button>
      {this.vrapchat()}
    {this.vraplikes()}

  	<Button floating large className='boutline toback' cuid={cuid} waves='light' onClick={this.accessModel} >
		  <Icon className="icon-marge">face</Icon>

		</Button>
              <UserData       
                ref="child"
                uid={uid}
                cuidt={cuid.token}
                cuid={cuid}
                status={this.state.status}
                time={this.state.data}
                liked={this.state.liked_by}
      />

    </div>

      
    );
  }
}


export default UCBot;
