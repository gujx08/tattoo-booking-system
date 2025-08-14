import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../common/Button';

const skinToneOptions = [
  'Dark',
  'Medium-Dark',
  'Medium-Light',
  'Light'
];

const Step5ColorPreferences: React.FC = () => {
  const { state, dispatch } = useApp();
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const colorOptions = [
    'I like vibrant colors, the more vivid, the better.',
    'I like colors, but not too vibrant.',
    'I only like black and grey.',
    'I like it to be mostly black and grey, but with a hint of single color, e.g. a bit of red.',
    'I\'m not sure, I need suggestions from the artist and then make a decision.',
    'I\'m not sure, but I\'m open for the artist to make the decision for me.'
  ];

  const handleOptionSelect = (option: string) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: { colorPreference: option } });
    
    // Clear error when user makes selection
    if (errors.colorPreference) {
      setErrors(prev => ({ ...prev, colorPreference: '' }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: { [field]: value } });
    
    // Clear error when user makes selection
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!state.formData.colorPreference) {
      newErrors.colorPreference = 'Please select your color preference';
    }
    
    if (!state.formData.skinTone) {
      newErrors.skinTone = 'Please select your skin tone';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      dispatch({ type: 'SET_STEP', payload: 6 });
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 4 });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Color Preferences
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Let us know your color preferences to help us create the perfect tattoo for you.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Do you want this tattoo to have colors? *
          </label>
          
          <div className="space-y-3">
            {colorOptions.map((option, index) => (
              <label 
                key={index} 
                className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                  state.formData.colorPreference === option 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="colorPreference"
                  value={option}
                  checked={state.formData.colorPreference === option}
                  onChange={(e) => handleOptionSelect(e.target.value)}
                  className="mt-1 focus:ring-blue-500 focus:ring-2 text-blue-600"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
          
          {errors.colorPreference && (
            <p className="mt-3 text-sm text-red-600">{errors.colorPreference}</p>
          )}
        </div>

        {/* Skin Tone Question - Moved from Step 6 */}
        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Certain color palettes look better on specific skin tones. What is yours in daylight? *
          </label>
          
          <div className="space-y-2">
            {skinToneOptions.map((option, index) => (
              <label 
                key={index} 
                className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                  state.formData.skinTone === option 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="skinTone"
                  value={option}
                  checked={state.formData.skinTone === option}
                  onChange={(e) => handleInputChange('skinTone', e.target.value)}
                  className="focus:ring-blue-500 focus:ring-2 text-blue-600"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
          
          {errors.skinTone && (
            <p className="mt-2 text-sm text-red-600">{errors.skinTone}</p>
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

export default Step5ColorPreferences;