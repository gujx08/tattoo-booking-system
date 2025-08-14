import React, { useEffect, useRef, useState } from 'react';
import { CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

// Square SDK 类型定义
declare global {
  interface Window {
    Square?: any;
  }
}

interface SquarePaymentFormProps {
  applicationId: string;
  locationId: string;
  environment: 'sandbox' | 'production';
  amount: number;
  onPaymentSuccess: (result: any) => void;
  onPaymentError: (error: any) => void;
  disabled?: boolean;
}

const SquarePaymentForm: React.FC<SquarePaymentFormProps> = ({
  applicationId,
  locationId,
  environment,
  amount,
  onPaymentSuccess,
  onPaymentError,
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  const paymentsRef = useRef<any>(null);
  const cardRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 确保DOM元素存在后再初始化Square
  useEffect(() => {
    // 延迟确保DOM完全渲染
    const initTimer = setTimeout(() => {
      loadSquareSDK();
    }, 100);

    return () => clearTimeout(initTimer);
  }, []);

  const loadSquareSDK = async () => {
    try {
      console.log('🚀 开始加载 Square SDK...');
      
      // 检查DOM元素是否存在
      if (!containerRef.current) {
        console.error('❌ Card container element not found');
        setError('Payment form container not ready');
        setIsLoading(false);
        return;
      }

      // 检查是否已经加载了Square SDK
      if (window.Square) {
        console.log('✅ Square SDK 已存在，直接初始化');
        await initializeSquare();
        return;
      }

      // 动态加载Square SDK
      const script = document.createElement('script');
      script.src = 'https://sandbox.web.squarecdn.com/v1/square.js';
      script.async = true;
      script.onload = async () => {
        console.log('✅ Square SDK 加载成功');
        // 再次延迟确保一切就绪
        setTimeout(async () => {
          await initializeSquare();
        }, 200);
      };
      script.onerror = () => {
        console.error('❌ Square SDK 加载失败');
        setError('Failed to load Square payment system');
        setIsLoading(false);
      };
      
      document.head.appendChild(script);
    } catch (err) {
      console.error('❌ Square SDK 初始化错误:', err);
      setError('Payment system initialization failed');
      setIsLoading(false);
    }
  };

  const initializeSquare = async () => {
    try {
      console.log('🚀 初始化 Square Payments...');
      
      if (!window.Square) {
        throw new Error('Square SDK not loaded');
      }

      // 再次检查DOM元素
      const cardContainer = document.getElementById('card-container');
      if (!cardContainer) {
        console.error('❌ #card-container 元素未找到');
        throw new Error('Card container element not found');
      }

      console.log('✅ DOM 元素检查通过，开始初始化 Payments');

      // 初始化 Square Payments
      const payments = window.Square.payments(applicationId, locationId);
      paymentsRef.current = payments;

      console.log('✅ Square Payments 实例创建成功');

      // 创建信用卡支付表单
      const card = await payments.card({
        style: {
          '.input-container': {
            borderColor: '#E5E7EB',
            borderRadius: '8px',
            borderWidth: '1px',
          },
          '.input-container.is-focus': {
            borderColor: '#3B82F6',
          },
          '.input-container.is-error': {
            borderColor: '#EF4444',
          },
          '.message-text': {
            color: '#EF4444',
            fontSize: '12px',
          },
          '.message-icon': {
            color: '#EF4444',
          },
          'input': {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
          },
        }
      });

      console.log('✅ Square Card 组件创建成功');

      // 附加到DOM
      await card.attach('#card-container');
      cardRef.current = card;

      console.log('✅ Square Card 组件附加成功');
      setIsReady(true);
      setIsLoading(false);
      setError(null);

    } catch (err: any) {
      console.error('❌ Square 初始化失败:', err);
      setError(`Initialization failed: ${err.message}`);
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!cardRef.current || !paymentsRef.current || isProcessing) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      console.log('💳 开始处理支付...');

      // 请求支付令牌
      const result = await cardRef.current.tokenize();
      
      if (result.status === 'OK') {
        console.log('✅ 获取支付令牌成功:', result.token);
        
        // 模拟服务器端支付处理
        const paymentResult = await processPayment(result.token, amount);
        
        if (paymentResult.success) {
          console.log('✅ 支付处理成功');
          onPaymentSuccess({
            token: result.token,
            paymentId: paymentResult.paymentId,
            amount: amount
          });
        } else {
          throw new Error(paymentResult.error || 'Payment processing failed');
        }
        
      } else {
        console.error('❌ 令牌化失败:', result.errors);
        const errorMessage = result.errors?.[0]?.message || 'Invalid card information';
        throw new Error(errorMessage);
      }

    } catch (err: any) {
      console.error('❌ 支付处理错误:', err);
      setError(err.message || 'Payment failed');
      onPaymentError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // 模拟服务器端支付处理
  const processPayment = async (token: string, amount: number) => {
    console.log('🔄 模拟服务器端支付处理...');
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 模拟成功响应
    return {
      success: true,
      paymentId: 'test_payment_' + Date.now(),
      amount: amount
    };
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-10 bg-gray-200 rounded-lg"></div>
        </div>
        <p className="text-sm text-gray-600 text-center">Loading payment form...</p>
      </div>
    );
  }

  if (error && !isReady) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
        <button 
          onClick={() => {
            setError(null);
            setIsLoading(true);
            loadSquareSDK();
          }} 
          className="mt-2 text-sm text-red-600 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Square Card Container */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Card Information
        </label>
        <div 
          ref={containerRef}
          id="card-container" 
          className="min-h-[56px] border border-gray-300 rounded-lg p-3 bg-white"
        >
          {/* Square Card component will be attached here */}
          {!isReady && (
            <div className="flex items-center justify-center h-12 text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
              Initializing payment form...
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Test Cards Info */}
      {isReady && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800 font-medium mb-1">Test Mode - Use these test cards:</p>
          <div className="text-xs text-blue-700 space-y-1">
            <p>• Visa: 4111 1111 1111 1111</p>
            <p>• Mastercard: 5555 5555 5555 4444</p>
            <p>• Any future expiry date and any CVV</p>
          </div>
        </div>
      )}

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={disabled || !isReady || isProcessing}
        className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-lg transition-colors ${
          disabled || !isReady || isProcessing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span className="font-medium">Processing Payment...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            <span className="font-medium">Pay ${amount}</span>
          </>
        )}
      </button>

      {/* Security Info */}
      {isReady && (
        <div className="text-center">
          <p className="text-xs text-gray-500">
            🔒 Your payment information is secure and encrypted
          </p>
        </div>
      )}
    </div>
  );
};

export default SquarePaymentForm;
