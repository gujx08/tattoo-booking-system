import React, { useEffect, useRef, useState } from 'react';

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
  applicationId: 'sq0idp-61JupY7sD36gBpBm8SYy2Q', // 你的生产环境Application ID
  locationId: 'LHWGABJMFKASZ', // 你的Location ID
  environment: 'production' // 生产环境
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
  const cardContainerRef = useRef<HTMLDivElement>(null);

  // 加载Square SDK
  useEffect(() => {
    const loadSquareSDK = async () => {
      try {
        // 检查SDK是否已加载
        if (window.Square) {
          console.log('Square SDK already loaded');
          setIsSDKLoaded(true);
          return;
        }

        console.log('Loading Square SDK...');
        
        // 动态加载Square SDK - 生产环境URL
        const script = document.createElement('script');
        script.src = 'https://web.squarecdn.com/v1/square.js';
        
        script.onload = () => {
          console.log('Square SDK loaded successfully');
          setIsSDKLoaded(true);
        };
        
        script.onerror = () => {
          console.error('Failed to load Square SDK');
          onPaymentError('Failed to load payment system. Please refresh the page and try again.');
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error('Error loading Square SDK:', error);
        onPaymentError('Failed to initialize payment system');
      }
    };

    loadSquareSDK();
  }, [onPaymentError]);

  // 初始化Square支付
  useEffect(() => {
    if (!isSDKLoaded || !window.Square || isInitializing) return;

    const initializeSquarePayments = async () => {
      setIsInitializing(true);
      
      try {
        console.log('Initializing Square Payments with production config...');
        
        const paymentsInstance = window.Square.payments(
          SQUARE_CONFIG.applicationId,
          SQUARE_CONFIG.locationId
        );

        const cardInstance = await paymentsInstance.card({
          style: {
            '.input-container': {
              borderColor: '#d1d5db',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '16px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            },
            '.input-container.is-focus': {
              borderColor: '#3b82f6',
              borderWidth: '2px'
            },
            '.input-container.is-error': {
              borderColor: '#ef4444',
              borderWidth: '2px'
            },
            '.message-text': {
              color: '#ef4444',
              fontSize: '14px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            },
            '.message-icon': {
              color: '#ef4444',
            }
          }
        });

        if (cardContainerRef.current) {
          await cardInstance.attach('#card-container');
          console.log('Card widget attached successfully');
        }

        setPayments(paymentsInstance);
        setCard(cardInstance);

      } catch (error) {
        console.error('Square initialization error:', error);
        onPaymentError('Failed to initialize payment form. Please refresh the page and try again.');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeSquarePayments();
  }, [isSDKLoaded, onPaymentError, isInitializing]);

  const handlePayment = async () => {
    if (!card || !payments) {
      onPaymentError('Payment system not ready. Please wait a moment and try again.');
      return;
    }

    try {
      console.log('Processing payment...');
      
      // 获取支付token
      const result = await card.tokenize();
      
      if (result.status === 'OK') {
        console.log('Payment token generated successfully');
        
        // 发送到后端进行实际支付处理
        const paymentData = {
          source_id: result.token,
          amount_money: {
            amount: amount * 100, // Square uses cents
            currency: 'USD'
          },
          location_id: SQUARE_CONFIG.locationId,
          idempotency_key: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };

        // 这里需要调用你的后端API来处理实际支付
        // 现在我们模拟成功响应 - 在生产环境中你需要实现后端API
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

  // 模拟支付处理 - 在生产环境中需要替换为真实的后端API调用
  const processPayment = async (paymentData: any) => {
    // 这里应该调用你的后端API
    // 例如: const response = await fetch('/api/process-payment', { method: 'POST', body: JSON.stringify(paymentData) });
    
    // 现在返回模拟成功响应
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          payment: {
            id: `sq_payment_${Date.now()}`,
            status: 'COMPLETED',
            amount: paymentData.amount_money.amount,
            currency: paymentData.amount_money.currency,
            created_at: new Date().toISOString()
          },
          success: true
        });
      }, 2000); // 模拟网络延迟
    });
  };

  if (!isSDKLoaded || isInitializing) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">
          {!isSDKLoaded ? 'Loading payment system...' : 'Initializing secure payment...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 信用卡支付表单 */}
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
            className="min-h-[120px] bg-white rounded-lg"
          />
        </div>

        {/* 支付按钮 */}
        <button
          onClick={handlePayment}
          disabled={isProcessing || !card}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
            isProcessing || !card
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing Payment...
            </div>
          ) : (
            `Pay $${amount} Deposit`
          )}
        </button>
      </div>

      {/* 安全信息和接受的卡类型 */}
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
