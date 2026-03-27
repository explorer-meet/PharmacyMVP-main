import { useState, useEffect } from 'react';
import TestimonialCard from './TestimonialCard';
import CarouselNavigation from './CarouselNavigation';
import CarouselDots from './CarouselDots';
import { testimonials } from './data';

function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="w-full min-h-[100vh] bg-gray-50 flex items-center">
      <div className="w-full px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="lg:pl-8">
            <h2 className="font-ibm font-bold text-4xl lg:text-[4rem] leading-[1.2] lg:leading-[80.2px]">
              What Our <span className="text-[#0360D9]">Patient's Saying</span> About Us
            </h2>
            <p className="mt-4 text-[#163048] text-[.9rem] leading-[20.2px] lg:w-[80%]">
              Real experiences from our valued patients reflect our commitment to exceptional healthcare services.
            </p>
          </div>

          <div className="relative lg:pr-8">
            <div className="transition-all duration-500 ease-in-out">
              <TestimonialCard {...testimonials[currentIndex]} />
            </div>

            <CarouselNavigation 
              onPrev={handlePrev}
              onNext={handleNext}
            />

            <CarouselDots 
              total={testimonials.length}
              current={currentIndex}
              onClick={handleDotClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestimonialCarousel;