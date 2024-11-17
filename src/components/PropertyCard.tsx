import React from 'react';
import { MapPin, Bed, Bath, Square } from 'lucide-react';

interface PropertyCardProps {
  image: string;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  featured?: boolean;
}

export function PropertyCard({ image, title, price, location, beds, baths, sqft, featured }: PropertyCardProps) {
  return (
    <div className={`group rounded-xl overflow-hidden bg-white shadow-lg transition-transform hover:-translate-y-1 ${featured ? 'col-span-2 md:col-span-1' : ''}`}>
      <div className="relative overflow-hidden aspect-[4/3]">
        <img 
          src={image} 
          alt={title}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            For Sale
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-xl font-bold text-indigo-600">{price}</p>
        </div>
        <div className="flex items-center text-gray-500 mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{location}</span>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex items-center text-gray-600">
            <Bed className="w-4 h-4 mr-1" />
            <span className="text-sm">{beds} Beds</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Bath className="w-4 h-4 mr-1" />
            <span className="text-sm">{baths} Baths</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Square className="w-4 h-4 mr-1" />
            <span className="text-sm">{sqft} sqft</span>
          </div>
        </div>
      </div>
    </div>
  );
}