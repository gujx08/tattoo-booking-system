import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../common/Button';
import { sendBookingDraftEmail } from '../../services/emailService';
import { getDepositAmount } from '../../config/stripeConfig';

const Step6FinalQuestions: React.FC = () => {
  const { state, dispatch } = useApp();
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const firstTattooOptions = [
    'Yes it is, I never had tattoos before',
    'I have many other tattoos, I\'m covered',
    'I have 1-2 small walk-in tattoos from when I was young',
    'Other...'
  ];

  const handleInputChange = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: { [field]: value } });
    
    // Clear error when user makes selection
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!state.formData.isFirstTattoo) {
      newErrors.isFirstTattoo = 'Please let us know about your tattoo experience';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (validate()) {
      // 检查是否是"Help Choosing Artist"流程
      if (state.formData.needsHelpChoosing) {
        try {
          // 准备完整预订数据
          const completeBookingData = {
            formData: state.formData,
            selectedArtist: state.selectedArtist,
            consultationChoice: false, // Help choosing流程不需要咨询
            timestamp: new Date().toISOString(),
            depositAmount: 0, // Help choosing流程不需要定金
            status: 'HELP_CHOOSING_ARTIST'
          };

          // 保存到localStorage（备份）
          localStorage.setItem('patchTattooBooking', JSON.stringify(completeBookingData));

          // 发送预订草稿邮件
          console.log('📧 发送Help Choosing Artist邮件...');
          const emailResult = await sendBookingDraftEmail(completeBookingData);
          
          if (emailResult.success) {
            console.log('✅ Help Choosing Artist邮件发送成功');
          } else {
            console.warn('⚠️ Help Choosing Artist邮件发送失败:', emailResult.error);
          }

          // 显示成功弹窗并返回纹身师选择页面
          alert("Success! Our management team will get back to you with the recommendation for a best fit artist");
          dispatch({ type: 'RESET_FORM' });
          dispatch({ type: 'SET_STEP', payload: 1 }); // 返回纹身师选择页面
        } catch (error) {
          console.error('❌ Help Choosing Artist流程出错:', error);
          // 即使邮件发送失败，也要显示成功信息并跳转
          alert("Success! Our management team will get back to you with the recommendation for a best fit artist");
          dispatch({ type: 'RESET_FORM' });
          dispatch({ type: 'SET_STEP', payload: 1 });
        }
      } else {
        // 正常流程：跳转到咨询选择页面
        dispatch({ type: 'SET_STEP', payload: 7 });
      }
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 5 });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Final Questions
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Just a couple more questions to help us create the perfect tattoo experience for you.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
        {/* First Tattoo Question */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Is it your 1st tattoo? *
          </label>
          
          <div className="space-y-2">
            {firstTattooOptions.map((option, index) => (
              <label 
                key={index} 
                className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                  state.formData.isFirstTattoo === option 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="isFirstTattoo"
                  value={option}
                  checked={state.formData.isFirstTattoo === option}
                  onChange={(e) => handleInputChange('isFirstTattoo', e.target.value)}
                  className="focus:ring-blue-500 focus:ring-2 text-blue-600"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
          
          {errors.isFirstTattoo && (
            <p className="mt-2 text-sm text-red-600">{errors.isFirstTattoo}</p>
          )}
        </div>

        {/* Additional Information Question */}
        <div>
          <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
            Is there anything else you want to tell us? (Optional)
          </label>
          <textarea
            id="additionalInfo"
            rows={3}
            value={state.formData.additionalInfo || ''}
            onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Any additional information you'd like to share..."
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button onClick={handleNext}>
          Done
        </Button>
      </div>
    </div>
  );
};

export default Step6FinalQuestions;