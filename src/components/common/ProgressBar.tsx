import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full bg-neutral-200 rounded-full h-2">
      <div 
        className="bg-yellow-500 h-2 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      />
      <div className="mt-2 text-sm text-stone-600 text-center">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
};

export default ProgressBar;