import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import Image1 from "../assets/gallery3.jpg";
import Image2 from "../assets/gallery4.jpeg";
import Image3 from "../assets/gallery2.jpg";
import Image4 from "../assets/gallery1.jpg";
import { useNavigate } from "react-router-dom";
const About = () => {
  const images = [
    Image1,
    Image2,
    Image3,
    Image4
  ];
  const navigate = useNavigate();
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-gray-800">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">About Hope Horizon</h1>
        <p className="text-lg max-w-3xl mx-auto dark:text-primary-foreground">
          Hope Horizon is dedicated to making a difference in the lives of those in need.
          Through our fundraising efforts, we provide food, education, and healthcare to underprivileged communities.
        </p>
      </div>

      {/* Carousel Section */}
      <div className="mb-12">
        <Carousel opts={{ loop: true }} plugins={[Autoplay({ delay: 3000 })]}>
          <CarouselContent>
            {images.map((img, index) => (
              <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 md:basis-1/4">
                <Card className="shadow-md">
                  <CardContent className="flex aspect-square items-center justify-center p-2">
                    <img src={img} alt="Charity Work" className="w-full h-full object-cover rounded-lg" />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Our Mission */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-primary mb-4">Our Mission</h2>
        <p className="max-w-3xl mx-auto text-lg dark:text-primary-foreground">
          We believe in the power of community and generosity. Our goal is to bring sustainable change by supporting
          local initiatives and providing resources to those who need them the most. Every donation helps create a
          better future.
        </p>
      </div>

      {/* Call to Action */}
      <div className="bg-primary text-white text-center py-10 rounded-lg">
        <h3 className="text-2xl font-bold mb-3">Join Our Mission</h3>
        <p className="text-lg mb-4">
          Whether it's through donations, volunteering, or spreading awareness, you can be a part of the change.
        </p>
        <button className="bg-white text-primary px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
          onClick={() => navigate("/campaigns")}
          >
          Get Involved
        </button>
      </div>
    </div>
  );
};

export default About;
