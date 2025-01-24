"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
// import "swiper/css/pagination";
import "swiper/css/navigation";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/hooks";
import { getPromo } from "@/redux/thunks/promoThunks";
import { RootState } from "@/redux/store";

type Promo = {
  id: number;
  imageTitle: string;
  imageSubTitle: string;
  imageUrl: string;
  promoTitle: string;
  promoDetail: string;
  promoEndDate: string;
};

const Carousel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data } = useSelector((state: RootState) => state.promo);

  useEffect(() => {
    dispatch(getPromo());
  }, [dispatch]);

  return (
    <>
      <Swiper
        autoplay={{
          delay: 3000, // Delay in milliseconds
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination]}
      >
        {data &&
          data.promoData.map((item: Promo) => (
            <SwiperSlide key={item.id}>
              <Image
                src={`https://web.amscorp.id:3060/imagestorage/promo/${item.imageUrl}`}
                alt={`Image ${item.id}`}
                // className="w-full max-h-48 object-cover rounded-lg min-h-48"
                className="w-full h-44 sm:h-48 object-cover rounded-lg"
                width={400}
                height={200}
              />
            </SwiperSlide>
          ))}
      </Swiper>
    </>
  );
};

export default Carousel;
