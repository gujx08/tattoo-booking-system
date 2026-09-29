import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ArtistIndexPage from './pages/ArtistIndexPage';
import ArtistPage from './pages/ArtistPage';
import SuccessPage from './pages/SuccessPage';
import { trackPageView } from './utils/analytics';

// 路由追踪组件
const RouteTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // 追踪页面浏览
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

function App() {
  return (
    <Router>
      <RouteTracker />
      <Routes>
        {/* 艺术家列表 */}
        <Route path="/" element={<ArtistIndexPage />} />

        {/* 旧 Stripe Payment Links 的支付成功跳转页 */}
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/booking-success" element={<Navigate to="/success" replace />} />

        {/* 艺术家个人主页（旧的 /:artistId/book 链接由 public/_redirects 跳转到 ChatWme） */}
        <Route path="/:artistId" element={<ArtistPage />} />

        {/* 默认重定向 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
