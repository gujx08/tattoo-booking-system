// src/config/stripeConfig.ts

// ⚠️ 重要：当前使用的是生产环境的Payment Links
// 测试时需要使用测试环境的Payment Links

// 🔧 强制测试模式 - 设置为 false 以使用生产环境
const FORCE_TEST_MODE = false;

// 生产环境 Payment Links (当前使用)
export const STRIPE_PAYMENT_LINKS = {
  // $300 定金 - Jing (Lead Artist)
  'jing': 'https://buy.stripe.com/00w6oHgLY6Zf5WW45Gfw400',
  
  // $100 定金 - Rachel, Jasmine, Lauren, Annika
  'rachel': 'https://buy.stripe.com/3cIeVd8fsabr0CC31Cfw401',
  'jasmine': 'https://buy.stripe.com/3cIeVd8fsabr0CC31Cfw401',
  'lauren': 'https://buy.stripe.com/3cIeVd8fsabr0CC31Cfw401',
  'annika': 'https://buy.stripe.com/3cIeVd8fsabr0CC31Cfw401',
  
  // $50 定金 - Maili, Keani (Apprentices)
  'maili': 'https://buy.stripe.com/00w5kD9jwerH9988lWfw402',
  'keani': 'https://buy.stripe.com/00w5kD9jwerH9988lWfw402'
} as const;

// 测试环境 Payment Links (已创建)
export const STRIPE_TEST_PAYMENT_LINKS = {
  // $300 定金 - Jing (Lead Artist)
  'jing': 'https://buy.stripe.com/test_00w6oHgLY6Zf5WW45Gfw400',
  
  // $100 定金 - Rachel, Jasmine, Lauren, Annika
  'rachel': 'https://buy.stripe.com/test_3cIeVd8fsabr0CC31Cfw401',
  'jasmine': 'https://buy.stripe.com/test_3cIeVd8fsabr0CC31Cfw401',
  'lauren': 'https://buy.stripe.com/test_3cIeVd8fsabr0CC31Cfw401',
  'annika': 'https://buy.stripe.com/test_3cIeVd8fsabr0CC31Cfw401',
  
  // $50 定金 - Maili, Keani (Apprentices)
  'maili': 'https://buy.stripe.com/test_00w5kD9jwerH9988lWfw402',
  'keani': 'https://buy.stripe.com/test_00w5kD9jwerH9988lWfw402'
} as const;

// 艺术家定金配置
export const ARTIST_DEPOSITS = {
  'jing': 300,
  'rachel': 100,
  'jasmine': 100,
  'lauren': 100,
  'annika': 100,
  'maili': 50,
  'keani': 50,
} as const;

// 获取艺术家名称
export const getArtistName = (artistId: string): string => {
  const artistNames: {[key: string]: string} = {
    'jing': 'Jing (Jingxi Gu)',
    'rachel': 'Rachel Hong',
    'jasmine': 'Jasmine Hsueh (Jas)',
    'lauren': 'Lauren Hacaga',
    'annika': 'Annika Riggins',
    'maili': 'Maili Cohen',
    'keani': 'Keani Chavez'
  };
  
  return artistNames[artistId] || 'Selected Artist';
};

// 获取Stripe支付链接
export const getStripePaymentLink = (artistId: string): string => {
  // 环境检测逻辑
  const isTestMode = FORCE_TEST_MODE || 
                     window.location.hostname === 'localhost' || 
                     window.location.hostname.includes('127.0.0.1') || 
                     window.location.hostname.includes('localhost');
  
  console.log('🔍 Stripe环境检测:', {
    hostname: window.location.hostname,
    isTestMode: isTestMode,
    forceTestMode: FORCE_TEST_MODE,
    artistId: artistId,
    currentUrl: window.location.href
  });
  
  if (isTestMode) {
    // 测试环境 - 使用测试Payment Links
    const testLink = STRIPE_TEST_PAYMENT_LINKS[artistId as keyof typeof STRIPE_TEST_PAYMENT_LINKS] || STRIPE_TEST_PAYMENT_LINKS.rachel;
    console.log('🧪 使用测试环境链接:', testLink);
    return testLink;
  } else {
    // 生产环境 - 使用生产Payment Links
    const prodLink = STRIPE_PAYMENT_LINKS[artistId as keyof typeof STRIPE_PAYMENT_LINKS] || STRIPE_PAYMENT_LINKS.rachel;
    console.log('🚀 使用生产环境链接:', prodLink);
    return prodLink;
  }
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
