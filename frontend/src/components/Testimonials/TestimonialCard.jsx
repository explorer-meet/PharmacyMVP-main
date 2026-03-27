import { Quote } from 'lucide-react';
import StarRating from './StarRating';

function TestimonialCard({ name, role, comment, rating, image }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg relative">
      <Quote className="absolute top-4 right-4 h-8 w-8 text-blue-100" />
      <div className="flex items-center gap-4 mb-4">
        <img
          src={image}
          alt={name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="font-ibm font-semibold text-lg">{name}</h3>
          <p className="text-gray-600 text-sm">{role}</p>
        </div>
      </div>
      <StarRating rating={rating} />
      <p className="text-gray-700 font-ibm leading-relaxed">{comment}</p>
    </div>
  );
}

export default TestimonialCard;