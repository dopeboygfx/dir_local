import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Star, Phone } from 'lucide-react';

interface BusinessCardProps {
  id: string;
  image: string;
  name: string;
  category: string;
  rating: number;
  location: string;
  phone: string;
  hours: string;
  featured?: boolean;
}

export function BusinessCard({ id, image, name, category, rating, location, phone, hours, featured }: BusinessCardProps) {
  return (
    <Link to={`/business/${id}`}>
      <div className={`group rounded-xl overflow-hidden bg-white shadow-lg transition-transform hover:-translate-y-1 ${featured ? 'col-span-2 md:col-span-1' : ''}`}>
        <div className="relative overflow-hidden aspect-[16/9]">
          <img 
            src={image} 
            alt={name}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {category}
            </span>
          </div>
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{name}</h3>
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="ml-1 font-medium">{rating}</span>
            </div>
          </div>
          <div className="flex items-center text-gray-500 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{location}</span>
          </div>
          <div className="flex items-center text-gray-500 mb-2">
            <Phone className="w-4 h-4 mr-1" />
            <span className="text-sm">{phone}</span>
          </div>
          <div className="flex items-center text-gray-500 pt-2 border-t border-gray-100">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">{hours}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}