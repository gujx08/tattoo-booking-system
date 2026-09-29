export interface Artist {
  id: string;
  name: string;
  displayName: string;
  category: string;
  experience?: string;
  deposit: number;
  bookingUrl?: string; // ChatWme 预约链接；未设置时个人主页不显示预约按钮
  priceRange?: string;
  specialties?: string[];
  description: string;
  instagram?: string;
  avatar: string;
  video: string;
  portfolio: string[];
  pricing?: {
    dayRate: number;
    halfDay: string;
    minimum: string;
    touchUp: string;
    coverUpExtra: string;
    flashDiscount: string;
  };
  specialNote?: string;
  hidden?: boolean; // 是否隐藏艺术家卡片
}

