import { useState, useEffect } from "react";
import feedback from '../assets/feedback.png';
import feedback2 from '../assets/feedback2.png';
import feedback3 from '../assets/feedback3.png';

function FeedbackCarousal() {

  const slides = [
    {
      id: 1,
      image: feedback,
    },
    {
      id: 2,
      image: feedback2,
    },
    {
      id: 3,
      image: feedback3,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto Slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative w-full flex justify-center items-center">

      {/* Image */}
      <div className="w-[85%] transition-all duration-700 ease-in-out">
        <img
          src={slides[currentIndex].image}
          alt="testimonial"
          className="w-full object-contain drop-shadow-2xl rounded-3xl"
        />
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-[-30px] flex gap-3">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-3 w-3 rounded-full cursor-pointer transition-all duration-300 ${
              currentIndex === index
                ? "bg-blue-600 w-6"
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>

    </div>
  );
}

export default FeedbackCarousal;
