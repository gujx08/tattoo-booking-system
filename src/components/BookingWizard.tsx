import React from 'react';
import { useApp } from '../context/AppContext';
import ProgressBar from './common/ProgressBar';
import Step1ArtistSelection from './booking/Step1ArtistSelection';
import Step2BasicInfo from './booking/Step2BasicInfo';
import Step3TattooIdea from './booking/Step3TattooIdea';
import Step4Placement from './booking/Step4Placement';
import Step5ColorPreferences from './booking/Step5ColorPreferences';
import Step6FinalQuestions from './booking/Step6FinalQuestions';
import ConsultationChoice from './booking/ConsultationChoice';
import ConsultationScheduling from './booking/ConsultationScheduling';
import PaymentPage from './booking/PaymentPage';
import PaymentProcessingPage from './booking/PaymentProcessingPage';
import PaymentFailedPage from './booking/PaymentFailedPage';
import PaymentCancelledPage from './booking/PaymentCancelledPage';
import SuccessPage from './booking/SuccessPage';

const BookingWizard: React.FC = () => {
  const { state } = useApp();

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <Step1ArtistSelection />;
      case 2:
        return <Step2BasicInfo />;
      case 3:
        return <Step3TattooIdea />;
      case 4:
        return <Step4Placement />;
      case 5:
        return <Step5ColorPreferences />;
      case 6:
        return <Step6FinalQuestions />;
      case 7:
        return <ConsultationChoice />;
      case 8:
        return <ConsultationScheduling />;
      case 9:
        return <PaymentPage />;
      case 10:
        return <SuccessPage />;
      case 11:
        return <PaymentProcessingPage />;
      case 12:
        return <PaymentFailedPage />;
      case 13:
        return <PaymentCancelledPage />;
      default:
        return <Step1ArtistSelection />;
    }
  };

  const getProgressSteps = () => {
    // Progress is based on the main form steps (2-6), adjusted for display
    if (state.currentStep === 1) return 1; // Artist selection doesn't show progress
    if (state.currentStep >= 2 && state.currentStep <= 6) return state.currentStep - 1; // Steps 2-6 become 1-5 in progress
    return 5; // All steps after 6 show completed progress (5/5)
  };

  const shouldShowProgressBar = () => {
    // 只在表单步骤(2-6)显示进度条，Step 1 (纹身师选择) 和 7及以后隐藏
    return state.currentStep >= 2 && state.currentStep <= 6;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar - 只在表单步骤显示 */}
      {shouldShowProgressBar() && (
        <div className="bg-white shadow-sm py-4">
          <div className="max-w-4xl mx-auto px-4">
            <ProgressBar 
              currentStep={getProgressSteps()} 
              totalSteps={5} 
            />
          </div>
        </div>
      )}
      
      {/* Step Content */}
      {renderStep()}
    </div>
  );
};

export default BookingWizard;