import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreditCard, Calendar, User, MessageSquare, ExternalLink } from 'lucide-react';
import Button from '../common/Button';

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
  const [isProcessing, setIsProcessing] = useState(false);

  const getSelectedArtist = () => {
    if (state.selectedArtist) {
      return state.selectedArtist;
    }
    
    // 根据artistId获取纹身师信息
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

  // 修复后的支付处理函数
  const handleSquarePayment = async () => {
    try {
      console.log('🚀 支付流程开始');
      setIsProcessing(true);
      
      // 确保有必要的客户信息
      if (!state.formData.name || !state.formData.email) {
        console.error('❌ 缺少客户信息');
        alert('请确保已填写姓名和邮箱信息');
        setIsProcessing(false);
        return;
      }

      // 详细的调试信息
      console.log('📋 支付数据:', {
        artist: state.formData.artistId,
        amount: getDepositAmount(),
        customer: {
          name: state.formData.name,
          email: state.formData.email,
          phone: state.formData.phone
        },
        fullFormData: state.formData
      });

      // 模拟支付处理
      console.log('💰 模拟支付处理中...');
      
      // 模拟支付延迟
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('✅ 支付处理完成，准备跳转');
      
      // 保存支付成功信息到状态
      dispatch({ 
        type: 'SET_PAYMENT_SUCCESS', 
        payload: {
          paymentId: 'test_' + Date.now(),
          amount: getDepositAmount(),
          timestamp: new Date().toISOString(),
          artist: state.formData.artistId,
          customerName: state.formData.name,
          customerEmail: state.formData.email
        }
      });
      
      // 跳转到成功页面 (step 999)
      dispatch({ type: 'SET_STEP', payload: 999 });
      
      setIsProcessing(false);
      
    } catch (error) {
      console.error('❌ 支付错误详情:', error);
      alert(`支付处理失败: ${error instanceof Error ? error.message : '未知错误'}`);
      setIsProcessing(false);
    }
  };

  // 真实的Square支付集成（备用）
  const handleRealSquarePayment = () => {
    // 这里可以实现真正的Square Web Payments SDK集成
    // 需要加载Square的JavaScript SDK并创建支付表单
    alert('真实Square支付集成即将完成！目前使用测试模式。');
  };

  const handlePayPalPayment = () => {
    alert('PayPal支付功能即将上线');
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
              <span className="text-2xl font-bold text-gray-900">${getDepositAmount()}</span>
            </div>
          </div>

          {/* Deposit Policy - Collapsible */}
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
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Secure Payment
          </h2>

          {/* 支付提示 */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Test Mode Active</p>
                <p className="text-xs text-blue-700 mt-1">
                  Currently in development mode. Payment will be processed securely once live.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <button
              onClick={handleSquarePayment}
              disabled={isProcessing || !state.formData.name || !state.formData.email}
              className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-lg transition-colors ${
                isProcessing || !state.formData.name || !state.formData.email
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">
                {isProcessing ? 'Processing...' : `Confirm $${getDepositAmount()} Deposit`}
              </span>
            </button>

            <button
              onClick={handlePayPalPayment}
              className="w-full flex items-center justify-center space-x-3 bg-yellow-500 text-white py-4 px-6 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">Pay with PayPal (Coming Soon)</span>
            </button>
          </div>

          {/* 支付信息提示 */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              🔒 Your payment will be secure and encrypted
            </p>
            <p className="text-xs text-gray-400 mt-1">
              All major credit cards accepted
            </p>
          </div>

          {/* 测试模式提示 */}
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-700 text-center">
              ✅ Demo Mode: Click to test the complete booking flow
            </p>
          </div>
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
