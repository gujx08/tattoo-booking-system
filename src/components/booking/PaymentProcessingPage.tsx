import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Loader2, CreditCard } from 'lucide-react';

const PaymentProcessingPage: React.FC = () => {
  const { dispatch } = useApp();

  useEffect(() => {
    // 模拟支付处理时间 (3秒)
    const timer = setTimeout(() => {
      // 70%成功率，30%失败率 - 模拟真实支付场景
      const isSuccess = Math.random() > 0.3;
      
      if (isSuccess) {
        dispatch({ type: 'SET_STEP', payload: 10 }); // 成功页面
      } else {
        dispatch({ type: 'SET_STEP', payload: 12 }); // 失败页面
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        {/* 动画图标 */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <CreditCard className="w-16 h-16 text-blue-500" />
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin absolute -top-2 -right-2" />
          </div>
        </div>

        {/* 标题和说明 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Processing Your Payment
        </h1>
        
        <p className="text-gray-600 mb-6">
          Please wait while we securely process your payment. This may take a few moments.
        </p>

        {/* 进度指示器 */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
        </div>

        {/* 安全提示 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-medium">🔒 Secure Payment:</span> Your payment information is encrypted and secure. Please do not close this window or navigate away.
          </p>
        </div>

        {/* 加载动画点 */}
        <div className="flex justify-center mt-6 space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessingPage;