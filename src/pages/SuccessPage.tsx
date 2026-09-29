import React from 'react';
import { CheckCircle } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const SuccessPage: React.FC = () => {
  // 旧 Stripe Payment Links 付款后的跳转页；从 Stripe 跳回来是整页刷新，没有站内状态
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
              <CheckCircle className="w-12 h-12" />
            </div>

            <h1 className="text-4xl font-bold text-stone-900 mb-4">
              Booking Successful!
            </h1>

            <p className="text-xl text-stone-600 mb-8">
              Your tattoo appointment has been confirmed
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm text-stone-600 mt-1">
                    <span className="text-green-600 font-medium">
                      Your tattoo request is sent to your artist. Please allow your artist 3-5 days to get back to you. Sometimes they're busy tattooing!
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-yellow-900 mb-4">
              What's Next?
            </h3>
        
            <div className="space-y-3 text-sm text-yellow-800">
              <p>• Your artist will review your tattoo request ASAP.</p>
              <p>• You'll receive an email from your artist with consultation invite or design feedback.</p>
              <p>• Confirm the design details with your artist via consultation or email.</p>
              <p>• Schedule your tattoo session once the design details are confirmed.</p>
              <p className="font-medium mt-4">Reminder: if you didn't receive a confirmation email, or an email from your artist, pls contact us.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SuccessPage;