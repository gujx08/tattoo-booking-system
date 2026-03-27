import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertCircle, CreditCard } from 'lucide-react';
import Button from '../common/Button';

const PaymentCancelledPage: React.FC = () => {
  const { state, dispatch } = useApp();

  const handleReturnToPayment = () => {
    dispatch({ type: 'SET_STEP', payload: 9 }); // 返回支付页面
  };

  const getSelectedArtist = () => {
    if (state.selectedArtist) {
      return state.selectedArtist.displayName || state.selectedArtist.name;
    }
    
    const artistNames: {[key: string]: string} = {
      'jing': 'Jing',
      'rachel': 'Rachel Hong', 
      'jas': 'Jasmine Hsueh (Jas)',
      'lauren': 'Lauren Hacaga',
      'annika': 'Annika Riggins',
      'maili': 'Maili Cohen',
      'keani': 'Keani Chavez'
    };
    
    return artistNames[state.formData.artistId || ''] || 'your selected artist';
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        {/* 取消图标 */}
        <div className="flex justify-center mb-6">
          <AlertCircle className="w-16 h-16 text-yellow-500" />
        </div>

        {/* 标题和说明 */}
        <h1 className="text-2xl font-bold text-stone-900 mb-4">
          Payment Cancelled
        </h1>
        
        <p className="text-stone-600 mb-6">
          You cancelled the payment process. Please complete payment soon to secure your appointment.
        </p>

        {/* 重要提醒 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <span className="font-medium">💡 Keep this page open:</span> Your booking details are saved temporarily. Refreshing or leaving this page will lose your information.
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-4">
          {/* 完成支付 */}
          <Button 
            onClick={handleReturnToPayment}
            className="w-full flex items-center justify-center space-x-2 bg-yellow-500 hover:bg-yellow-600"
          >
            <CreditCard className="w-5 h-5" />
            <span>Complete Payment Now</span>
          </Button>
        </div>

        {/* 联系信息 */}
        <div className="mt-8 p-4 bg-neutral-50 rounded-lg">
          <p className="text-sm text-stone-600">
            <span className="font-medium">Questions?</span> Call us at{' '}
            <a href="tel:818-857-7937" className="text-yellow-600 hover:underline">
              (818) 857-7937
            </a>{' '}
            or email{' '}
            <a href="mailto:info@patchtattootherapy.com" className="text-yellow-600 hover:underline">
              info@patchtattootherapy.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelledPage;