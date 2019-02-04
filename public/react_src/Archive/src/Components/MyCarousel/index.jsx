import React from 'react';
import { CarouselProvider, Slider, Slide} from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

export class MyCarousel extends React.Component {
  render() {
    const tmp = this.props.data;
    return (
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={100}
        totalSlides={tmp.length}
      >        
        <Slider>
        {tmp.map(function(item, i){
          return (<Slide index={i} key={i}>
                    <img index={i} style={{width: '100%', height: '100%'}} src={item} alt={""}/>
                  </Slide>);
        })}
        </Slider>
      </CarouselProvider>
    );
  }
}

export default MyCarousel


        // {tmp.map(function(item, i){
        //     console.log(i);
        //   return (<Slide index={i}>
        //             <img index={i} style={{width: '100%', height: '100%'}} src={item}/>
        //           </Slide>);
        // })}