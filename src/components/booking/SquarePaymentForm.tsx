import React, { useEffect, useRef, useState } from 'react';

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

  useEffect(() => {
    const loadSquareSDK = async () => {
      try {
        if (window.Square) {
          setIsSDKLoaded(true);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://web.squarecdn.com/v1/square.js';
        
        script.onload = () => {
          setIsSDKLoaded(true);
        };
        
        script.onerror = () => {
          setInitError('Failed to load payment system. Please refresh the page.');
        };

        document.head.appendChild(script);
      } catch (error) {
        setInitError('Failed to initialize payment system');
      }
    };

    loadSquareSDK();
  }, []);

  useEffect(() => {
    if (!isSDKLoaded || !window.Square || isInitializing || payments) {
      return;
    }

    const initializeSquarePayments = async () => {
      setIsInitializing(true);
      
      try {
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
              fontSize: '16px'
            },
            '.input-container.is-focus': {
              borderColor: '#3b82f6'
            },
            '.input-container.is-error': {
              borderColor: '#ef4444'
            }
          }
        });

        if (cardContainerRef.current) {
          await cardInstance.attach('#card-container');
        }

        setPayments(paymentsInstance);
        setCard(cardInstance);

      } catch (error) {
        console.error('Square initialization error:', error);
        setInitError('Failed to initialize payment form. Please refresh the page.');
      } finally {
        setIsInitializing(false);
      }
    };

    const timer = setTimeout(initializeSquarePayments, 500);
    return () => clearTimeout(timer);
  }, [isSDKLoaded, payments]);

  const handlePayment = async () => {
    if (!card || !payments) {
      onPaymentError('Payment system not ready. Please wait and try again.');
      return;
    }

    try {
      const result = await card.tokenize();
      
      if (result.status === 'OK') {
        const paymentData = {
          source_id: result.token,
          amount_money: {
            amount: amount * 100,
            currency: 'USD'
          },
          location_id: SQUARE_CONFIG.locationId,
          idempotency_key: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };

        // 模拟支付处理
        setTimeout(() => {
          onPaymentSuccess({
            payment: {
              id: `sq_payment_${Date.now()}`,
              status: 'COMPLETED',
              amount: paymentData.amount_money.amount,
              currency: paymentData.amount_money.currency,
              created_at: new Date().toISOString()
            },
            success: true
          });
        }, 2000);
        
      } else {
        let errorMessage = 'Payment failed. Please check your card information.';
        
        if (result.errors && result.errors.length > 0) {
          const error = result.errors[0];
          errorMessage = error.detail || errorMessage;
        }
        
        onPaymentError(errorMessage);
      }
    } catch (error) {
      onPaymentError('Payment failed. Please try again.');
    }
  };

  if (initError) {
    return (
      <div className="border-2 border-red-200 rounded-lg p-6 bg-red-50">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-red-800 mb-2">Payment System Error</h3>
          <p className="text-sm text-red-700 mb-4">{initError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
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
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-2 border-blue-500 rounded-lg p-6 bg-blue-50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">💳</span>
            </div>
            <div>
              <div className="font-semibold text-lg">Credit Card</div>
              <div className="text-sm text-gray-600">Secure payment with Square</div>
            </div>
          </div>
          <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div 
            id="card-container"
            ref={cardContainerRef}
            className="min-h-[120px] bg-white rounded-lg border border-gray-300"
          />
        </div>

        <button
          onClick={handlePayment}
          disabled={isProcessing || !card}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
            isProcessing || !card
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
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

      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <span>🔒</span>
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
