import React from "react";

import { GoogleApiWrapper, Map, Marker } from "google-maps-react";

const style = {
  width: '50%',
  height: '50%',
  top: '10%',
  left: '20%'
}



export class MyMap extends React.Component {
   constructor(props) {
      super(props);
      this.state = { 
          userLocation: { 
                          lat: this.props.lat, 
                          lng: this.props.lng 
                        },
          ip: '',
          loading: true 
        };
    }


  render() {
    return(<Map google={this.props.google}  
                initialCenter={
                  this.state.userLocation
                }
                style={style}
                zoom={10}>
            <Marker
                      position={this.state.userLocation} />
            <Marker />
           </Map>
      );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAZui479HQ-RvwHw2DgzKj585znt0i5iL4"
})(MyMap);