import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreditCard, Calendar, User, MessageSquare } from 'lucide-react';
import Button from '../common/Button';

const PaymentPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const [showDepositPolicy, setShowDepositPolicy] = useState(false);

  const getSelectedArtist = () => {
    if (state.selectedArtist) {
      return state.selectedArtist;
    }
    
    // 根据artistId获取纹身师信息
    const artistData: {[key: string]: {name: string, deposit: number}} = {
      'jing': { name: 'Jing', deposit: 300 },
      'rachel': { name: 'Rachel Hong', deposit: 100 },
      'jas': { name: 'Jasmine Hsueh (Jas)', deposit: 100 },
      'lauren': { name: 'Lauren Hacaga', deposit: 100 },
      'annika': { name: 'Annika Riggins', deposit: 100 },
      'maili': { name: 'Maili Cohen', deposit: 50 },
      'keani': { name: 'Keani Chavez', deposit: 50 }
    };
    
    const artistInfo = artistData[state.formData.artistId || ''];
    return artistInfo || { name: 'Selected Artist', deposit: 100 };
  };

  const getDepositAmount = () => {
    const artist = getSelectedArtist();
    return artist.deposit || 100;
  };

  const handlePayment = (method: 'stripe' | 'paypal') => {
    // Go to payment processing page first
    dispatch({ type: 'SET_STEP', payload: 11 });
  };

  const handleBack = () => {
    if (state.formData.needsConsultation) {
      dispatch({ type: 'SET_STEP', payload: 8 }); // Back to consultation scheduling
    } else {
      dispatch({ type: 'SET_STEP', payload: 7 }); // Back to consultation choice
    }
  };

  const artist = getSelectedArtist();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Let's lock your spot!
        </h1>
        <p className="text-gray-600">
          Almost there! Complete your deposit to secure your tattoo appointment.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Booking Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Booking Summary
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">{artist.name}</p>
                <p className="text-sm text-gray-600">Your selected artist</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MessageSquare className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Tattoo Idea</p>
                <p className="text-sm text-gray-600">
                  {state.formData.tattooIdea || 'Custom tattoo design'}
                </p>
              </div>
            </div>

            {state.formData.needsConsultation && (
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Consultation</p>
                  <p className="text-sm text-gray-600">
                    {state.formData.consultationDate}
                  </p>
                  <p className="text-sm text-gray-600">
                    {state.formData.consultationTime}
                  </p>
                </div>
              </div>
            )}

            {!state.formData.needsConsultation && (
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">No Consultation</p>
                  <p className="text-sm text-gray-600">
                    Design details will be confirmed via email
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t mt-6 pt-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Deposit Required</span>
              <span className="text-2xl font-bold text-gray-900">${getDepositAmount()}</span>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Complete Payment
          </h2>

          {/* Deposit Policy - Collapsible */}
          <div className="mb-6">
            <button
              onClick={() => setShowDepositPolicy(!showDepositPolicy)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-sm font-medium text-gray-700 underline">
                Deposit & Refund Policy
              </span>
            </button>
            
            {showDepositPolicy && (
              <div className="mt-3 text-sm text-gray-600 space-y-2 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Why do we collect deposit before the artists see your request?</h4>
                <p>• It takes the artists some time to review & understand your tattoo idea. We collect the deposit to protect our artists' time, and also to make sure that you're a serious client.</p>
                
                <h4 className="font-medium text-gray-700 mb-2 mt-4">Refund policy</h4>
                <p>• Deposit can be fully deducted once the tattoo is completed.</p>
                <p>• Deposit is fully refundable before the consultation starts, or before the design starts (for clients who doesn't need consultation).</p>
                <p>• Once the consultation is completed, or the design has started, the deposit is not refundable.</p>
                <p>• Non-refundable if client's not showing up on the tattoo day, or being late for more than 2 hours.</p>
                <p>• Non-refundable if the final tattoo schedule is postponed for more than 2 times.</p>
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <button
              onClick={() => handlePayment('stripe')}
              className="w-full flex items-center justify-center space-x-3 bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">Pay with Card (Stripe)</span>
            </button>

            <button
              onClick={() => handlePayment('paypal')}
              className="w-full flex items-center justify-center space-x-3 bg-yellow-500 text-white py-4 px-6 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">Pay with PayPal</span>
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Your payment information is secure and encrypted
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center mt-8">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
      </div>
    </div>
  );
};

export default PaymentPage;