import React from 'react';

import  Card  from './Card';
import  UCBody  from './UCElems/UCBody';
import  UCBot  from './UCElems/UCBot';
import  UCCenter  from './UCElems/UCCenter';
import  UCTop  from './UCElems/UCTop';

import './styles.css';



class UserCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true
    };
  }

  hide = () => {
    this.setState({
      show: false
    });
  }

  wraper = () => {
  let {
      href,
      header,
      avatar,
      name,
      age,
      cardClass,
      userCall,
      uid,
      blockCall,
      likeCall,
      chatCall,
      cuid
    } = this.props;

    if (this.state.show) {
      return (
        <a className='card-link' href={href}>
              <Card
                  className={cardClass}
                >
                <UCTop
                src={header}
                  />
              <UCCenter
                  src={avatar}
              />
            <UCBody
              name={name}
              age={age}
              pop={uid.Popularity}
            >
            {this.props.children}
            </UCBody>
            <UCBot  userCa={userCall}
                    header={header}
                    blockCall={blockCall} 
                    chatCall={chatCall} 
                    likeCall={likeCall} 
                    hide={this.hide} 
                    uid={uid}
                    cuid={cuid}
            />
    
            </Card>
      </a>
        );
    }
    return null;
  }
  
  render() {

    return (
      <div>
        {this.wraper()}
      </div>
    );
  }
}

export default UserCard;

