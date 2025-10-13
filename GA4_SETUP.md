# Google Analytics 4 安装文档

## 📊 GA4 配置信息

### 衡量ID
```
G-SKJC24732Z
```

## ✅ 已完成的安装步骤

### 1. 安装依赖包
```bash
npm install react-ga4
```

### 2. 创建GA4配置文件
- **文件位置**: `src/utils/analytics.ts`
- **功能**: 
  - GA4初始化
  - 页面浏览追踪
  - 自定义事件追踪
  - 预约流程追踪

### 3. 在HTML中添加GA4脚本
- **文件位置**: `index.html`
- **位置**: `<head>` 部分
- **方式**: Google gtag.js 直接加载

### 4. 在React应用中初始化
- **文件位置**: `src/main.tsx`
- **时机**: 应用启动时立即初始化

### 5. 添加路由追踪
- **文件位置**: `src/App.tsx`
- **功能**: 自动追踪所有页面浏览
- **组件**: `RouteTracker`

### 6. 添加事件追踪
已在以下关键页面添加事件追踪：

#### a. 艺术家选择页面
- **文件**: `src/components/booking/Step1ArtistSelection.tsx`
- **追踪事件**:
  - 艺术家选择
  - 预约步骤1

#### b. 支付页面
- **文件**: `src/components/booking/PaymentPage.tsx`
- **追踪事件**:
  - 支付开始
  - 艺术家名称
  - 定金金额

#### c. 成功页面
- **文件**: `src/components/booking/SuccessPage.tsx`
- **追踪事件**:
  - 预约完成
  - 艺术家名称
  - 定金金额

## 📈 追踪的事件类型

### 1. 页面浏览 (Page Views)
- 自动追踪所有页面访问
- 包含完整路径和查询参数

### 2. 预约流程 (Booking Flow)
- **Step 1**: 艺术家选择
- **Step 2-6**: 表单填写步骤
- **Payment**: 支付开始
- **Complete**: 预约完成

### 3. 艺术家选择 (Artist Selection)
- 追踪用户选择的艺术家
- 记录艺术家名称

### 4. 支付事件 (Payment Events)
- **Start Payment**: 用户点击支付按钮
- 包含艺术家名称和定金金额

### 5. 预约完成 (Booking Complete)
- 成功页面加载时触发
- 包含艺术家名称和定金金额

## 🔧 自定义追踪函数

### trackPageView(path, title)
追踪页面浏览
```typescript
trackPageView('/booking', 'Booking Page');
```

### trackEvent(category, action, label, value)
追踪自定义事件
```typescript
trackEvent('Button', 'Click', 'Submit Form', 1);
```

### trackBookingStep(step, stepName)
追踪预约步骤
```typescript
trackBookingStep(1, 'Artist Selection');
```

### trackArtistSelection(artistName)
追踪艺术家选择
```typescript
trackArtistSelection('Jing');
```

### trackPaymentStart(artistName, amount)
追踪支付开始
```typescript
trackPaymentStart('Jing', 300);
```

### trackBookingComplete(artistName, amount)
追踪预约完成
```typescript
trackBookingComplete('Jing', 300);
```

### trackConsultationBooking(artistName)
追踪咨询预约
```typescript
trackConsultationBooking('Jing');
```

## 🚀 部署说明

### 生产环境
1. 代码已包含GA4追踪
2. 推送到GitHub会自动触发Netlify部署
3. GA4会在生产环境自动开始收集数据

### 验证GA4是否正常工作
1. 访问 `https://booking.patchtattootherapy.com`
2. 打开浏览器开发者工具 (F12)
3. 切换到 "Network" 标签
4. 筛选 "google-analytics.com" 或 "gtag"
5. 应该能看到GA4请求发送

### 在GA4控制台查看数据
1. 登录 [Google Analytics](https://analytics.google.com/)
2. 选择对应的属性 (G-SKJC24732Z)
3. 查看实时报告
4. 查看事件报告

## 📊 可以在GA4中看到的数据

### 实时报告
- 当前在线用户数
- 实时页面浏览
- 实时事件

### 事件报告
- 页面浏览次数
- 预约流程完成率
- 艺术家选择分布
- 支付转化率

### 转化追踪
建议在GA4中设置以下转化事件：
- `booking_complete` - 预约完成
- `payment_start` - 开始支付
- `artist_selection` - 选择艺术家

## 🔍 调试模式

在开发环境中，GA4会在控制台输出日志：
```
✅ Google Analytics 4 已初始化
```

如果看到错误，会显示：
```
❌ GA4 初始化失败: [错误信息]
```

## 📝 注意事项

1. **隐私合规**: GA4追踪符合GDPR和CCPA要求
2. **数据延迟**: GA4数据可能有24-48小时延迟
3. **实时数据**: 实时报告通常在几分钟内更新
4. **Cookie**: GA4使用Cookie存储用户信息
5. **跨域追踪**: 当前配置支持单域名追踪

## 🎯 下一步优化建议

1. **添加用户ID追踪**: 如果有用户登录系统
2. **增强电商追踪**: 追踪更详细的支付信息
3. **自定义维度**: 添加艺术家类别、定金金额等维度
4. **目标设置**: 在GA4中设置转化目标
5. **受众群体**: 创建自定义受众群体用于再营销

## 📞 技术支持

如果GA4追踪有问题，请检查：
1. 浏览器控制台是否有错误
2. Network标签是否有GA4请求
3. GA4衡量ID是否正确
4. 是否被广告拦截器阻止

---

**安装日期**: 2025-09-02
**安装人员**: AI Assistant
**版本**: GA4 (Google Analytics 4)
**状态**: ✅ 已完成并测试

