import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React from "react";
import Autoplay from "embla-carousel-autoplay"

const slide = [
  'https://dnuni.fpt.edu.vn/wp-content/uploads/2022/08/DSC02394.jpg',
  'https://dnuni.fpt.edu.vn/wp-content/uploads/2022/04/IMG_0454-1350x900.jpg',
  'https://i.chungta.vn/2022/05/09/ugu9850-1652081269_1200x0.jpg',
];

export default function CarouselHome() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )
  return (
    
    <div className="w-full pl-10 pr-10">
       <Carousel
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {slide.map((image, index) => (
          <CarouselItem key={index}>
      
              <Card>
                <CardContent className="flex aspect-[6/4] p-0">
                  <img src={image} alt={`Slide ${index + 1}`} />
                </CardContent>
              </Card>
         
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious/>
      <CarouselNext/>
    </Carousel>
    </div>
    
  );
}