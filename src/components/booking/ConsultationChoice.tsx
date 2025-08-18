import React from 'react';
import { useApp } from '../../context/AppContext';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { sendBookingDraftEmail } from '../../services/emailService';
import { getDepositAmount } from '../../config/stripeConfig';

const ConsultationChoice: React.FC = () => {
  const { state, dispatch } = useApp();

  const handleConsultationChoice = async (needsConsultation: boolean) => {
    try {
      // 1. 更新AppContext状态
      dispatch({ 
        type: 'UPDATE_FORM_DATA', 
        payload: { needsConsultation } 
      });

      // 2. 准备完整预订数据
      const completeBookingData = {
        formData: state.formData,
        selectedArtist: state.selectedArtist,
        consultationChoice: needsConsultation,
        timestamp: new Date().toISOString(),
        depositAmount: getDepositAmount(state.selectedArtist?.id || ''),
        status: 'PENDING_PAYMENT'
      };

      // 3. 保存到localStorage（备份）
      localStorage.setItem('patchTattooBooking', JSON.stringify(completeBookingData));

      // 4. 发送预订草稿邮件
      console.log('📧 发送预订草稿邮件...');
      const emailResult = await sendBookingDraftEmail(completeBookingData);
      
      if (emailResult.success) {
        console.log('✅ 预订草稿邮件发送成功');
      } else {
        console.warn('⚠️ 预订草稿邮件发送失败:', emailResult.error);
        // 邮件发送失败不影响流程继续
      }

      // 5. 直接跳转到支付页面（不管选择什么）
      dispatch({ type: 'SET_STEP', payload: 9 }); // 直接跳转到支付页面

    } catch (error) {
      console.error('❌ 处理咨询选择时出错:', error);
      // 即使出错也要跳转到支付页面
      dispatch({ type: 'SET_STEP', payload: 9 });
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 6 });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Do you need a 1-1 consultation?
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Consultation is a 30 min 1-on-1 Zoom call with your selected artist to confirm design details.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Yes Option - 低亮显示 */}
        <div 
          onClick={() => handleConsultationChoice(true)}
          className="bg-white border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
              <MessageCircle className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Yes I need help
            </h3>
            <p className="text-gray-600 mb-4">
              Schedule a consultation call to discuss your tattoo idea in detail and get personalized advice.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Please get all your reference photos ready.
            </p>
            <div className="flex items-center justify-center text-gray-700 group-hover:text-gray-900">
              <span className="mr-2">Schedule consultation</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* No Option - 高亮显示 */}
        <div 
          onClick={() => handleConsultationChoice(false)}
          className="bg-blue-50 border-2 border-blue-500 rounded-lg p-6 cursor-pointer hover:bg-blue-100 hover:border-blue-600 hover:shadow-lg transition-all duration-200 group"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
              <ArrowRight className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-blue-900 mb-3">
              No need thanks
            </h3>
            <p className="text-blue-800 mb-4">
              I'm confident about my tattoo idea and ready to proceed directly to booking and payment.
            </p>
            <p className="text-sm text-blue-600 mb-4">
              Your artist will confirm the design details with you via email.
            </p>
            <div className="flex items-center justify-center text-blue-700 group-hover:text-blue-900 font-medium">
              <span className="mr-2">Proceed to payment</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center">
        <button
          onClick={handleBack}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ConsultationChoice;