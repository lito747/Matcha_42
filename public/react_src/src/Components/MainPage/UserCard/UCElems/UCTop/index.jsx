import React from 'react';
import Deff from '../../../../../img_src/account2.jpg'

import './styles.css';

class UCTop extends React.Component {

  checksrc = (tmp) => {
    if (tmp === 'default') {
      return Deff;
    }
    return tmp;
  }

  render() {
    let {
      src
    } = this.props;
    
    return (
      <div
	       className='user-card-header'
	       style={{backgroundImage: `url(${this.checksrc(src)})`}}
	     >
      </div>
    );
  }
}

export default UCTop;