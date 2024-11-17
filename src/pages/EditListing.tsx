import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Store, Upload, MapPin, Phone, Clock, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBusiness } from '../contexts/BusinessContext';

interface FormData {
  name: string;
  category: string;
  description: string;
  location: string;
  phone: string;
  hours: string;
  image: string;
}

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getBusinessById, updateBusiness } = useBusiness();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: '',
    description: '',
    location: '',
    phone: '',
    hours: '',
    image: '',
  });

  useEffect(() => {
    if (id) {
      const business = getBusinessById(id);
      if (business) {
        if (business.userId !== user?.id) {
          navigate('/my-listings');
          return;
        }
        setFormData({
          name: business.name,
          category: business.category,
          description: business.description,
          location: business.location,
          phone: business.phone,
          hours: business.hours,
          image: business.image,
        });
      }
      setIsLoading(false);
    }
  }, [id, user, navigate, getBusinessById]);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Business name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be in format (XXX) XXX-XXXX';
    }

    if (!formData.hours.trim()) {
      newErrors.hours = 'Business hours are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !id) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateBusiness(id, formData);
      navigate('/my-listings');
    } catch (error) {
      console.error('Failed to update business:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to update business. Please try again.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 10);
    if (numbers.length === 0) return '';
    if (numbers.length <= 3) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="w-6 h-6 text-emerald-600 animate-spin" />
          <span className="text-gray-600">Loading business details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Store className="w-6 h-6 text-emerald-600" />
              <h1 className="text-2xl font-bold text-gray-900">Edit Listing</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.submit && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {errors.submit}
                </div>
              )}

              {/* Image Upload */}
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8">
                <div className="flex flex-col items-center">
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">Drag and drop your image here</p>
                  <p className="text-sm text-gray-500 mb-4">or</p>
                  <button
                    type="button"
                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Browse Files
                  </button>
                </div>
              </div>

              {/* Business Details */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.name ? 'border-red-500' : 'border-gray-200'
                  } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                >
                  <option>Cafés</option>
                  <option>Restaurants</option>
                  <option>Retail</option>
                  <option>Services</option>
                  <option>Fitness</option>
                  <option>Health</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.description ? 'border-red-500' : 'border-gray-200'
                  } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.location ? 'border-red-500' : 'border-gray-200'
                    } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none`}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="(XXX) XXX-XXXX"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.phone ? 'border-red-500' : 'border-gray-200'
                    } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Business Hours
                </label>
                <input
                  type="text"
                  id="hours"
                  name="hours"
                  value={formData.hours}
                  onChange={handleChange}
                  placeholder="e.g., Mon-Fri: 9AM-6PM"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.hours ? 'border-red-500' : 'border-gray-200'
                  } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none`}
                />
                {errors.hours && (
                  <p className="text-red-500 text-sm mt-1">{errors.hours}</p>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/my-listings')}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}