import React from 'react';
import { useApp } from '../../context/AppContext';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { sendBookingDraftEmail } from '../../services/emailService';
import { getDepositAmount } from '../../config/stripeConfig';

const ConsultationChoice: React.FC = () => {
  const { state, dispatch } = useApp();

  const handleConsultationChoice = async (needsConsultation: boolean) => {
    try {
      // 1. 立即更新AppContext状态
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

      // 4. 根据选择决定跳转方向
      if (needsConsultation) {
        // 需要咨询 → 跳转到咨询时间选择页面
        dispatch({ type: 'SET_STEP', payload: 8 });
      } else {
        // 不需要咨询 → 发送邮件并显示通知弹窗
        // 显示通知弹窗
        dispatch({ 
          type: 'SHOW_NOTIFICATION', 
          payload: 'Your tattoo idea is being saved. Artist will see it after receiving the deposit' 
        });
        
        // 发送预订草稿邮件
        console.log('📧 发送预订草稿邮件（不需要咨询）...');
        console.log('📋 发送的预订数据:', completeBookingData);
        
        try {
          const emailResult = await sendBookingDraftEmail(completeBookingData);
          if (emailResult.success) {
            console.log('✅ 预订草稿邮件发送成功');
          } else {
            console.warn('⚠️ 预订草稿邮件发送失败:', emailResult.error);
          }
        } catch (emailError) {
          console.error('❌ 邮件发送出错:', emailError);
        }
        
        // 延迟跳转到支付页面，让用户看到通知
        setTimeout(() => {
          dispatch({ type: 'SET_STEP', payload: 9 });
        }, 2000);
      }

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
        <h1 className="text-3xl font-bold text-stone-900 mb-4">
          Do you need a 1-1 consultation?
        </h1>
        <p className="text-stone-600 max-w-2xl mx-auto text-lg">
          Consultation is a 30 min 1-on-1 Zoom call with your selected artist to confirm design details.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Yes Option - 低亮显示 */}
        <div 
          onClick={() => handleConsultationChoice(true)}
          className="bg-white border-2 border-neutral-200 rounded-lg p-6 cursor-pointer hover:border-neutral-300 hover:shadow-md transition-all duration-200 group"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-neutral-200 transition-colors">
              <MessageCircle className="w-8 h-8 text-stone-600" />
            </div>
            <h3 className="text-xl font-semibold text-stone-800 mb-3">
              Yes I need help
            </h3>
            <p className="text-stone-600 mb-4">
              Schedule a consultation call to discuss your tattoo idea in detail and get personalized advice.
            </p>
            <p className="text-sm text-stone-500 mb-4">
              Please get all your reference photos ready.
            </p>
            <div className="flex items-center justify-center text-stone-700 group-hover:text-stone-900">
              <span className="mr-2">Schedule consultation</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* No Option - 高亮显示 */}
        <div 
          onClick={() => handleConsultationChoice(false)}
          className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-6 cursor-pointer hover:bg-yellow-100 hover:border-yellow-600 hover:shadow-lg transition-all duration-200 group"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-500 transition-colors">
              <ArrowRight className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-yellow-900 mb-3">
              No need thanks
            </h3>
            <p className="text-yellow-800 mb-4">
              I'm confident about my tattoo idea and ready to proceed directly to booking and payment.
            </p>
            <p className="text-sm text-yellow-600 mb-4">
              Your artist will confirm the design details with you via email.
            </p>
            <div className="flex items-center justify-center text-yellow-700 group-hover:text-yellow-900 font-medium">
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
          className="px-6 py-2 border border-neutral-300 rounded-md text-stone-700 hover:bg-neutral-50 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ConsultationChoice;