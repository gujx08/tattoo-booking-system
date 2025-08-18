import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { validateRequired } from '../../utils/validation';
import ImageUpload from '../common/ImageUpload';
import Button from '../common/Button';

const Step3TattooIdea: React.FC = () => {
  const { state, dispatch } = useApp();
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: { [field]: value } });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleReferenceImagesChange = (files: File[]) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: { referenceImages: files } });
  };

  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!validateRequired(state.formData.tattooIdea || '')) {
      newErrors.tattooIdea = 'Please describe your tattoo idea';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      dispatch({ type: 'SET_STEP', payload: 4 });
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 2 });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Tell us about your tattoo idea
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Share your vision with us. The more details you provide, the better we can 
          bring your tattoo to life.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
        {/* Main Tattoo Idea */}
        <div>
          <label htmlFor="tattooIdea" className="block text-sm font-medium text-gray-700 mb-2">
            Describe your tattoo idea *
          </label>
          <textarea
            id="tattooIdea"
            rows={6}
            value={state.formData.tattooIdea || ''}
            onChange={(e) => handleInputChange('tattooIdea', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.tattooIdea ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Describe the tattoo element or vision you have. E.g. a dog + some cherry blossoms, and abstract smoke."
          />
          {errors.tattooIdea && (
            <p className="mt-1 text-sm text-red-600">{errors.tattooIdea}</p>
          )}
        </div>

        {/* Inspiration References - Now a text reminder instead of upload */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Share inspiration references
          </h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Prepare 1-8 images that capture the look of the tattoo you're going for, and show those to your artist later in the email.
              It can be somebody else's tattoo, or any online photos.
            </p>
          </div>
        </div>

        {/* Hidden ImageUpload component - keeping for future use */}
        <div style={{ display: 'none' }}>
          <ImageUpload
            files={state.formData.referenceImages || []}
            onChange={handleReferenceImagesChange}
            maxFiles={8}
            required={false}
            label="Share inspiration references"
            description="Share 1-8 images that capture the style you're going for. It can be somebody else's tattoo that shows your desired style, or desired look."
          />
        </div>

        {/* Instagram Reference - keeping this one */}
        <div>
          <label htmlFor="instagramReference" className="block text-sm font-medium text-gray-700 mb-2">
            Which tattoo on the artist's IG resonated with you and made you want their work? (Optional)
          </label>
          <input
            type="text"
            id="instagramReference"
            value={state.formData.instagramReference || ''}
            onChange={(e) => handleInputChange('instagramReference', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the Instagram post or provide a link..."
          />
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

export default Step3TattooIdea;