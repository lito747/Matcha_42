import React from 'react';

import './styles.css';

class UCBody extends React.Component {
  render() {
    let {
      name,
      age,
      pop
    } = this.props;
    
    return (
      <div
	       className='user-card-body'
	     >
        <div className='user-card-name'>
	         {name}
	       </div>
          <div className='user-card-age'>
            {age}
          </div>
          <div className='user-card-age'>
            Popularity: {pop}
          </div>
	       {this.props.children}
      </div>
    );
  }
}

export default UCBody;