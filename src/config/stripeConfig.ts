// src/config/stripeConfig.ts

// 🚀 生产环境配置 - Live Payment Links
// 所有Payment Links都是生产环境的真实链接

// 🔧 生产模式 - 设置为 false 使用生产环境
const FORCE_TEST_MODE = false;

// 🚀 Live Payment Links - 生产环境
export const STRIPE_PAYMENT_LINKS = {
  // $300 定金 - Jing (Lead Artist)
  'jing': 'https://buy.stripe.com/00w6oHgLY6Zf5WW45Gfw400',
  
  // $100 定金 - Senior & Junior Artists
  'rachel': 'https://buy.stripe.com/3cIeVd8fsabr0CC31Cfw401',
  'jasmine': 'https://buy.stripe.com/3cIeVd8fsabr0CC31Cfw401',
  
  // $50 定金 - Apprentices
  'maili': 'https://buy.stripe.com/00w5kD9jwerH9988lWfw402',
  'keani': 'https://buy.stripe.com/00w5kD9jwerH9988lWfw402'
} as const;

// 测试环境 Payment Links (已创建)
export const STRIPE_TEST_PAYMENT_LINKS = {
  // $300 定金 - Jing (Lead Artist)
  'jing': 'https://buy.stripe.com/test_cNi14ngLYcjz4SS31Cfw403',
  
  // $100 定金 - Rachel, Jasmine
  'rachel': 'https://buy.stripe.com/test_aFa9AT53g1EVadcau4fw404',
  'jasmine': 'https://buy.stripe.com/test_aFa9AT53g1EVadcau4fw404',
  
  // $50 定金 - Maili, Keani (Apprentices) - 需要创建新的$50测试链接
  'maili': 'https://buy.stripe.com/test_aFa9AT53g1EVadcau4fw404', // 临时使用$100链接
  'keani': 'https://buy.stripe.com/test_aFa9AT53g1EVadcau4fw404'  // 临时使用$100链接
} as const;

// 艺术家定金配置
export const ARTIST_DEPOSITS = {
  'jing': 300,
  'rachel': 100,
  'jasmine': 100,
  'maili': 50,
  'keani': 50,
} as const;

// 获取艺术家名称
export const getArtistName = (artistId: string): string => {
  const artistNames: {[key: string]: string} = {
    'jing': 'Jing (Jingxi Gu)',
    'rachel': 'Rachel Hong',
    'jasmine': 'Jasmine Hsueh (Jas)',
    'maili': 'Maili Cohen',
    'keani': 'Keani Chavez'
  };
  
  return artistNames[artistId] || 'Selected Artist';
};

// 获取Stripe支付链接
export const getStripePaymentLink = (artistId: string, customerEmail?: string): string => {
  // 环境检测逻辑 - 生产环境使用Live Payment Links
  const isTestMode = FORCE_TEST_MODE || 
                     window.location.hostname === 'localhost' || 
                     window.location.hostname.includes('127.0.0.1') || 
                     window.location.hostname.includes('localhost');
  
  console.log('🔍 Stripe环境检测:', {
    hostname: window.location.hostname,
    isTestMode: isTestMode,
    forceTestMode: FORCE_TEST_MODE,
    artistId: artistId,
    customerEmail: customerEmail,
    currentUrl: window.location.href
  });
  
  let baseLink: string;
  
  if (isTestMode) {
    // 测试环境 - 使用测试Payment Links
    baseLink = STRIPE_TEST_PAYMENT_LINKS[artistId as keyof typeof STRIPE_TEST_PAYMENT_LINKS] || STRIPE_TEST_PAYMENT_LINKS.rachel;
    console.log('🧪 使用测试环境链接:', baseLink);
  } else {
    // 生产环境 - 使用Live Payment Links
    baseLink = STRIPE_PAYMENT_LINKS[artistId as keyof typeof STRIPE_PAYMENT_LINKS] || STRIPE_PAYMENT_LINKS.rachel;
    console.log('🚀 使用Live Payment Links:', baseLink);
  }
  
  // 如果有客户邮箱，添加到URL参数中
  if (customerEmail && customerEmail.trim()) {
    const separator = baseLink.includes('?') ? '&' : '?';
    const finalLink = `${baseLink}${separator}prefilled_email=${encodeURIComponent(customerEmail.trim())}`;
    console.log('📧 添加邮箱预填充参数:', finalLink);
    return finalLink;
  }
  
  return baseLink;
};

// 获取成功页面URL
export const getSuccessPageUrl = (): string => {
  const baseUrl = window.location.origin;
  const successUrl = `${baseUrl}/success`;
  console.log('🎯 成功页面URL:', successUrl);
  return successUrl;
};

// 获取定金金额
export const getDepositAmount = (artistId: string): number => {
  return ARTIST_DEPOSITS[artistId as keyof typeof ARTIST_DEPOSITS] || 100;
};
