import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { validateRequired } from '../../utils/validation';
import ImageUpload from '../common/ImageUpload';
import Button from '../common/Button';

const Step4Placement: React.FC = () => {
  const { state, dispatch } = useApp();
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const placementCertaintyOptions = [
    'I know exactly where I want this tattoo, how big and in what shape.',
    'I have a general idea but it can change if there\'s better options.',
    'I have too many options, idk which one is the best. I need artist\'s help!',
    'I have no idea how to place this tattoo and what size and shapes are the best. I need artist\'s help!'
  ];

  const openToSuggestionsOptions = [
    'Yes that\'s perfect, I\'m open to better options!',
    'Yes that would be good, but my mind is pretty set on the original idea.',
    'I\'d like to do that ahead of time, e.g. during the consultation',
    'No, this placement is my only option.'
  ];

  const handleInputChange = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: { [field]: value } });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBodyPhotosChange = (files: File[]) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: { bodyPhotos: files } });
    
    // Clear error when files are selected
    if (errors.bodyPhotos) {
      setErrors(prev => ({ ...prev, bodyPhotos: '' }));
    }
  };

  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!validateRequired(state.formData.placement || '')) {
      newErrors.placement = 'Please describe the size, shape and placement';
    }
    
    if (!state.formData.placementCertainty) {
      newErrors.placementCertainty = 'Please select how certain you are about the placement';
    }
    
    if (!state.formData.openToSuggestions) {
      newErrors.openToSuggestions = 'Please let us know if you\'re open to suggestions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      dispatch({ type: 'SET_STEP', payload: 5 });
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 3 });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Size, Shape & Placement
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Help us understand where you want your tattoo and how you envision it fitting on your body.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
        {/* Size and Placement Description */}
        <div>
          <label htmlFor="placement" className="block text-sm font-medium text-gray-700 mb-2">
            What is the size, shape and placement you are picturing? *
          </label>
          <textarea
            id="placement"
            rows={4}
            value={state.formData.placement || ''}
            onChange={(e) => handleInputChange('placement', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.placement ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="E.g. 3 inches round shape on forearm / a long stripe going down in the central back"
          />
          {errors.placement && (
            <p className="mt-1 text-sm text-red-600">{errors.placement}</p>
          )}
        </div>

        {/* Body Photos - Now a text reminder instead of upload */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Prepare photos of the area
          </h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Prepare 1-3 photos of the placement, size and shape of your tattoo. It can be your own body photo, or a photo of somebody else's tattoo. Your body photos are kept strictly confidential and used only for design purposes.
            </p>
          </div>
        </div>

        {/* Hidden ImageUpload component - keeping for future use */}
        <div style={{ display: 'none' }}>
          <ImageUpload
            files={state.formData.bodyPhotos || []}
            onChange={handleBodyPhotosChange}
            maxFiles={3}
            required={false}
            label="Upload photos of the area"
            description="Upload up to 3 photos of the area where you want your tattoo. It can be your own body photo, or somebody else's existing tattoo. Your photos are kept strictly confidential and used only for design purposes."
          />
        </div>

        {/* Placement Certainty */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How certain are you about the placement? *
          </label>
          <div className="space-y-2">
            {placementCertaintyOptions.map((option, index) => (
              <label key={index} className="flex items-start space-x-3">
                <input
                  type="radio"
                  name="placementCertainty"
                  value={option}
                  checked={state.formData.placementCertainty === option}
                  onChange={(e) => handleInputChange('placementCertainty', e.target.value)}
                  className="mt-1 focus:ring-blue-500 focus:ring-2 text-blue-600"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
          {errors.placementCertainty && (
            <p className="mt-1 text-sm text-red-600">{errors.placementCertainty}</p>
          )}
        </div>

        {/* Open to Suggestions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Are you open for the artist to assess your body on the tattoo day, and suggest other best fit placements? *
          </label>
          <div className="space-y-2">
            {openToSuggestionsOptions.map((option, index) => (
              <label key={index} className="flex items-start space-x-3">
                <input
                  type="radio"
                  name="openToSuggestions"
                  value={option}
                  checked={state.formData.openToSuggestions === option}
                  onChange={(e) => handleInputChange('openToSuggestions', e.target.value)}
                  className="mt-1 focus:ring-blue-500 focus:ring-2 text-blue-600"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
          {errors.openToSuggestions && (
            <p className="mt-1 text-sm text-red-600">{errors.openToSuggestions}</p>
          )}
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

export default Step4Placement;