function CarouselDots({ total, current, onClick }) {
    return (
      <div className="flex justify-center gap-2 mt-4">
        {[...Array(total)].map((_, index) => (
          <button
            key={index}
            onClick={() => onClick(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              current === index ? 'bg-blue-600 w-4' : 'bg-gray-300'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    );
  }
  
  export default CarouselDots;