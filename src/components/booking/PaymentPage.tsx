import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreditCard, Calendar, User, MessageSquare } from 'lucide-react';
import Button from '../common/Button';
import SquarePaymentForm from './SquarePaymentForm';

// Square配置
const SQUARE_CONFIG = {
  applicationId: 'sandbox-sq0idb-uH8yFqW9VJ7Xfg5Dlmzbug',
  locationId: 'LHWGABJMFKASZ',
  environment: 'sandbox' as const,
};

const ARTIST_DEPOSITS = {
  'jing': 300,
  'rachel': 100,
  'jas': 100,
  'lauren': 100,
  'annika': 100,
  'maili': 50,
  'keani': 50,
} as const;

const PaymentPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const [showDepositPolicy, setShowDepositPolicy] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'square' | 'demo'>('square');

  const getSelectedArtist = () => {
    if (state.selectedArtist) {
      return state.selectedArtist;
    }
    
    const artistData: {[key: string]: {name: string, deposit: number}} = {
      'jing': { name: 'Jing (Jingxi Gu)', deposit: 300 },
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
    const artistId = state.formData.artistId || '';
    return ARTIST_DEPOSITS[artistId as keyof typeof ARTIST_DEPOSITS] || 100;
  };

  // 处理Square支付成功
  const handleSquarePaymentSuccess = async (result: any) => {
    try {
      console.log('✅ Square支付成功:', result);
      
      // 保存支付成功信息
      dispatch({ 
        type: 'SET_PAYMENT_SUCCESS', 
        payload: {
          paymentId: result.paymentId,
          amount: getDepositAmount(),
          timestamp: new Date().toISOString(),
          artist: state.formData.artistId,
          customerName: state.formData.name,
          customerEmail: state.formData.email,
          paymentMethod: 'square',
          last4: result.last4
        }
      });
      
      // 跳转到成功页面
      dispatch({ type: 'SET_STEP', payload: 999 });
      
    } catch (error) {
      console.error('❌ 支付后处理错误:', error);
      alert('支付成功，但处理过程中出现错误。请联系我们。');
    }
  };

  // 处理Square支付错误
  const handleSquarePaymentError = (error: any) => {
    console.error('❌ Square支付失败:', error);
    // 错误已经在SquarePaymentForm组件中显示
  };

  // Demo模式支付（仅用于测试）
  const handleDemoPayment = async () => {
    try {
      console.log('🎮 Demo模式支付');
      
      if (!state.formData.name || !state.formData.email) {
        alert('请确保已填写姓名和邮箱信息');
        return;
      }

      // 模拟支付延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      dispatch({ 
        type: 'SET_PAYMENT_SUCCESS', 
        payload: {
          paymentId: 'demo_' + Date.now(),
          amount: getDepositAmount(),
          timestamp: new Date().toISOString(),
          artist: state.formData.artistId,
          customerName: state.formData.name,
          customerEmail: state.formData.email,
          paymentMethod: 'demo'
        }
      });
      
      dispatch({ type: 'SET_STEP', payload: 999 });
      
    } catch (error) {
      console.error('❌ Demo支付错误:', error);
      alert('Demo支付失败');
    }
  };

  const handleBack = () => {
    if (state.formData.needsConsultation) {
      dispatch({ type: 'SET_STEP', payload: 8 });
    } else {
      dispatch({ type: 'SET_STEP', payload: 7 });
    }
  };

  const artist = getSelectedArtist();
  const depositAmount = getDepositAmount();

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

            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">{state.formData.name}</p>
                <p className="text-sm text-gray-600">{state.formData.email}</p>
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
              <span className="text-2xl font-bold text-gray-900">${depositAmount}</span>
            </div>
          </div>

          {/* Deposit Policy */}
          <div className="mt-6">
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
                <h4 className="font-medium text-gray-700 mb-2">Why do we collect deposit?</h4>
                <p>• It takes time for artists to review your tattoo idea. The deposit protects our artists' time and ensures you're a serious client.</p>
                
                <h4 className="font-medium text-gray-700 mb-2 mt-4">Refund policy</h4>
                <p>• Deposit can be fully deducted once the tattoo is completed.</p>
                <p>• Deposit is fully refundable before consultation starts or design work begins.</p>
                <p>• Once consultation is completed or design has started, deposit is non-refundable.</p>
                <p>• Non-refundable if you're a no-show or more than 2 hours late.</p>
                <p>• Non-refundable if final schedule is postponed more than 2 times.</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Secure Payment
          </h2>

          {/* Payment Method Selection */}
          <div className="mb-6 space-y-3">
            <div className="flex space-x-4">
              <button
                onClick={() => setPaymentMethod('square')}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  paymentMethod === 'square'
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <CreditCard className="w-5 h-5 mx-auto mb-1" />
                  <p className="text-sm font-medium">Credit Card</p>
                  <p className="text-xs text-gray-600">Secure payment</p>
                </div>
              </button>
              
              <button
                onClick={() => setPaymentMethod('demo')}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  paymentMethod === 'demo'
                    ? 'border-orange-500 bg-orange-50 text-orange-900'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="w-5 h-5 mx-auto mb-1 bg-orange-500 rounded text-white text-xs flex items-center justify-center">T</div>
                  <p className="text-sm font-medium">Test Mode</p>
                  <p className="text-xs text-gray-600">For testing only</p>
                </div>
              </button>
            </div>
          </div>

          {/* Payment Form */}
          {paymentMethod === 'square' ? (
            <SquarePaymentForm
              applicationId={SQUARE_CONFIG.applicationId}
              locationId={SQUARE_CONFIG.locationId}
              environment={SQUARE_CONFIG.environment}
              amount={depositAmount}
              onPaymentSuccess={handleSquarePaymentSuccess}
              onPaymentError={handleSquarePaymentError}
              disabled={!state.formData.name || !state.formData.email}
            />
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800 font-medium">测试模式已选择</p>
                <p className="text-xs text-orange-700 mt-1">
                  点击下方按钮模拟成功支付并测试完整预约流程。
                </p>
              </div>
              
              <button
                onClick={handleDemoPayment}
                disabled={!state.formData.name || !state.formData.email}
                className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-lg transition-colors ${
                  !state.formData.name || !state.formData.email
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-orange-600 text-white hover:bg-orange-700'
                }`}
              >
                <div className="w-5 h-5 bg-white rounded text-orange-600 text-xs flex items-center justify-center">T</div>
                <span className="font-medium">测试支付 - ${depositAmount}</span>
              </button>
            </div>
          )}
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
