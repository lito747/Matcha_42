import React from 'react';
import Female from '../../../../../img_src/female1.jpg';
import Male   from '../../../../../img_src/male1.jpg';

import './styles.css';

class UCCenter extends React.Component {

  chooseGend = () => {
    let {
      src
    } = this.props;

    if (src === 'female') {
      return(
          <div
              className='user-card-avatar'
              style={{backgroundImage: `url(${Female})`}}
            >
  
          </div>
        );
    }
    return(
            <div
              className='user-card-avatar'
              style={{backgroundImage: `url(${Male})`}}
            >
  
          </div>
          );
  }

  render() {

    
    return (
      <div>
        {this.chooseGend()}
      </div>
    );
  }
}

export default UCCenter;