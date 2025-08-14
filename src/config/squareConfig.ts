// src/config/squareConfig.ts

export const SQUARE_CONFIG = {
  // 你的Square Sandbox配置
  applicationId: 'sandbox-sq0idb-uH8yFqW9VJ7Xfg5Dlmzbug',
  locationId: 'LHWGABJMFKASZ',
  environment: 'sandbox' as const,
  
  // Square支付页面基础URL
  baseUrl: 'https://squareupsandbox.com/checkout',
};

// 生产环境配置（上线时替换）
export const SQUARE_PRODUCTION_CONFIG = {
  applicationId: 'YOUR_PRODUCTION_APP_ID', // 上线时替换
  locationId: 'YOUR_PRODUCTION_LOCATION_ID', // 上线时替换
  environment: 'production' as const,
  baseUrl: 'https://squareup.com/checkout',
};

// 艺术家定金配置
export const ARTIST_DEPOSITS = {
  'jing': 300,
  'rachel': 100,
  'jas': 100,
  'lauren': 100,
  'annika': 100,
  'maili': 50,
  'keani': 50,
} as const;

// 获取当前环境配置
export const getCurrentSquareConfig = () => {
  // 根据域名判断环境
  if (typeof window !== 'undefined') {
    const isProduction = window.location.hostname === 'booking.patchtattootherapy.com';
    return isProduction ? SQUARE_PRODUCTION_CONFIG : SQUARE_CONFIG;
  }
  return SQUARE_CONFIG;
};

// 生成Square支付链接
export const generateSquarePaymentUrl = (
  artistId: string,
  amount: number,
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  }
) => {
  const config = getCurrentSquareConfig();
  const deposit = ARTIST_DEPOSITS[artistId as keyof typeof ARTIST_DEPOSITS] || amount;
  
  // Square支付参数
  const params = new URLSearchParams({
    // 基本支付信息
    'line_items[0][name]': `Tattoo Deposit - ${getArtistName(artistId)}`,
    'line_items[0][variation_name]': 'Tattoo Consultation Deposit',
    'line_items[0][quantity]': '1',
    'line_items[0][base_price_money][amount]': (deposit * 100).toString(), // Square使用分为单位
    'line_items[0][base_price_money][currency]': 'USD',
    
    // 客户信息
    'prefill[email]': customerInfo.email,
    'prefill[given_name]': customerInfo.name.split(' ')[0] || customerInfo.name,
    'prefill[family_name]': customerInfo.name.split(' ').slice(1).join(' ') || '',
    
    // 跳转URL
    'redirect_url': `${window.location.origin}/booking-success`,
    
    // 商家信息
    'location_id': config.locationId,
    
    // 其他设置
    'note': `Tattoo appointment deposit for ${customerInfo.name}. Phone: ${customerInfo.phone}`,
  });
  
  return `${config.baseUrl}?${params.toString()}`;
};

// 获取艺术家名称
const getArtistName = (artistId: string): string => {
  const artistNames: {[key: string]: string} = {
    'jing': 'Jing (Jingxi Gu)',
    'rachel': 'Rachel Hong',
    'jas': 'Jasmine Hsueh (Jas)',
    'lauren': 'Lauren Hacaga',
    'annika': 'Annika Riggins',
    'maili': 'Maili Cohen',
    'keani': 'Keani Chavez'
  };
  
  return artistNames[artistId] || 'Selected Artist';
};
