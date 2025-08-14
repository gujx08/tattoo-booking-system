import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/common/Header';
import HomePage from './components/HomePage';
import BookingWizard from './components/BookingWizard';
// 修复：使用正确的SuccessPage路径
import SuccessPage from './components/booking/SuccessPage';

const AppContent: React.FC = () => {
  const { state } = useApp();
  
  // 渲染逻辑
  const renderContent = () => {
    if (state.currentStep === 0) {
      return <HomePage />;
    } else if (state.currentStep === 999) { // 成功页面的特殊步骤号
      return <SuccessPage />;
    } else {
      return <BookingWizard />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {renderContent()}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
