import React from 'react';
import { useApp } from '../../context/AppContext';
import { XCircle, RefreshCw, MessageCircle } from 'lucide-react';
import Button from '../common/Button';

const PaymentFailedPage: React.FC = () => {
  const { dispatch } = useApp();

  const handleRetryPayment = () => {
    dispatch({ type: 'SET_STEP', payload: 9 }); // 返回支付页面
  };

  const handleContactSupport = () => {
    // 在真实应用中，这里会打开客服聊天或跳转到联系页面
    window.open('mailto:info@patchtattootherapy.com?subject=Payment Issue - Booking Support', '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        {/* 失败图标 */}
        <div className="flex justify-center mb-6">
          <XCircle className="w-16 h-16 text-red-500" />
        </div>

        {/* 标题和说明 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Failed
        </h1>
        
        <p className="text-gray-600 mb-6">
          We were unable to process your payment. This could be due to insufficient funds, 
          card restrictions, or a temporary issue with your payment method.
        </p>

        {/* 常见原因 */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-medium text-red-800 mb-2">Common reasons for payment failure:</h3>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• Insufficient funds in your account</li>
            <li>• Card expired or blocked</li>
            <li>• Incorrect billing information</li>
            <li>• Bank security restrictions</li>
            <li>• Network connectivity issues</li>
          </ul>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-4">
          {/* 重试支付 */}
          <Button 
            onClick={handleRetryPayment}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Try Again</span>
          </Button>

          {/* 联系客服 */}
          <Button 
            onClick={handleContactSupport}
            variant="outline"
            className="w-full flex items-center justify-center space-x-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Contact Support</span>
          </Button>
        </div>

        {/* 客服信息 */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Need help?</span> Contact us at{' '}
            <a href="mailto:info@patchtattootherapy.com" className="text-blue-600 hover:underline">
              info@patchtattootherapy.com
            </a>{' '}
            or call{' '}
            <a href="tel:818-857-7937" className="text-blue-600 hover:underline">
              (818) 857-7937
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;