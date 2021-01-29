import React, { Component } from "react";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import ScrollMagic from 'scrollmagic'

import "./index.min.css";

import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss";
import "swiper/components/scrollbar/scrollbar.scss";

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

export default class Carousel extends Component {
  state = {
    context: [
      {
        id: 1,
        title: "Slide 1",
        main:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque minus ad itaque optio?",
        photo: "",
      },
      {
        id: 2,
        title: "Slide 2",
        main:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque minus ad itaque optio?",
        photo: "",
      },
    ],
  };
  // componentDidMount(){
  //   let controller = new ScrollMagic.Controller()
  // }
  render() {
    return (
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        // scrollbar={{ draggable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log("slide change")}
        className="carousel"
      >
        {this.state.context.map((value, key) => {
          return (
            <SwiperSlide key={key}>
              <div className="carousel__slide">
                <div className="carousel__text">
                  <div className="carousel__context">
                    <div className="carousel__title">{value.title}</div>
                    <div className="carousel__main">{value.main}</div>
                  </div>
                  <div className="carousel__photo">
                    <div className="carousel__video">
                      <video
                        id="movies"
                        controls
                        // onMouseOver={this.play()}
                        // onMouseOut={this.pause()}
                        autobuffer="true"
                        width="400px"
                        height="300px"
                      ><source src="http://39.99.151.46:3000/media/swiper/media/Admet-video.mp4" type="video/mp4" />
                      您的浏览器不支持video标签。</video>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}

        <SwiperSlide>
          <div className="carousel__slide">Slide 2</div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="carousel__slide">Slide 3</div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="carousel__slide">Slide 4</div>
        </SwiperSlide>
      </Swiper>
    );
  }
}
