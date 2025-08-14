import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  const [status, setStatus] = useState<'waiting' | 'loading' | 'ready' | 'error'>('waiting');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const cardInstanceRef = useRef<any>(null);
  const paymentsInstanceRef = useRef<any>(null);
  const isMountedRef = useRef(true);

  // 清理函数
  const cleanup = useCallback(() => {
    if (cardInstanceRef.current) {
      try {
        cardInstanceRef.current.destroy();
      } catch (e) {
        console.log('Card cleanup error (safe to ignore):', e);
      }
      cardInstanceRef.current = null;
    }
  }, []);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  // 等待DOM准备好，然后开始初始化
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isMountedRef.current && cardContainerRef.current) {
        console.log('🚀 DOM准备就绪，开始Square初始化');
        initializeSquarePayment();
      } else {
        console.error('❌ DOM未准备好');
        setErrorMessage('Payment form container not ready');
        setStatus('error');
      }
    }, 1000); // 增加延迟确保DOM完全渲染

    return () => clearTimeout(timer);
  }, [retryCount]);

  const initializeSquarePayment = async () => {
    if (!isMountedRef.current) return;
    
    console.log(`🔄 Square初始化开始 (尝试 ${retryCount + 1})`);
    setStatus('loading');
    setErrorMessage('');

    try {
      // 1. 再次检查容器
      if (!cardContainerRef.current) {
        throw new Error('Card container ref not available');
      }

      console.log('✅ 容器检查通过');

      // 2. 加载Square SDK
      const square = await loadSquareSDK();
      if (!isMountedRef.current) return;
      
      console.log('✅ Square SDK加载成功');

      // 3. 创建Payments实例
      const payments = square.payments(applicationId, locationId);
      paymentsInstanceRef.current = payments;
      
      console.log('✅ Payments实例创建成功');

      // 4. 创建Card组件
      const card = await payments.card({
        style: {
          '.input-container': {
            borderRadius: '8px',
            borderWidth: '1px',
            borderColor: '#d1d5db',
            padding: '16px',
            backgroundColor: '#ffffff',
            fontSize: '16px',
          },
          '.input-container.is-focus': {
            borderColor: '#3b82f6',
            boxShadow: '0 0 0 1px #3b82f6',
          },
          '.input-container.is-error': {
            borderColor: '#ef4444',
          },
          '.message-text': {
            color: '#ef4444',
            fontSize: '14px',
            marginTop: '8px',
          },
          'input': {
            fontSize: '16px',
            fontFamily: 'system-ui, sans-serif',
            color: '#111827',
          },
        }
      });

      if (!isMountedRef.current) return;
      console.log('✅ Card组件创建成功');

      // 5. 附加到DOM
      await card.attach(cardContainerRef.current);
      
      if (!isMountedRef.current) return;
      
      cardInstanceRef.current = card;
      console.log('✅ Card组件附加成功');
      
      setStatus('ready');
      console.log('🎉 Square初始化完全成功');

    } catch (error: any) {
      if (!isMountedRef.current) return;
      
      console.error('❌ Square初始化失败:', error);
      setErrorMessage(error.message || 'Payment form initialization failed');
      setStatus('error');
    }
  };

  const loadSquareSDK = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      // 如果已存在，直接返回
      if ((window as any).Square) {
        resolve((window as any).Square);
        return;
      }

      console.log('📦 开始加载Square SDK...');

      const script = document.createElement('script');
      script.src = 'https://sandbox.web.squarecdn.com/v1/square.js';
      script.async = true;
      
      script.onload = () => {
        console.log('📦 Square SDK脚本加载完成');
        
        // 等待Square对象可用
        const checkSquare = () => {
          if ((window as any).Square) {
            resolve((window as any).Square);
          } else {
            setTimeout(checkSquare, 100);
          }
        };
        
        checkSquare();
      };
      
      script.onerror = () => {
        console.error('❌ Square SDK脚本加载失败');
        reject(new Error('Failed to load Square SDK'));
      };
      
      document.head.appendChild(script);
      
      // 超时保护
      setTimeout(() => {
        reject(new Error('Square SDK loading timeout'));
      }, 15000);
    });
  };

  const handlePayment = async () => {
    if (!cardInstanceRef.current || isProcessing) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      console.log('💳 开始支付处理...');

      const result = await cardInstanceRef.current.tokenize();
      
      if (result.status === 'OK') {
        console.log('✅ 卡信息验证成功');
        
        // 模拟支付处理
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const paymentResult = {
          success: true,
          paymentId: `square_payment_${Date.now()}`,
          token: result.token,
          amount: amount
        };

        console.log('✅ 支付处理完成');
        onPaymentSuccess(paymentResult);
        
      } else {
        const error = result.errors?.[0]?.message || 'Please check your card information';
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
    console.log('🔄 用户触发重试');
    cleanup();
    setRetryCount(prev => prev + 1);
  };

  // 等待状态
  if (status === 'waiting') {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Card Information
          </label>
          <div className="min-h-[70px] border border-gray-300 rounded-lg bg-white flex items-center justify-center">
            <div className="text-gray-500 text-sm">Preparing payment form...</div>
          </div>
        </div>
      </div>
    );
  }

  // 加载状态
  if (status === 'loading') {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Card Information
          </label>
          <div className="min-h-[70px] border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
            <div className="flex items-center space-x-3 text-gray-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-sm">Loading secure payment form...</span>
            </div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Please wait while we initialize the payment system</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (status === 'error') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800 mb-1">
                Payment Form Error
              </h4>
              <p className="text-sm text-red-700 mb-3">{errorMessage}</p>
              
              {retryCount < 2 ? (
                <button 
                  onClick={handleRetry}
                  className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again ({retryCount + 1}/3)
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-red-800 font-medium">
                    Unable to load payment form after multiple attempts.
                  </p>
                  <button 
                    onClick={handleRetry}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors mr-2"
                  >
                    Try Once More
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Alternative:</strong> You can switch to Demo Mode below to complete your booking. 
            We'll contact you separately to process payment.
          </p>
        </div>
      </div>
    );
  }

  // 就绪状态 - 显示支付表单
  return (
    <div className="space-y-4">
      {/* Square Card Container */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Card Information
        </label>
        <div 
          ref={cardContainerRef}
          className="min-h-[70px] border border-gray-300 rounded-lg bg-white"
          style={{ minHeight: '70px' }}
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
        <p className="text-xs text-blue-800 font-medium mb-2">🧪 Test Mode - Use these test cards:</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
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
        className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-lg font-medium transition-colors ${
          disabled || isProcessing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            <span>Pay ${amount}</span>
          </>
        )}
      </button>

      {/* 安全提示 */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          🔒 Your payment information is secure and encrypted by Square
        </p>
      </div>
    </div>
  );
};

export default SquarePaymentForm;
