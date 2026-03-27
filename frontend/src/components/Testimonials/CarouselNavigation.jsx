import { ChevronLeft, ChevronRight } from 'lucide-react';

function CarouselNavigation({ onPrev, onNext }) {
  return (
    <div className="flex gap-4 mt-6 justify-center">
      <button
        onClick={onPrev}
        className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="h-6 w-6 text-blue-600" />
      </button>
      <button
        onClick={onNext}
        className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
        aria-label="Next testimonial"
      >
        <ChevronRight className="h-6 w-6 text-blue-600" />
      </button>
    </div>
  );
}

export default CarouselNavigation;