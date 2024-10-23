import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const slide = [
  'https://daihoc.fpt.edu.vn/wp-content/uploads/2022/08/do_an_tot_nghiep_dai_hoc_fpt_10-1661503315.jpeg',
  'https://dnuni.fpt.edu.vn/wp-content/uploads/2022/04/IMG_0454-1350x900.jpg',
  'https://i.chungta.vn/2022/05/09/ugu9850-1652081269_1200x0.jpg',
];

export default function CarouselHome() {
  return (
    <div className="w-full pl-10 pr-10">
      <Carousel>
      <CarouselContent>
        {slide.map((image, index) => (
          <CarouselItem key={index}>
      
              <Card>
                <CardContent className="flex aspect-[4/3] p-0">
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
