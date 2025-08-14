import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Button from '../common/Button';
import SquarePaymentForm from './SquarePaymentForm';

const PaymentPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPolicy, setShowPolicy] = useState(false);

  // 获取纹身师信息
  const getArtistInfo = () => {
    const artistName = state.selectedArtist;
    switch (artistName) {
      case 'Jing':
        return { name: 'Jing (Jingxi Gu)', deposit: 300, title: 'Lead Artist' };
      case 'Rachel':
        return { name: 'Rachel Hong', deposit: 100, title: 'Senior Artist' };
      case 'Jas':
        return { name: 'Jasmine Hsueh (Jas)', deposit: 100, title: 'Senior Artist' };
      case 'Lauren':
        return { name: 'Lauren Hacaga', deposit: 100, title: 'Junior Artist' };
      case 'Annika':
        return { name: 'Annika Riggins', deposit: 100, title: 'Junior Artist' };
      case 'Maili':
        return { name: 'Maili Cohen', deposit: 50, title: 'Apprentice' };
      case 'Keani':
        return { name: 'Keani Chavez', deposit: 50, title: 'Apprentice' };
      default:
        return { name: artistName || 'Selected Artist', deposit: 100, title: 'Artist' };
    }
  };

  const artistInfo = getArtistInfo();

  const handlePaymentSuccess = async (paymentResult: any) => {
    setIsProcessing(true);
    setError(null);

    try {
      console.log('Payment successful, saving information...', paymentResult);
      
      // 保存支付信息到状态
      dispatch({
        type: 'SET_PAYMENT_INFO',
        payload: {
          transactionId: paymentResult.payment?.id || `payment_${Date.now()}`,
          amount: artistInfo.deposit,
          currency: 'USD',
          status: 'completed',
          paymentMethod: 'credit_card',
          timestamp: new Date().toISOString(),
          receiptUrl: paymentResult.payment?.receipt_url || null
        }
      });

      // 短暂延迟以显示成功状态
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 跳转到成功页面
      dispatch({ type: 'SET_STEP', payload: 8 });
      
    } catch (err) {
      console.error('Error saving payment information:', err);
      setError('Payment was successful, but there was an error saving your information. Please contact us with your payment confirmation.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    setError(error);
    setIsProcessing(false);
  };

  const handleBack = () => {
    if (state.needsConsultation && state.consultationTime) {
      dispatch({ type: 'SET_STEP', payload: 6 }); // 回到时间选择
    } else {
      dispatch({ type: 'SET_STEP', payload: 5 }); // 回到咨询选择
    }
  };

  const formatConsultationTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'America/Los_Angeles'
      });
    } catch {
      return timeString;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-light mb-4">Let's lock your spot!</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Almost there! Complete your deposit to secure your tattoo appointment with {artistInfo.name}.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Column - Booking Summary */}
        <div className="bg-gray-50 p-8 rounded-xl">
          <h2 className="text-2xl font-semibold mb-8">Booking Summary</h2>
          
          <div className="space-y-6">
            {/* Artist Info */}
            <div className="flex items-start gap-4 p-4 bg-white rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-lg">{artistInfo.name}</div>
                <div className="text-sm text-blue-600 font-medium">{artistInfo.title}</div>
                <div className="text-sm text-gray-600 mt-1">Your selected tattoo artist</div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex items-start gap-4 p-4 bg-white rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-semibold">{state.clientInfo.name}</div>
                <div className="text-sm text-gray-600">{state.clientInfo.email}</div>
                <div className="text-sm text-gray-600">{state.clientInfo.phone}</div>
              </div>
            </div>

            {/* Tattoo Idea */}
            <div className="flex items-start gap-4 p-4 bg-white rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M11 7h6.5a2 2 0 012 2v4.5M7 17h4.5" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-semibold">Tattoo Concept</div>
                <div className="text-sm text-gray-600 mt-1 line-clamp-3">
                  {state.tattooIdea.description || 'Custom design to be discussed'}
                </div>
                {state.tattooIdea.inspirationImages && state.tattooIdea.inspirationImages.length > 0 && (
                  <div className="text-xs text-purple-600 mt-2">
                    {state.tattooIdea.inspirationImages.length} reference image(s) uploaded
                  </div>
                )}
              </div>
            </div>

            {/* Consultation Status */}
            <div className="flex items-start gap-4 p-4 bg-white rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8V9m0 0V7a2 2 0 114 0v2M8 7a2 2 0 114 0v2" />
                </svg>
              </div>
              <div className="flex-1">
                {state.needsConsultation && state.consultationTime ? (
                  <>
                    <div className="font-semibold text-orange-600">Consultation Scheduled</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {formatConsultationTime(state.consultationTime)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Pacific Time</div>
                  </>
                ) : (
                  <>
                    <div className="font-semibold">No Pre-Consultation</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Design details will be discussed via email and confirmed before your appointment
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Deposit Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="bg-white p-6 rounded-lg border-2 border-blue-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-700">Deposit Required</span>
                <span className="text-3xl font-bold text-blue-600">${artistInfo.deposit}</span>
              </div>
              <div className="text-sm text-gray-600">
                This deposit secures your appointment and will be applied toward your final tattoo cost.
              </div>
            </div>
          </div>

          {/* Policy Link */}
          <div className="mt-6 text-center">
            <button 
              onClick={() => setShowPolicy(!showPolicy)}
              className="text-blue-600 hover:text-blue-800 underline text-sm font-medium transition-colors"
            >
              {showPolicy ? 'Hide' : 'View'} Deposit & Refund Policy
            </button>
            
            {showPolicy && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg text-left text-sm text-gray-700">
                <h4 className="font-semibold mb-2">Deposit & Refund Policy:</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Deposits are required to secure your appointment</li>
                  <li>• Deposits are applied toward your final tattoo cost</li>
                  <li>• 48-hour notice required for cancellations</li>
                  <li>• Deposits are non-refundable for no-shows</li>
                  <li>• Rescheduling is allowed with advance notice</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Payment Form */}
        <div className="bg-white">
          <h2 className="text-2xl font-semibold mb-8">Secure Payment</h2>
          
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Form */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <SquarePaymentForm
              amount={artistInfo.deposit}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              isProcessing={isProcessing}
            />
          </div>

          {/* Contact Info */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3">Need Help?</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call us: (818) 857-7937
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                Email: info@patchtattootherapy.com
              </p>
              <p className="text-xs text-gray-500 mt-3">
                Operating Hours: Monday to Sunday, 11AM - 7PM
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-center mt-12">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isProcessing}
          className="px-8 py-3"
        >
          {isProcessing ? 'Processing...' : 'Back'}
        </Button>
      </div>
    </div>
  );
};

export default PaymentPage;
