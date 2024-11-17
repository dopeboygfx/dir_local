import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Lock, Building2, AlertCircle, Loader } from 'lucide-react';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  businessName: z.string().optional(),
  businessAddress: z.string().optional(),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface FormData {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  businessName: string;
  businessAddress: string;
}

export default function Profile() {
  const { user, updateProfile, updatePassword } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    businessName: '',
    businessAddress: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');
    setIsLoading(true);

    try {
      // Validate and update profile information
      const profileData = {
        name: formData.name,
        email: formData.email,
        businessName: formData.businessName,
        businessAddress: formData.businessAddress,
      };

      try {
        updateProfileSchema.parse(profileData);
        await updateProfile(profileData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          error.errors.forEach((err) => {
            if (err.path) {
              setErrors(prev => ({ ...prev, [err.path[0]]: err.message }));
            }
          });
          return;
        }
      }

      // Validate and update password if provided
      if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
        const passwordData = {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        };

        try {
          updatePasswordSchema.parse(passwordData);
          await updatePassword(
            formData.currentPassword,
            formData.newPassword
          );

          // Clear password fields after successful update
          setFormData(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          }));
        } catch (error) {
          if (error instanceof z.ZodError) {
            error.errors.forEach((err) => {
              if (err.path) {
                setErrors(prev => ({ ...prev, [err.path[0]]: err.message }));
              }
            });
            return;
          }
          throw error;
        }
      }

      setSuccessMessage('Profile updated successfully');
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: error instanceof Error ? error.message : 'Failed to update profile',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Profile Settings</h1>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.submit && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {errors.submit}
                  </div>
                )}

                {successMessage && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {successMessage}
                  </div>
                )}

                {/* Personal Information */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personal Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
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
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.email ? 'border-red-500' : 'border-gray-200'
                        } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Password Change */}
                <div className="pt-6 border-t">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Lock className="w-5 h-5 mr-2" />
                    Change Password
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.currentPassword ? 'border-red-500' : 'border-gray-200'
                        } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none`}
                      />
                      {errors.currentPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.newPassword ? 'border-red-500' : 'border-gray-200'
                        } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none`}
                      />
                      {errors.newPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                        } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none`}
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div className="pt-6 border-t">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Business Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                        Business Name
                      </label>
                      <input
                        type="text"
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.businessName ? 'border-red-500' : 'border-gray-200'
                        } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none`}
                      />
                      {errors.businessName && (
                        <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700 mb-1">
                        Business Address
                      </label>
                      <input
                        type="text"
                        id="businessAddress"
                        name="businessAddress"
                        value={formData.businessAddress}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.businessAddress ? 'border-red-500' : 'border-gray-200'
                        } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none`}
                      />
                      {errors.businessAddress && (
                        <p className="text-red-500 text-sm mt-1">{errors.businessAddress}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}