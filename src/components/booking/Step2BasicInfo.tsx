import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { validateEmail, validatePhone, validateRequired, getEmailError, getPhoneError } from '../../utils/validation';
import Button from '../common/Button';

const Step2BasicInfo: React.FC = () => {
  const { state, dispatch } = useApp();
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: { [field]: value } });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    handleInputChange('email', email);
    
    // Real-time email validation
    const emailError = getEmailError(email);
    setErrors(prev => ({ ...prev, email: emailError }));
  };

  const handleEmailBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    // Validate on blur as well
    const emailError = getEmailError(email);
    setErrors(prev => ({ ...prev, email: emailError }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    handleInputChange('phone', phone);
    
    // Real-time validation
    const phoneError = getPhoneError(phone);
    setErrors(prev => ({ ...prev, phone: phoneError }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    handleInputChange('name', name);
    
    // Clear name error when user starts typing
    if (errors.name && name.trim()) {
      setErrors(prev => ({ ...prev, name: '' }));
    }
  };

  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!validateRequired(state.formData.name || '')) {
      newErrors.name = 'Name is required';
    }
    
    const emailError = getEmailError(state.formData.email || '');
    if (emailError) {
      newErrors.email = emailError;
    }
    
    const phoneError = getPhoneError(state.formData.phone || '');
    if (phoneError) {
      newErrors.phone = phoneError;
    }
    
    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    
    if (hasErrors) {
      // Focus on first error field
      const firstErrorField = Object.keys(newErrors).find(key => newErrors[key] !== '');
      if (firstErrorField) {
        const element = document.querySelector(`input[name="${firstErrorField}"]`) as HTMLInputElement;
        element?.focus();
      }
    }
    
    return !hasErrors;
  };

  const handleNext = () => {
    if (validate()) {
      dispatch({ type: 'SET_STEP', payload: 3 });
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 1 });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          How should we call you?
        </h1>
        <p className="text-gray-600">
          We'll use this information to contact you about your appointment.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={state.formData.name || ''}
              onChange={handleNameChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={state.formData.email || ''}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={state.formData.phone || ''}
              onChange={handlePhoneChange}
              onBlur={handlePhoneChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="(555) 123-4567"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              We collect your phone number to contact you only if you miss your scheduled appointment time.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default Step2BasicInfo;