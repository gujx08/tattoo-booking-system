import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './components/HomePage';
import BookingWizard from './components/BookingWizard';
import SuccessPage from './components/booking/SuccessPage';
import NotificationModal from './components/common/NotificationModal';

const AppContent: React.FC = () => {
  const { state } = useApp();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {state.currentStep === 0 ? <HomePage /> : <BookingWizard />}
      </main>
      <Footer />
      <NotificationModal 
        isOpen={state.showNotification} 
        message={state.notificationMessage} 
      />
    </div>
  );
};

// 独立的Success页面组件，不依赖BookingWizard的状态
const StandaloneSuccessPage: React.FC = () => {
  const { state } = useApp();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <SuccessPage />
      </main>
      <Footer />
      <NotificationModal 
        isOpen={state.showNotification} 
        message={state.notificationMessage} 
      />
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