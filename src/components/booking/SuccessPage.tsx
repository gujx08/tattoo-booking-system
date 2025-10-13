import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { trackBookingComplete } from '../../utils/analytics';

const SuccessPage: React.FC = () => {
  const { state } = useApp();
  const selectedArtist = state.selectedArtist;

  // 追踪预约完成
  useEffect(() => {
    if (selectedArtist) {
      const artistName = selectedArtist.displayName || selectedArtist.name;
      const depositAmount = selectedArtist.deposit || 0;
      trackBookingComplete(artistName, depositAmount);
    }
  }, [selectedArtist]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
          <CheckCircle className="w-12 h-12" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Booking Successful!
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          Your tattoo appointment has been confirmed
        </p>
      </div>

      {/* 预约摘要 */}
      {(state.formData?.name || selectedArtist) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{state.formData?.name || 'Customer'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Artist:</span>
              <span className="font-medium">{selectedArtist?.displayName || selectedArtist?.name || 'Jing'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{state.formData?.email || 'Will be updated'}</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600 mt-1">
                <span className="text-green-600 font-medium">
                  ✅ Your artist will contact you soon
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          What's Next?
        </h3>
        
        <div className="space-y-3 text-sm text-blue-800">
          <p>• Your artist will review your tattoo request ASAP.</p>
          <p>• You'll receive an email from your artist with consultation invite or design feedback.</p>
          <p>• Confirm the design details with your artist via consultation or email.</p>
          <p>• Schedule your tattoo session once the design details are confirmed.</p>
          <p className="font-medium mt-4">Reminder: if you didn't receive a confirmation email, or an email from your artist, pls contact us.</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;