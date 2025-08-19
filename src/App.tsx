import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/common/Header';
import HomePage from './components/HomePage';
import BookingWizard from './components/BookingWizard';
import SuccessPage from './components/booking/SuccessPage';

const AppContent: React.FC = () => {
  const { state } = useApp();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {state.currentStep === 0 ? <HomePage /> : <BookingWizard />}
    </div>
  );
};

// 独立的Success页面组件，不依赖BookingWizard的状态
const StandaloneSuccessPage: React.FC = () => {
  const handleBackHome = () => {
    // 清理localStorage中的邮件发送标记
    try {
      localStorage.removeItem('emailSentGlobal');
    } catch (error) {
      console.warn('清理邮件发送标记失败:', error);
    }
    
    // 直接跳转到首页
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SuccessPage onBackHome={handleBackHome} />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppProvider>
        <Routes>
          {/* 主应用路由 */}
          <Route path="/" element={<AppContent />} />
          
          {/* 独立的Success页面路由 */}
          <Route path="/success" element={<StandaloneSuccessPage />} />
          
          {/* 静态成功页面 */}
          <Route path="/booking-success" element={<Navigate to="/success" replace />} />
          
          {/* 默认重定向 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </Router>
  );
}

export default App;