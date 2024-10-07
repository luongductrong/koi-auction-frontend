import React from 'react';
import { Carousel } from 'antd';
import { slides } from './slides';

const Slider = () => {
  return (
    <Carousel autoplay arrows>
      {slides.map((slide) => (
        <div key={slide.slideId}>
          <img src={slide.url} alt={slide.alt} style={{ width: '100%' }} />
        </div>
      ))}
    </Carousel>
  );
};

export default Slider;
