import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../common/Button';
import SquarePaymentForm from './SquarePaymentForm';

const PaymentPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取纹身师信息
  const getArtistInfo = () => {
    const artistName = state.selectedArtist;
    switch (artistName) {
      case 'Jing':
        return { name: 'Jing (Jingxi Gu)', deposit: 300 };
      case 'Rachel':
      case 'Jas':
      case 'Lauren':
      case 'Annika':
        return { name: artistName, deposit: 100 };
      case 'Maili':
      case 'Keani':
        return { name: `${artistName} (Apprentice)`, deposit: 50 };
      default:
        return { name: artistName || 'Selected Artist', deposit: 100 };
    }
  };

  const artistInfo = getArtistInfo();

  const handlePaymentSuccess = async (paymentResult: any) => {
    setIsProcessing(true);
    setError(null);

    try {
      // 保存支付信息到状态
      dispatch({
        type: 'SET_PAYMENT_INFO',
        payload: {
          transactionId: paymentResult.payment?.id || `payment_${Date.now()}`,
          amount: artistInfo.deposit,
          currency: 'USD',
          status: 'completed',
          paymentMethod: 'credit_card',
          timestamp: new Date().toISOString()
        }
      });

      // 跳转到成功页面
      dispatch({ type: 'SET_STEP', payload: 8 });
      
    } catch (err) {
      console.error('Payment processing error:', err);
      setError('Payment completed but there was an error saving your information. Please contact us.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error: string) => {
    setError(error);
    setIsProcessing(false);
  };

  const handleBack = () => {
    if (state.needsConsultation && state.consultationTime) {
      dispatch({ type: 'SET_STEP', payload: 6 });
    } else {
      dispatch({ type: 'SET_STEP', payload: 5 });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light mb-2">Let's lock your spot!</h1>
        <p className="text-gray-600">Almost there! Complete your deposit to secure your tattoo appointment.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Summary */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-medium mb-6">Booking Summary</h2>
          
          <div className="space-y-4">
            {/* Artist */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm">👤</span>
              </div>
              <div>
                <div className="font-medium">{artistInfo.name}</div>
                <div className="text-sm text-gray-600">Your selected artist</div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm">📧</span>
              </div>
              <div>
                <div className="font-medium">{state.clientInfo.name}</div>
                <div className="text-sm text-gray-600">{state.clientInfo.email}</div>
              </div>
            </div>

            {/* Tattoo Idea */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm">🎨</span>
              </div>
              <div>
                <div className="font-medium">Tattoo Idea</div>
                <div className="text-sm text-gray-600 line-clamp-2">
                  {state.tattooIdea.description || 'Custom design'}
                </div>
              </div>
            </div>

            {/* Consultation */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm">📅</span>
              </div>
              <div>
                {state.needsConsultation && state.consultationTime ? (
                  <>
                    <div className="font-medium">Consultation Scheduled</div>
                    <div className="text-sm text-gray-600">
                      {new Date(state.consultationTime).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-medium">No Consultation</div>
                    <div className="text-sm text-gray-600">Design details will be confirmed via email</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Deposit Amount */}
          <div className="mt-8 pt-6 border-t">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Deposit Required</span>
              <span className="text-2xl font-bold">${artistInfo.deposit}</span>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white">
          <h2 className="text-xl font-medium mb-6">Secure Payment</h2>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <SquarePaymentForm
            amount={artistInfo.deposit}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            isProcessing={isProcessing}
          />
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-center mt-8">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isProcessing}
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default PaymentPage;
