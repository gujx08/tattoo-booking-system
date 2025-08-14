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
  const mountedRef = useRef(true);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (cardRef.current) {
        try {
          cardRef.current.destroy();
        } catch (e) {
          console.log('Card cleanup error:', e);
        }
      }
    };
  }, []);

  // 初始化Square
  useEffect(() => {
    let initTimer: NodeJS.Timeout;
    
    const startInitialization = () => {
      // 确保组件仍然挂载且容器存在
      if (!mountedRef.current || !containerRef.current) {
        return;
      }
      
      initTimer = setTimeout(() => {
        if (mountedRef.current) {
          loadSquareSDK();
        }
      }, 500); // 增加延迟确保DOM完全准备好
    };

    startInitialization();

    return () => {
      if (initTimer) {
        clearTimeout(initTimer);
      }
    };
  }, []);

  const loadSquareSDK = async () => {
    try {
      if (!mountedRef.current) return;
      
      console.log('🚀 开始加载 Square SDK...');
      
      // 检查容器是否存在
      if (!containerRef.current) {
        console.error('❌ Container ref not available');
        setError('Payment form container not ready');
        setIsLoading(false);
        return;
      }

      // 如果Square SDK已存在，直接初始化
      if (window.Square) {
        console.log('✅ Square SDK 已存在');
        await initializeSquare();
        return;
      }

      // 动态加载Square SDK
      const script = document.createElement('script');
      script.src = 'https://sandbox.web.squarecdn.com/v1/square.js';
      script.async = true;
      
      script.onload = async () => {
        if (!mountedRef.current) return;
        console.log('✅ Square SDK 加载完成');
        
        // 再次延迟确保一切就绪
        setTimeout(async () => {
          if (mountedRef.current) {
            await initializeSquare();
          }
        }, 300);
      };
      
      script.onerror = () => {
        if (!mountedRef.current) return;
        console.error('❌ Square SDK 加载失败');
        setError('Failed to load Square payment system');
        setIsLoading(false);
      };
      
      document.head.appendChild(script);
      
    } catch (err) {
      if (!mountedRef.current) return;
      console.error('❌ Square SDK 加载错误:', err);
      setError('Payment system initialization failed');
      setIsLoading(false);
    }
  };

  const initializeSquare = async () => {
    try {
      if (!mountedRef.current) return;
      
      console.log('🚀 开始初始化 Square Payments...');
      
      if (!window.Square) {
        throw new Error('Square SDK not loaded');
      }

      // 使用容器引用而不是ID
      if (!containerRef.current) {
        throw new Error('Container reference not available');
      }

      console.log('✅ 容器引用检查通过');

      // 初始化 Square Payments
      const payments = window.Square.payments(applicationId, locationId);
      paymentsRef.current = payments;

      console.log('✅ Square Payments 实例创建成功');

      // 创建信用卡支付表单 - 直接使用DOM元素而不是选择器
      const card = await payments.card({
        style: {
          '.input-container': {
            borderColor: '#E5E7EB',
            borderRadius: '6px',
            borderWidth: '1px',
            padding: '12px',
          },
          '.input-container.is-focus': {
            borderColor: '#3B82F6',
            boxShadow: '0 0 0 1px #3B82F6',
          },
          '.input-container.is-error': {
            borderColor: '#EF4444',
          },
          '.message-text': {
            color: '#EF4444',
            fontSize: '14px',
            marginTop: '4px',
          },
          'input': {
            fontSize: '16px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: '#1F2937',
          },
        }
      });

      if (!mountedRef.current) return;

      console.log('✅ Square Card 组件创建成功');

      // 直接附加到DOM元素
      await card.attach(containerRef.current);
      
      if (!mountedRef.current) return;
      
      cardRef.current = card;

      console.log('✅ Square Card 组件附加成功');
      
      setIsReady(true);
      setIsLoading(false);
      setError(null);

    } catch (err: any) {
      if (!mountedRef.current) return;
      
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
        console.log('✅ 获取支付令牌成功');
        
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
      paymentId: 'square_payment_' + Date.now(),
      amount: amount
    };
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setIsReady(false);
    
    // 清理现有的card实例
    if (cardRef.current) {
      try {
        cardRef.current.destroy();
        cardRef.current = null;
      } catch (e) {
        console.log('Card cleanup during retry:', e);
      }
    }
    
    // 重新初始化
    setTimeout(() => {
      if (mountedRef.current) {
        loadSquareSDK();
      }
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Card Information
          </label>
          <div className="min-h-[56px] border border-gray-300 rounded-lg p-3 bg-gray-50 flex items-center justify-center">
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
              <span className="text-sm">Loading payment form...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !isReady) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800 font-medium">Payment form failed to load</p>
          </div>
          <p className="text-sm text-red-700 mb-3">{error}</p>
          <button 
            onClick={handleRetry}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
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
          className="min-h-[56px] border border-gray-300 rounded-lg bg-white"
          style={{ minHeight: '56px' }}
        >
          {/* Square Card component will be attached here */}
        </div>
      </div>

      {/* Error Display */}
      {error && isReady && (
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
            <p>• <strong>Visa:</strong> 4111 1111 1111 1111</p>
            <p>• <strong>Mastercard:</strong> 5555 5555 5555 4444</p>
            <p>• <strong>Expiry:</strong> Any future date (e.g., 12/25)</p>
            <p>• <strong>CVV:</strong> Any 3 digits (e.g., 123)</p>
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
