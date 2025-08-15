import React from 'react';

interface SquarePaymentFormProps {
  amount: number;
  onPaymentSuccess: (result: any) => void;
  onPaymentError: (error: string) => void;
  isProcessing: boolean;
}

const SquarePaymentForm: React.FC<SquarePaymentFormProps> = ({
  amount,
  onPaymentSuccess,
  onPaymentError,
  isProcessing
}) => {
  const handleTestPayment = () => {
    // 模拟支付成功
    setTimeout(() => {
      onPaymentSuccess({
        payment: {
          id: `test_payment_${Date.now()}`,
          status: 'COMPLETED',
          amount: amount * 100,
          currency: 'USD',
          created_at: new Date().toISOString()
        },
        success: true
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-blue-500 rounded-lg p-6 bg-blue-50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white">💳</span>
            </div>
            <div>
              <div className="font-semibold text-lg">Credit Card</div>
              <div className="text-sm text-gray-600">Secure payment with Square</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className="min-h-[120px] bg-white rounded-lg border border-gray-300 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 mb-2">Square Payment Form</p>
              <p className="text-sm text-gray-400">Will be integrated once build succeeds</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleTestPayment}
          disabled={isProcessing}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
            isProcessing
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
            `Pay $${amount} Deposit (Test Mode)`
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
