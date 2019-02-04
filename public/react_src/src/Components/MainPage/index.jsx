import React from 'react';
import axios from 'axios';
import {Collapsible, CollapsibleItem, Row, Input, Button, Modal, Chip} from 'react-materialize';
import Slider from 'rc-slider';

import UserCard from './UserCard';

import './style.css';

import AuthService from '../Auth/AuthService';
import 'rc-slider/assets/index.css';

var tmp_url = require('../../config/conf.jsx');

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);


class MainPage extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
      Age: [16, 200],
      Pop: [0, 500],
      PopMax: 0,
      AgeMax: 100,
      Range: [0, 0],
      RangeMax: 100000,
      Users: [],
      toDisplay: [],
      curentUser: [],
      Usersq: 0,
      OnPage: 20,
			Sexpref: 'Heterosexual',
      sby_age: true,
      sby_dist: true,
      sby_pop: true,
      sby_Tags: true,
      room: 0,
      tegFilter: '',
      chatConnect: null,
      roomMasages: [],
      chatInput: ''
		};

    this.Auth = new AuthService();
		this.updateAgeFilter = this.updateAgeFilter.bind(this);
		this.updatePopFilter = this.updatePopFilter.bind(this);
    this.updateAgeFilter = this.updateAgeFilter.bind(this);
    this.updatePopFilter = this.updatePopFilter.bind(this);
    this.updateDisFilter = this.updateDisFilter.bind(this);
 
    this.blockCall = this.blockCall.bind(this);
	}

	componentDidMount(){

    const data = new FormData();
    data.append('token', this.Auth.getToken());
		axios({
            url: tmp_url.api_url + '/users/all',

            method: 'post',

            headers: {
                'Content-Type': 'multipart/form-data',
            },

            data: data,

            responseType: 'json',

        }).then(response => {
          const tmpAge = parseInt(response.data.maxAge, 10);
          const tmpPop = parseInt(response.data.maxPopular, 10);

          const tmpUsersq = response.data.users.length;
          let tmpUserArray = [];
          for (let i = 0; i < tmpUsersq; i++) {
            tmpUserArray[i] = response.data.users[i];
            tmpUserArray[i].is_dist = true;
            tmpUserArray[i].is_age = true;
            tmpUserArray[i].is_pop = true;
            tmpUserArray[i].tMatch = 0;
            if (tmpUserArray[i].Tags.length > response.data.user.Tags.length) {
              for (let k = 0; k < response.data.user.Tags.length; k++) {
                  if (response.data.user.Tags[k] === tmpUserArray[i].Tags[k]) {
                    tmpUserArray[i].tMatch += 1;
                  }
              }
            } else {
              for (let k = 0; k < tmpUserArray[i].Tags.length; k++) {
                  if (response.data.user.Tags[k] === tmpUserArray[i].Tags[k]) {
                    tmpUserArray[i].tMatch += 1;
                  }
              }
            }
          }
          tmpUserArray.sort(function(a,b){
            let at = parseInt(a.Popularity, 10);
            let bt = parseInt(b.Popularity, 10);
            if (at > bt) {
              return 1;
            } else if (at < bt) {
              return -1;
            }
            return 0;
          });
          tmpUserArray.sort(function(a,b){
            let at = a.range;
            let bt = b.range;
            if (at > bt) {
              return 1;
            } else if (at < bt) {
              return -1;
            }
            return 0;
          });
          tmpUserArray.sort(function(a,b){
            let at = a.tMatch;
            let bt = b.tMatch;
            if (at > bt) {
              return 1;
            } else if (at < bt) {
              return -1;
            }
            return 0;
          });
            this.setState({
              Users: tmpUserArray,
              toDisplay: tmpUserArray,
              curentUser: response.data.user,
              Usersq: tmpUsersq,
              AgeMax: tmpAge,
              Range: [0, 100000],
              Age: [16 ,tmpAge],
              Pop: [0, tmpPop],
              PopMax: tmpPop
            });

        }).catch(errors => {
        });
	}


	updateAgeFilter(value) {
    let tmp = this.state.Users;
    let tmpDis = [];
    let iter = 0;
    for (let i = 0; i < tmp.length; i++) {
        let age = parseInt(tmp[i].Age, 10);
        if (age >= value[0] && value[1] >= age) {
          tmp[i].is_age = true;
        } else {
          tmp[i].is_age = false;
        }
    }
    tmpDis = tmp.filter((task) => {
      if (task.is_pop && task.is_dist) {
            return task.is_age === true;
          }
          return false;
    });
    iter = tmpDis.length;

		this.setState ({
			Age: value,
      Users: tmp,
      Usersq: iter,
      toDisplay: tmpDis,
      OnPage: 20
		});
	}

	updatePopFilter(value) {
    let tmp = this.state.Users;
    let tmpDis = [];
    let iter = 0;
    for (let i = 0; i < tmp.length; i++) {
        let Popularity = parseInt(tmp[i].Popularity, 10);
        if (Popularity >= value[0] && value[1] >= Popularity) {
          tmp[i].is_pop = true;
          iter += 1;
        } else {
          tmp[i].is_pop = false;
        }
    }
    tmpDis = tmp.filter((task) => {
        if (task.is_age && task.is_dist) {
            return task.is_pop === true;
          }
          return false;
    });
    iter = tmpDis.length;

		this.setState ({
			Pop: value,
      Users: tmp,
      Usersq: iter,
      toDisplay: tmpDis,
      OnPage: 20
		});
	}

  updateDisFilter(value) {
    let tmp = this.state.Users;
    let tmpDis = [];
    let iter = 0;
    for (let i = 0; i < tmp.length; i++) {
        let range = tmp[i].range;
        if (range >= value[0] && value[1] >= range) {
          tmp[i].is_dist = true;
          iter += 1;
        } else {
          tmp[i].is_dist = false;
        }
    }
    tmpDis = tmp.filter((task) => {
          if (task.is_age && task.is_pop) {
            return task.is_dist === true;
          }
          return false;
    });
    iter = tmpDis.length;

    this.setState ({
      Range: value,
      Users: tmp,
      Usersq: iter,
      toDisplay: tmpDis,
      OnPage: 20
    });
  }

  tegFilter = (event) => {
    let tmp = event.target.value;
    let tmpAr = this.state.Users;
    let arSearch = tmp.split(' ');
    for (let i = 0; i < arSearch.length; i++ ) {
        for(let k = 0; k < tmpAr.length; k++ ) {
          tmpAr[k].tMatch = 0;
          for(let m = 0; m < tmpAr[k].Tags.length; m++ ) {

            if (tmpAr[k].Tags[m].tag === arSearch[i]) {

                tmpAr[k].tMatch = 1;
            }
          }
        }
    }
    let tmpDis = tmpAr.filter((task) => {
          if (task.is_age && task.is_pop && task.is_dist && (task.tMatch === 1)) {
            return task.is_dist === true;
          }
          return false;
    });
    if (tmp.length === 0) {
      tmpDis = tmpAr;
    }
    this.setState ({
      tegFilter: tmp,
      Users: tmpAr,
      toDisplay: tmpDis,
      OnPage: 20
    });
  }

  blockCall = (key) => {

            const data = new FormData();

            data.append('target', key);
            data.append('source', this.Auth.getToken())
            axios({
                url: tmp_url.api_url + '/blacklist/add',

                method: 'post',

                headers: {
                   'Content-Type': 'multipart/form-data',
                },

                 data: data,

                 responseType: 'json',

              }).then(response => {

              }).catch(errors => {
            });
          
  }

  likeCall = (key, value) => {
            const data = new FormData();
            let tmp = '';
            let tmp2 = '';
            if (!value) {
              tmp += '/like/add';
              tmp2 += 'You have been liked by ' + this.state.curentUser.FirstName + ' ' +this.state.curentUser.LastName;
            } else {
              tmp += '/like/remove';
              tmp2 += 'Liked wath removed by ' + this.state.curentUser.FirstName + ' ' + this.state.curentUser.LastName;

            }
            data.append('targetToken', key);
            data.append('sourceToken', this.Auth.getToken())
            axios({
                url: tmp_url.api_url + tmp,

                method: 'post',

                headers: {
                   'Content-Type': 'multipart/form-data',
                },

                 data: data,

                 responseType: 'json',

              }).then(response => {
                
  
                const data1 = new FormData();
                data1.append('targetToken', key);
                data1.append('sourceToken', this.Auth.getToken());
                data1.append('Type', tmp2);
                axios({
                    url: tmp_url.api_url + '/notification/add',

                    method: 'post',

                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },

                    data: data1,

                    responseType: 'json',

              }).then(response => {

              });
              }).catch(errors => {
            });
          
  }

  chatCall = (key) => {

        const data = new FormData();
        data.append('token2', key);
        data.append('token1', this.state.curentUser.token);
        if (this.state.chatConnect) {
          this.state.chatConnect.close();
          this.setState({
            chatConnect: null
          });
        }

        axios({
                url: tmp_url.api_url + '/chat/rooms/create',

                method: 'post',

                headers: {
                   'Content-Type': 'multipart/form-data',
                },

                 data: data,

                 responseType: 'json',

              
              }).then(response => {

                 this.setState({
                  room: response.data.roomID
                 });
                 const data1 = new FormData();
              data1.append('room', this.state.room);
              data1.append('token', this.state.curentUser.token);
              axios({
                url: tmp_url.api_url + '/chat/message/history',

                method: 'post',

                headers: {
                   'Content-Type': 'multipart/form-data',
                },

                 data: data1,

                 responseType: 'json',
              
              }).then(response => {

                let tmp = new WebSocket(tmp_url.vs_port);
                tmp.onopen = function(e) {};
                tmp.onmessage = (e) => {

                    const data2 = new FormData();
                    data2.append('room', this.state.room);
                    data2.append('token', this.state.curentUser.token);
                    axios({
                            url: tmp_url.api_url + '/chat/message/get',

                            method: 'post',

                            headers: {
                                 'Content-Type': 'multipart/form-data',
                              },

                            data: data1,

                            responseType: 'json',

              
                    }).then(response => {
                        let tmp = this.state.roomMasages;
                        tmp.push(response.data.message);

                        this.setState({
                          roomMasages: tmp,
                        });
                        this.setChatElem();
                    });
                };
                this.setState({
                  roomMasages: response.data.message,
                  chatConnect: tmp
                });

              }).catch(errors =>{
                console.log(errors);
              });
            })
            .catch(errors => {
            });
  }

  goToUser = () => {

    return(
      <Modal
        header='Modal Header'
        trigger={<Button>MODAL</Button>}>
        <p>Lorem ipsum dolor sit amet, . Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
      </Modal>
      );
  }

  upUsers = () => {
    let tmp = this.state.OnPage;

    tmp += 20;
    this.setState({
      OnPage: tmp
    });

  }


  setButton = () => {

    if (this.state.OnPage <= this.state.Usersq) {
      return(
              <Button  className='boutline' waves='light' onClick={this.upUsers}>
                  More...
              </Button>
            );
    }
    return(null);
  }

  sendMasage = () => {

        const data = new FormData();
        data.append('room', this.state.room);

        data.append('token', this.state.curentUser.token);
        data.append('msg', this.state.chatInput);

        axios({
                url: tmp_url.api_url + '/chat/message/send',

                method: 'post',

                headers: {
                   'Content-Type': 'multipart/form-data',
                },

                 data: data,

                 responseType: 'json',

              
              }).then(response => {

                this.state.chatConnect.send(this.state.room);
                this.setState({
                  chatInput: ''
                });
                const data1 = new FormData();
                data1.append('targetToken', response.data.receiver);
                data1.append('sourceToken', this.Auth.getToken());
                let tmp2 = 'New masage resived!';
                data1.append('Type', tmp2);
                axios({
                    url: tmp_url.api_url + '/notification/add',

                    method: 'post',

                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },

                    data: data1,

                    responseType: 'json',

              }).then(response => {

              });
            })
            .catch(errors => {
            });
      }

    chatInput = (event) => {
        this.setState ({
            chatInput: event.target.value
        })
    }

  setChatElem = () => {

      if (this.state.room !== 0) {
        return (
            <Collapsible s={8}>
              <CollapsibleItem header='Chat' icon='chat'>
              <div style={{height: '50vh', overflow: 'scroll', overflowX:'hidden'}}>
                                {this.state.roomMasages.map(function(item, i){
                  if(this.state.room === item.roomID && item.message.length > 0) {
                    return <div key={i}>
                              <Chip className='green'>{item.sender.Name} : {item.date} : {item.message}</Chip>
                            </div>;
                  }
                  return null;
                }, this)}
                </div>

              <Input  type="tel" className="validate" label="First name" value={this.state.chatInput} onChange={this.chatInput}  s={12} />
              <Button  className='boutline bor' waves='light' onClick={this.sendMasage}>
                  Send
              </Button>
                </CollapsibleItem>
            </Collapsible>
        );
      }
  }

  sortByAge = () => {
    let tmp = this.state.toDisplay;
     if (this.state.sby_age) {
      tmp.sort(function(a, b){
          let at = parseInt(a.Age, 10);
          let bt = parseInt(b.Age, 10);

          return at - bt;
      });
      this.setState({
        toDisplay: tmp,
        sby_age: false 
      });
    } else {
      tmp.sort(function(a, b){
          let at = parseInt(a.Age, 10);
          let bt = parseInt(b.Age, 10);
          return bt - at;
      });
      this.setState({
        toDisplay: tmp,
        sby_age: true 
      });
    }
  }

  sortByDist = () => {
    let tmp = this.state.toDisplay;

     if (this.state.sby_dist) {
      tmp.sort(function(a, b){
          let at = parseInt(a.range, 10);
          let bt = parseInt(b.range, 10);
          return at - bt;
      });
      this.setState({
        toDisplay: tmp,
        sby_dist: false 
      });
    } else {
      tmp.sort(function(a, b){
          let at = parseInt(a.range, 10);
          let bt = parseInt(b.range, 10);
          return bt - at;
      });
      this.setState({
        toDisplay: tmp,
        sby_dist: true 
      });
    }
  }

  sortByPoP = () => {
    let tmp = this.state.toDisplay;
     if (this.state.sby_pop) {
      tmp.sort(function(a, b){
          let at = parseInt(a.Popularity, 10);
          let bt = parseInt(b.Popularity, 10);
          return at - bt;
      });
      this.setState({
        toDisplay: tmp,
        sby_pop: false 
      });
    } else {
      tmp.sort(function(a, b){
          let at = parseInt(a.Popularity, 10);
          let bt = parseInt(b.Popularity, 10);
          return bt - at;
      });
      this.setState({
        toDisplay: tmp,
        sby_pop: true 
      });
    }
  }

  sortByTags = () => {
    let tmp = this.state.toDisplay;

     if (this.state.sby_Tags) {
      tmp.sort(function(a, b){
          let at = a.tMatch;
          let bt = b.tMatch;
          return at - bt;
      });
      this.setState({
        toDisplay: tmp,
        sby_Tags: false 
      });
    } else {
      tmp.sort(function(a, b){
          let at = a.tMatch;
          let bt = b.tMatch;
          return bt - at;
      });
      this.setState({
        toDisplay: tmp,
        sby_Tags: true 
      });
    }
  }

	render() {
    	return(
    		<Row >
    			<div className="container">
    				<Collapsible s={8}>
    					<CollapsibleItem header='Search' icon='filter_drama'>
                <Row>
                    <h4>Age:</h4>
                    <Range allowCross={false} min={16} max={this.state.AgeMax} value={this.state.Age} onChange={this.updateAgeFilter} />
                </Row>
                <Row>
                    <h4>Popularity:</h4>
                    <Range allowCross={false} max={this.state.PopMax}  value={this.state.Pop} onChange={this.updatePopFilter} />
                </Row>
                <Row>
                    <h4>Distance filter:</h4>
                    <Range allowCross={false} max={this.state.RangeMax}  value={this.state.Range} onChange={this.updateDisFilter} />
                </Row>
                <Row>
                <Input  type="tel" label="Search Tags" value={this.state.tegFilter} onChange={this.tegFilter} s={12} />
                </Row>
  						</CollapsibleItem>
    				</Collapsible>
            <Collapsible s={8}>
              <CollapsibleItem header='Sort' icon='filter_drama'>
              <Row>

                <Button  className='col s8 m4 offset-s2 offset-m3' waves='light' onClick={this.sortByAge}>
                    Sort by age
                </Button>
              </Row>
              <Row>
                <Button  className='col s8 m4 offset-s2 offset-m3' waves='light' onClick={this.sortByDist}>
                    Sort by distance
                </Button>
              </Row>
              <Row>
                <Button  className="col s8 m4 offset-s2 offset-m3" waves='light' onClick={this.sortByPoP}>
                    Sort by Popularity
                </Button>
                </Row>
                <Row>
                <Button  className="col s8 m4 offset-s2 offset-m3" waves='light' onClick={this.sortByTags}>
                    Sort by Tags
                </Button>
              </Row>
              </CollapsibleItem>
            </Collapsible>
            {this.setChatElem()}
            <Row>
            <div className='card-container s4'>
            
            {this.state.toDisplay.map(function(item, i) {
              let tmpheader;
              if (i < this.state.OnPage) {
                if (item.Avatar !== null) {
                  tmpheader = item.Avatar;
                  if(item.Avatar.search('https://')) {
                      tmpheader = tmp_url.api_url + '/' + item.Avatar;
                  }
                } else {
                  tmpheader = 'default';
                }
                return (
                  <UserCard key={item.UserID} 
                    header={tmpheader}
                    uid={item}
                    cuid={this.state.curentUser}
                    avatar={item.Gender}
                    cardClass={item.Gender}
                    name={item.FirstName + ' ' + item.LastName}
                    age={'Age: ' + item.Age}
                    userCall={this.goToUser}
                    likeCall={this.likeCall}
                    blockCall={this.blockCall}
                    chatCall={this.chatCall}
                  />
                );
              }
              return(null);
            }, this)}
                
           </div>
            </Row>
            <Row>
              <div className="col s12 m6 offset-s2 offset-m5">
                {this.setButton()}
              </div>
            </Row>
    			</div>
    		</Row>
    	);
    }
}

export default MainPage
