import React from "react";
import axios from "axios"
import { GoogleApiWrapper, Map } from "google-maps-react";

export class MyMap extends React.Component {
   constructor(props) {
      super(props);
      this.state = { 
          userLocation: { 
                          lat: 32, 
                          lng: 32 
                        },
          ip: '',
          loading: true 
        };
    }


  componentDidMount(props) {
  //  if (!props.lat && !props.lng) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;

          this.setState({
           userLocation: { lat: latitude, lng: longitude },
           loading: false
          });
        },
        () => {
             axios.get('http://api.hostip.info/get_html.php')
                  .then( response => {
                    let reg = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
                    let temp = response.data.match(reg);
                    this.setState({ip : temp[0]});
                    let reqest = 'http://ip-api.com/json/' + temp[0];
                    axios.get(reqest)
                      .then( response => {
                          this.setState({
                          userLocation: {
                              lat: response.data.lat,
                              lng: response.data.lon
                          },
                          loading: false
                          });
                      });
            });
       });
   // }
}

  render() {
    const { loading, userLocation } = this.state;
    const { google } = this.props;
    if (loading) {
      return null;
    }

    return <Map google={google} style={{width: '400px', height: '400px'}} initialCenter={userLocation} zoom={10} />;
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAZui479HQ-RvwHw2DgzKj585znt0i5iL4"
})(MyMap);