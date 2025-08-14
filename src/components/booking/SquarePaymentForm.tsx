import React, { useEffect, useRef, useState } from 'react';
import { CreditCard, AlertCircle } from 'lucide-react';

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
  const [loadingState, setLoadingState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const cardInstanceRef = useRef<any>(null);
  const paymentsInstanceRef = useRef<any>(null);
  const initializationTimeoutRef = useRef<NodeJS.Timeout>();

  // 清理函数
  const cleanup = () => {
    if (initializationTimeoutRef.current) {
      clearTimeout(initializationTimeoutRef.current);
    }
    if (cardInstanceRef.current) {
      try {
        cardInstanceRef.current.destroy();
      } catch (e) {
        // 忽略清理错误
      }
      cardInstanceRef.current = null;
    }
  };

  useEffect(() => {
    initializeSquarePayment();
    return cleanup;
  }, [retryCount]);

  const initializeSquarePayment = async () => {
    console.log(`🚀 Square 初始化尝试 #${retryCount + 1}`);
    
    setLoadingState('loading');
    setErrorMessage('');
    
    // 设置超时
    initializationTimeoutRef.current = setTimeout(() => {
      console.error('❌ Square 初始化超时');
      setErrorMessage('Payment system loading timeout');
      setLoadingState('error');
    }, 10000); // 10秒超时

    try {
      // Step 1: 等待DOM准备好
      if (!cardContainerRef.current) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (!cardContainerRef.current) {
          throw new Error('Card container not available');
        }
      }

      // Step 2: 加载Square SDK
      const square = await loadSquareSDK();
      console.log('✅ Square SDK 加载完成');

      // Step 3: 初始化Payments
      const payments = square.payments(applicationId, locationId);
      paymentsInstanceRef.current = payments;
      console.log('✅ Square Payments 初始化完成');

      // Step 4: 创建Card组件
      const card = await payments.card({
        style: {
          '.input-container': {
            borderRadius: '6px',
            borderWidth: '1px',
            borderColor: '#d1d5db',
            padding: '12px',
            backgroundColor: '#ffffff',
          },
          '.input-container.is-focus': {
            borderColor: '#3b82f6',
          },
          '.input-container.is-error': {
            borderColor: '#ef4444',
          },
          '.message-text': {
            color: '#ef4444',
            fontSize: '14px',
          },
          'input': {
            fontSize: '16px',
            color: '#111827',
          },
        }
      });
      console.log('✅ Square Card 组件创建完成');

      // Step 5: 附加到容器
      await card.attach(cardContainerRef.current);
      cardInstanceRef.current = card;
      console.log('✅ Square Card 附加完成');

      // 清除超时
      if (initializationTimeoutRef.current) {
        clearTimeout(initializationTimeoutRef.current);
      }

      setLoadingState('ready');
      console.log('🎉 Square 初始化完全成功');

    } catch (error: any) {
      console.error('❌ Square 初始化失败:', error);
      
      // 清除超时
      if (initializationTimeoutRef.current) {
        clearTimeout(initializationTimeoutRef.current);
      }
      
      setErrorMessage(error.message || 'Failed to initialize payment form');
      setLoadingState('error');
    }
  };

  const loadSquareSDK = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      // 如果已经加载，直接返回
      if ((window as any).Square) {
        resolve((window as any).Square);
        return;
      }

      // 创建script标签
      const script = document.createElement('script');
      script.src = 'https://sandbox.web.squarecdn.com/v1/square.js';
      script.async = true;
      
      script.onload = () => {
        if ((window as any).Square) {
          resolve((window as any).Square);
        } else {
          reject(new Error('Square SDK loaded but not available'));
        }
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Square SDK'));
      };
      
      document.head.appendChild(script);
      
      // 备用超时
      setTimeout(() => {
        reject(new Error('Square SDK loading timeout'));
      }, 8000);
    });
  };

  const handlePayment = async () => {
    if (!cardInstanceRef.current || isProcessing) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      console.log('💳 开始支付处理');

      const tokenResult = await cardInstanceRef.current.tokenize();
      
      if (tokenResult.status === 'OK') {
        console.log('✅ 令牌获取成功');
        
        // 模拟支付处理
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const paymentResult = {
          success: true,
          paymentId: `square_${Date.now()}`,
          token: tokenResult.token,
          amount: amount
        };

        console.log('✅ 支付处理完成');
        onPaymentSuccess(paymentResult);
        
      } else {
        const error = tokenResult.errors?.[0]?.message || 'Invalid card information';
        throw new Error(error);
      }

    } catch (error: any) {
      console.error('❌ 支付失败:', error);
      setErrorMessage(error.message);
      onPaymentError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    cleanup();
    setRetryCount(prev => prev + 1);
  };

  // 加载状态
  if (loadingState === 'loading') {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Card Information
          </label>
          <div className="min-h-[60px] border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Initializing secure payment form...</span>
            </div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (loadingState === 'error') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800">Payment form failed to load</h4>
              <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
              <button 
                onClick={handleRetry}
                className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again ({retryCount + 1}/3)
              </button>
            </div>
          </div>
        </div>
        
        {retryCount >= 2 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Alternative:</strong> You can use Demo Mode to complete your booking and we'll process payment manually.
            </p>
          </div>
        )}
      </div>
    );
  }

  // 成功状态 - 显示支付表单
  return (
    <div className="space-y-4">
      {/* Square Card Container */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Card Information
        </label>
        <div 
          ref={cardContainerRef}
          className="min-h-[60px] border border-gray-300 rounded-lg bg-white"
        />
      </div>

      {/* 错误显示 */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* 测试卡信息 */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800 font-medium mb-1">Test Mode - Use these test cards:</p>
        <div className="text-xs text-blue-700 grid grid-cols-2 gap-x-4 gap-y-1">
          <div><strong>Visa:</strong> 4111 1111 1111 1111</div>
          <div><strong>Expiry:</strong> 12/25</div>
          <div><strong>Mastercard:</strong> 5555 5555 5555 4444</div>
          <div><strong>CVV:</strong> 123</div>
        </div>
      </div>

      {/* 支付按钮 */}
      <button
        onClick={handlePayment}
        disabled={disabled || isProcessing}
        className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-lg transition-colors ${
          disabled || isProcessing
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

      {/* 安全提示 */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          🔒 Your payment information is secure and encrypted
        </p>
      </div>
    </div>
  );
};

export default SquarePaymentForm;
