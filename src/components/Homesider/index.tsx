import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';

const Carousel: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0',
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.preventDefault();
  };

  return (
    <Slider {...settings} className="mx-auto max-w-screen-md mt-2">
      <div className="flex items-center justify-center">
        <Image
          width={900}
          height={300} // Ubah tinggi carousel menjadi 300px
          src="/Banner1.jpg"
          alt="Slide 1"
          className="object-cover rounded-lg cursor-pointer"
          onClick={handleImageClick}
          style={{ outline: 'none' }}
        />
      </div>
      <div className="flex items-center justify-center">
        <Image
          width={900}
          height={300} // Ubah tinggi carousel menjadi 300px
          src="/Banner1.jpg"
          alt="Slide 2"
          className="object-cover rounded-lg cursor-pointer"
          onClick={handleImageClick}
          style={{ outline: 'none' }}
        />
      </div>
      <div className="flex items-center justify-center">
        <Image
          width={900}
          height={300} // Ubah tinggi carousel menjadi 300px
          src="/Banner1.jpg"
          alt="Slide 3"
          className="object-cover rounded-lg cursor-pointer"
          onClick={handleImageClick}
          style={{ outline: 'none' }}
        />
      </div>
      {/* Add more slides as needed */}
    </Slider>
  );
};

export default Carousel;
