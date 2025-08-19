# Stripe Payment Links 集成说明

## 🎯 集成概述

本项目已成功集成Stripe Payment Links支付功能，替换了原有的Square支付系统。

## 📋 功能特点

### ✅ 已完成的功能
- **保持现有UI设计** - 完全保持原有的页面布局和样式
- **艺术家定金映射** - 根据选择的纹身师自动选择对应的支付链接
- **简单链接跳转** - 无需复杂SDK，直接跳转到Stripe支付页面
- **支付成功处理** - 支付成功后跳转回成功页面

### 💰 定金配置
- **Jing (Lead Artist)**: $300 定金
- **Rachel, Jasmine, Lauren, Annika**: $100 定金  
- **Maili, Keani (Apprentices)**: $50 定金

## 🔗 Payment Links配置

### $300 定金 (Jing)
```
https://buy.stripe.com/00w6oHgLY6Zf5WW45Gfw400
```

### $100 定金 (Rachel, Jasmine, Lauren, Annika)
```
https://buy.stripe.com/3cIeVd8fsabr0CC31Cfw401
```

### $50 定金 (Maili, Keani)
```
https://buy.stripe.com/00w5kD9jwerH9988lWfw402
```

## 📁 修改的文件

### 新增文件
- `src/config/stripeConfig.ts` - Stripe配置文件

### 修改文件
- `src/components/booking/PaymentPage.tsx` - 支付页面组件
- `booking-success.html` - 成功页面（更新日志信息）

### 删除文件
- `src/config/squareConfig.ts` - 旧的Square配置
- `squareConfig.ts` - 根目录的旧Square配置

## 🚀 使用方法

1. **启动开发服务器**
   ```bash
   npm install
   npm run dev
   ```

2. **测试预约流程**
   - 访问 http://localhost:5173
   - 完成预约步骤直到支付页面
   - 点击"Pay with Stripe"按钮
   - 跳转到Stripe支付页面完成支付

## 🔧 技术实现

### 核心函数
- `getStripePaymentLink(artistId, customerEmail?)` - 获取对应艺术家的支付链接，可选择预填充客户邮箱
- `getDepositAmount(artistId)` - 获取对应艺术家的定金金额
- `getArtistName(artistId)` - 获取艺术家名称

### 支付流程
1. 用户完成预约信息填写
2. 到达支付页面，显示定金金额
3. 点击支付按钮，获取对应艺术家的Stripe支付链接
4. 跳转到Stripe支付页面
5. 支付成功后返回成功页面

## ✅ 测试验证

- [x] 开发服务器正常启动
- [x] 预约流程完整可用
- [x] 支付按钮正确显示定金金额
- [x] 支付链接正确映射
- [x] UI样式完全保持原样

## 🎨 UI保持不变

- ✅ 页面布局完全保持原样
- ✅ 所有样式和设计不变
- ✅ 支付按钮外观一致
- ✅ 响应式设计保持
- ✅ 用户体验无变化

## 🔒 安全特性

- 使用Stripe官方Payment Links
- 支付页面由Stripe托管
- 支持所有主流支付方式
- 符合PCI DSS安全标准

## 📞 支持

如有问题，请联系开发团队或查看Stripe官方文档。
