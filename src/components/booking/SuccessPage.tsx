import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle, Mail, Home } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../common/Button';
// 导入我们的邮件服务
import { sendBookingConfirmationEmail } from '../../services/emailService';

// 全局标记，防止多个组件实例同时发送邮件
// 使用localStorage作为持久化存储，防止页面刷新后重复发送
const getEmailSentGlobal = () => {
  try {
    const stored = localStorage.getItem('emailSentGlobal');
    return stored ? new Set(JSON.parse(stored)) : new Set<string>();
  } catch {
    return new Set<string>();
  }
};

const setEmailSentGlobal = (emailId: string) => {
  try {
    const current = getEmailSentGlobal();
    current.add(emailId);
    localStorage.setItem('emailSentGlobal', JSON.stringify([...current]));
  } catch (error) {
    console.warn('无法保存邮件发送状态到localStorage:', error);
  }
};

const isEmailSentGlobal = (emailId: string) => {
  return getEmailSentGlobal().has(emailId);
};

const SuccessPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const selectedArtist = state.selectedArtist;
  const [emailSent, setEmailSent] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // 使用 ref 来标记是否已经发送过邮件，防止 StrictMode 重复执行
  const hasSentRef = useRef(false);
  const componentMountedRef = useRef(true);

  useEffect(() => {
    // 组件卸载时的清理函数
    return () => {
      componentMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // 创建唯一的邮件标识，基于用户数据而不是时间戳
    const emailId = `${state.formData?.email || 'unknown'}_${state.formData?.name || 'unknown'}_${selectedArtist?.id || 'unknown'}`;
    
    // 多重检查防止重复发送
    if (
      hasSentRef.current || 
      isEmailSentGlobal(emailId) ||
      emailSent || 
      isProcessing ||
      !componentMountedRef.current
    ) {
      console.log('⏭️ 邮件已发送或正在处理中，跳过重复发送');
      return;
    }

    // 检查是否有有效的预约数据
    if (!state.formData?.name || !state.formData?.email) {
      console.warn('❌ 缺少必要数据，跳过邮件发送');
      return;
    }

    // 立即标记为已发送，防止重复
    hasSentRef.current = true;
    setEmailSentGlobal(emailId);
    setIsProcessing(true);

    console.log('🚀 准备发送确认邮件...');
    
    // 延迟执行，确保组件完全挂载
    const timer = setTimeout(() => {
      if (componentMountedRef.current && hasSentRef.current) {
        sendConfirmationEmailSilently(emailId);
      }
    }, 200);

    // 清理函数
    return () => {
      clearTimeout(timer);
    };
  }, []); // 空依赖数组，只在组件挂载时执行一次

  const sendConfirmationEmailSilently = async (emailId: string) => {
    try {
      // 确保组件仍然挂载
      if (!componentMountedRef.current) {
        console.log('🚫 组件已卸载，取消邮件发送');
        return;
      }

      console.log('📤 开始发送邮件流程...');
      console.log('🔍 state.formData:', state.formData);
      console.log('🔍 selectedArtist:', selectedArtist);
      
      const bookingData = {
        name: state.formData?.name || 'Customer',
        email: state.formData?.email || 'test@example.com',
        phone: state.formData?.phone || 'Not provided',
        selectedArtist: selectedArtist?.displayName || selectedArtist?.name || 'Jing',
        tattooIdea: state.formData?.tattooIdea || 'Custom design consultation',
        needsConsultation: state.formData?.needsConsultation ? 'Yes' : 'No',
        consultationDate: state.formData?.consultationDate || 'To be scheduled',
        consultationTime: state.formData?.consultationTime || 'To be scheduled',
        placement: state.formData?.placement || 'To be discussed',
        colorPreference: state.formData?.colorPreference || 'To be discussed'
      };

      console.log('📨 准备发送的邮件数据:', bookingData);
      
      const result = await sendBookingConfirmationEmail(bookingData);
      
      // 确保组件仍然挂载再更新状态
      if (!componentMountedRef.current) return;
      
      if (result.success) {
        console.log('✅ 邮件发送成功！');
        setEmailSent(true);
      } else {
        console.warn('⚠️ 邮件发送失败:', result.error);
        // 发送失败时移除标记，允许重试
        // 注意：由于使用localStorage，这里不删除标记，避免重复发送
        hasSentRef.current = false;
        setEmailSent(false);
      }
      
    } catch (error) {
      console.error('❌ 邮件发送异常:', error);
      
      // 确保组件仍然挂载再处理错误
      if (!componentMountedRef.current) return;
      
      // 发送异常时不删除localStorage标记，避免重复发送
      hasSentRef.current = false;
      setEmailSent(false);
    } finally {
      // 确保组件仍然挂载再更新状态
      if (componentMountedRef.current) {
        setIsProcessing(false);
      }
    }
  };

  const handleBackHome = () => {
    // 清理localStorage中的邮件发送标记
    try {
      localStorage.removeItem('emailSentGlobal');
    } catch (error) {
      console.warn('清理邮件发送标记失败:', error);
    }
    
    dispatch({ type: 'RESET_FORM' });
    dispatch({ type: 'SET_STEP', payload: 1 }); // 跳转到纹身师选择页面
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
          <CheckCircle className="w-12 h-12" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Booking Successful!
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          Your tattoo appointment has been confirmed
        </p>
      </div>

      {/* 预约摘要 */}
      {(state.formData?.name || selectedArtist) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{state.formData?.name || 'Customer'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Artist:</span>
              <span className="font-medium">{selectedArtist?.displayName || selectedArtist?.name || 'Jing'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{state.formData?.email || 'Will be updated'}</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600 mt-1">
                {emailSent ? (
                  <span className="text-green-600 font-medium">
                    ✅ Confirmation email sent successfully!
                  </span>
                ) : isProcessing ? (
                  <span className="text-blue-600 font-medium">
                    📤 Sending confirmation email...
                  </span>
                ) : (
                  <span className="text-gray-600">
                    Confirmation emails are being sent to your artist.
                  </span>
                )}
                {emailSent && (
                  <span className="block mt-1 text-gray-500">
                    If you don't receive an email within 5 minutes, please contact us at info@patchtattootherapy.com
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          What's Next?
        </h3>
        
        <div className="space-y-3 text-sm text-blue-800">
          <p>• Your artist will review your tattoo request ASAP.</p>
          <p>• You'll receive an email from your artist with consultation invite or design feedback.</p>
          <p>• Confirm the design details with your artist via consultation or email.</p>
          <p>• Schedule your tattoo session once the design details are confirmed.</p>
          <p className="font-medium mt-4">Reminder: if you didn't receive a confirmation email, or an email from your artist, pls contact us.</p>
        </div>
      </div>

      <div className="text-center">
        <Button onClick={handleBackHome} size="lg" className="inline-flex items-center">
          <Home className="w-4 h-4 mr-2" />
          Book Another Appointment
        </Button>
      </div>

      {/* 开发调试信息 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>🛡️ 防重复机制:</strong> 多重保护已启用
          </p>
          <p className="text-sm text-green-800 mt-1">
            <strong>📊 发送状态:</strong> 
            {emailSent ? ' ✅ 已发送' : isProcessing ? ' 🔄 发送中...' : ' ⏳ 待发送'}
          </p>
          <p className="text-sm text-green-800 mt-1">
            <strong>🔒 保护状态:</strong> Ref={hasSentRef.current ? '已标记' : '未标记'} | 
            挂载={componentMountedRef.current ? '是' : '否'}
          </p>
        </div>
      )}
    </div>
  );
};

export default SuccessPage;