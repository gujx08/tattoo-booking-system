// Google Analytics 4 配置
import ReactGA from 'react-ga4';

// GA4 衡量ID
const GA_MEASUREMENT_ID = 'G-SKJC24732Z';

// 初始化GA4
export const initGA = () => {
  try {
    ReactGA.initialize(GA_MEASUREMENT_ID, {
      gaOptions: {
        siteSpeedSampleRate: 100,
      },
      gtagOptions: {
        send_page_view: true,
      },
    });
    console.log('✅ Google Analytics 4 已初始化');
  } catch (error) {
    console.error('❌ GA4 初始化失败:', error);
  }
};

// 追踪页面浏览
export const trackPageView = (path: string, title?: string) => {
  try {
    ReactGA.send({ 
      hitType: 'pageview', 
      page: path,
      title: title || document.title
    });
  } catch (error) {
    console.error('❌ GA4 页面追踪失败:', error);
  }
};

// 追踪事件
export const trackEvent = (
  category: string, 
  action: string, 
  label?: string, 
  value?: number
) => {
  try {
    ReactGA.event({
      category,
      action,
      label,
      value,
    });
  } catch (error) {
    console.error('❌ GA4 事件追踪失败:', error);
  }
};

// 追踪预约步骤
export const trackBookingStep = (step: number, stepName: string) => {
  trackEvent('Booking Flow', `Step ${step}`, stepName);
};

// 追踪艺术家选择
export const trackArtistSelection = (artistName: string) => {
  trackEvent('Artist Selection', 'Select Artist', artistName);
};

// 追踪支付开始
export const trackPaymentStart = (artistName: string, amount: number) => {
  trackEvent('Payment', 'Start Payment', artistName, amount);
};

// 追踪预约完成
export const trackBookingComplete = (artistName: string, amount: number) => {
  trackEvent('Booking', 'Complete Booking', artistName, amount);
};

// 追踪咨询预约
export const trackConsultationBooking = (artistName: string) => {
  trackEvent('Consultation', 'Book Consultation', artistName);
};

