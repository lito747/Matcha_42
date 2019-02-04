import React from 'react';
import { CarouselProvider, Slider, Slide} from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

export class MyCarousel extends React.Component {
  render() {
    const tmp = this.props.data;
    const style = this.props.style;

    return (
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={100}
        totalSlides={tmp.length}

      >        
        <Slider>
        {tmp.map(function(item, i){
          return (<Slide index={i} key={i}>
                    <img index={i} style={style} src={item} alt={""}/>
                  </Slide>);
        })}
        </Slider>
      </CarouselProvider>
    );
  }
}

export default MyCarousel
