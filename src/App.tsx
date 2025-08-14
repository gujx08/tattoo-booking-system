import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/common/Header';
import HomePage from './components/HomePage';
import BookingWizard from './components/BookingWizard';

const AppContent: React.FC = () => {
  const { state } = useApp();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {state.currentStep === 0 ? <HomePage /> : <BookingWizard />}
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