import React, { useEffect, useRef, useState, useCallback } from 'react';

// Square Web Payments SDK 类型声明
declare global {
  interface Window {
    Square: any;
  }
}

interface SquarePaymentFormProps {
  amount: number;
  onPaymentSuccess: (result: any) => void;
  onPaymentError: (error: string) => void;
  isProcessing: boolean;
}

// 生产环境配置
const SQUARE_CONFIG = {
  applicationId: 'sq0idp-61JupY7sD36gBpBm8SYy2Q',
  locationId: 'LHWGABJMFKASZ',
  environment: 'production'
};

const SquarePaymentForm: React.FC<SquarePaymentFormProps> = ({
  amount,
  onPaymentSuccess,
  onPaymentError,
  isProcessing
}) => {
  const [payments, setPayments] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const initializationAttempted = useRef(false);

  // 重置函数
  const resetPaymentForm = useCallback(() => {
    setCard(null);
    setPayments(null);
    setIsInitializing(false);
    setInitError(null);
    initializationAttempted.current = false;
  }, []);

  // 加载Square SDK
  useEffect(() => {
    const loadSquareSDK = async () => {
      try {
        if (window.Square) {
          console.log('Square SDK already loaded');
          setIsSDKLoaded(true);
          return;
        }

        console.log('Loading Square SDK...');
        
        // 移除可能存在的旧脚本
        const existingScript = document.querySelector('script[src*="square"]');
        if (existingScript) {
          existingScript.remove();
        }

        const script = document.createElement('script');
        script.src = 'https://web.squarecdn.com/v1/square.js';
        script.async = true;
        
        script.onload = () => {
          console.log('Square SDK loaded successfully');
          setIsSDKLoaded(true);
        };
        
        script.onerror = (error) => {
          console.error('Failed to load Square SDK:', error);
          setInitError('Failed to load payment system. Please refresh the page and try again.');
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error('Error loading Square SDK:', error);
        setInitError('Failed to initialize payment system');
      }
    };

    loadSquareSDK();

    // 清理函数
    return () => {
      resetPaymentForm();
    };
  }, [resetPaymentForm]);

  // 初始化Square支付
  useEffect(() => {
    if (!isSDKLoaded || !window.Square || isInitializing || initializationAttempted.current) {
      return;
    }

    const initializeSquarePayments = async () => {
      initializationAttempted.current = true;
      setIsInitializing(true);
      setInitError(null);
      
      try {
        console.log('Initializing Square Payments with config:', {
          applicationId: SQUARE_CONFIG.applicationId,
          locationId: SQUARE_CONFIG.locationId,
          environment: SQUARE_CONFIG.environment
        });
        
        // 检查container是否存在
        if (!cardContainerRef.current) {
          throw new Error('Card container not found');
        }

        // 清空container
        cardContainerRef.current.innerHTML = '';
        
        const paymentsInstance = window.Square.payments(
          SQUARE_CONFIG.applicationId,
          SQUARE_CONFIG.locationId
        );

        if (!paymentsInstance) {
          throw new Error('Failed to create payments instance');
        }

        console.log('Creating card instance...');
        const cardInstance = await paymentsInstance.card({
          style: {
            '.input-container': {
              borderColor: '#d1d5db',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '16px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              backgroundColor: '#ffffff'
            },
            '.input-container.is-focus': {
              borderColor: '#3b82f6',
              borderWidth: '2px',
              outline: 'none'
            },
            '.input-container.is-error': {
              borderColor: '#ef4444',
              borderWidth: '2px'
            },
            '.message-text': {
              color: '#ef4444',
              fontSize: '14px',
              marginTop: '8px'
            },
            '.message-icon': {
              color: '#ef4444'
            }
          }
        });

        if (!cardInstance) {
          throw new Error('Failed to create card instance');
        }

        console.log('Attaching card to container...');
        await cardInstance.attach('#card-container');
        console.log('Card attached successfully');

        setPayments(paymentsInstance);
        setCard(cardInstance);

      } catch (error) {
        console.error('Square initialization error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setInitError(`Failed to initialize payment form: ${errorMessage}. Please refresh the page and try again.`);
        initializationAttempted.current = false; // 允许重试
      } finally {
        setIsInitializing(false);
      }
    };

    // 添加小延迟确保DOM完全加载
    const timer = setTimeout(initializeSquarePayments, 100);
    
    return () => clearTimeout(timer);
  }, [isSDKLoaded]);

  const handlePayment = async () => {
    if (!card || !payments) {
      onPaymentError('Payment system not ready. Please wait a moment and try again.');
      return;
    }

    try {
      console.log('Processing payment...');
      
      const result = await card.tokenize();
      
      if (result.status === 'OK') {
        console.log('Payment token generated successfully');
        
        const paymentData = {
          source_id: result.token,
          amount_money: {
            amount: amount * 100,
            currency: 'USD'
          },
          location_id: SQUARE_CONFIG.locationId,
          idempotency_key: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };

        const paymentResult = await processPayment(paymentData);
        console.log('Payment processed successfully:', paymentResult);
        onPaymentSuccess(paymentResult);
        
      } else {
        console.error('Tokenization failed:', result.errors);
        let errorMessage = 'Payment failed. Please check your card information and try again.';
        
        if (result.errors && result.errors.length > 0) {
          const error = result.errors[0];
          switch (error.code) {
            case 'INVALID_CARD_DATA':
              errorMessage = 'Please check your card number and try again.';
              break;
            case 'CARD_EXPIRED':
              errorMessage = 'Your card has expired. Please use a different card.';
              break;
            case 'CVV_FAILURE':
              errorMessage = 'Please check your CVV code and try again.';
              break;
            case 'ADDRESS_VERIFICATION_FAILURE':
              errorMessage = 'Please verify your billing address.';
              break;
            default:
              errorMessage = error.detail || errorMessage;
          }
        }
        
        onPaymentError(errorMessage);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      onPaymentError('Payment failed. Please try again or contact support.');
    }
  };

  const processPayment = async (paymentData: any) => {
    // 模拟支付处理
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          resolve({
            payment: {
              id: `sq_payment_${Date.now()}`,
              status: 'COMPLETED',
              amount: paymentData.amount_money.amount,
              currency: paymentData.amount_money.currency,
              created_at: new Date().toISOString(),
              receipt_url: `https://squareup.com/receipt/preview/${Date.now()}`
            },
            success: true
          });
        } else {
          reject(new Error('Payment declined by bank'));
        }
      }, 2000);
    });
  };

  const handleRetry = () => {
    resetPaymentForm();
    setIsSDKLoaded(false);
    // 触发重新加载
    window.location.reload();
  };

  if (initError) {
    return (
      <div className="border-2 border-red-200 rounded-lg p-6 bg-red-50">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.963-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-800 mb-2">Payment System Error</h3>
          <p className="text-sm text-red-700 mb-4">{initError}</p>
          <button
            onClick={handleRetry}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!isSDKLoaded || isInitializing) {
    return (
      <div className="border-2 border-blue-200 rounded-lg p-8 bg-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-800 font-medium">
            {!isSDKLoaded ? 'Loading payment system...' : 'Initializing secure payment...'}
          </p>
          <p className="text-blue-600 text-sm mt-2">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 支付表单 */}
      <div className="border-2 border-blue-500 rounded-lg p-6 bg-blue-50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-lg">Credit Card</div>
              <div className="text-sm text-gray-600">Secure payment with Square</div>
            </div>
          </div>
          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Square 卡片表单容器 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div 
            id="card-container"
            ref={cardContainerRef}
            className="min-h-[120px] bg-white rounded-lg border border-gray-300"
            style={{ minHeight: '120px' }}
          />
        </div>

        {/* 支付按钮 */}
        <button
          onClick={handlePayment}
          disabled={isProcessing || !card}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
            isProcessing || !card
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing Payment...
            </div>
          ) : (
            `Pay ${amount} Deposit`
          )}
        </button>
      </div>

      {/* 安全信息 */}
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Your payment information is secure and encrypted</span>
        </div>
        
        <div className="flex items-center justify-center gap-4 opacity-60">
          <span className="text-sm text-gray-500">We accept:</span>
          <div className="flex gap-2">
            <div className="text-xs bg-gray-100 px-2 py-1 rounded">VISA</div>
            <div className="text-xs bg-gray-100 px-2 py-1 rounded">Mastercard</div>
            <div className="text-xs bg-gray-100 px-2 py-1 rounded">Amex</div>
            <div className="text-xs bg-gray-100 px-2 py-1 rounded">Discover</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SquarePaymentForm;
