# 预订草稿邮件和数据保存功能

## 🎯 功能概述

在咨询选择页面添加了邮件发送功能，确保管理员能收到包含完整表单数据的预订草稿邮件。

## ✅ 已实现的功能

### 1. **邮件发送功能**
- ✅ 在咨询选择页面触发邮件发送
- ✅ 包含完整的6步表单数据
- ✅ 发送给管理员邮箱：`info@patchtattootherapy.com`
- ✅ 邮件内容包含所有用户填写的信息

### 2. **数据保存功能**
- ✅ 保存完整预订数据到localStorage
- ✅ 支付页面能恢复保存的数据
- ✅ 数据包含时间戳和状态信息

### 3. **流程优化**
- ✅ 无论选择什么咨询选项，都直接跳转到支付页面
- ✅ 保持所有现有UI界面和样式不变
- ✅ 邮件发送失败不影响流程继续

## 🔧 技术实现

### 修改的文件

#### 1. `src/services/emailService.ts`
- 添加了 `sendBookingDraftEmail()` 函数
- 配置了预订草稿邮件模板
- 包含完整的表单数据处理逻辑

#### 2. `src/components/booking/ConsultationChoice.tsx`
- 修改了 `handleConsultationChoice()` 函数
- 添加了数据保存和邮件发送逻辑
- 改为直接跳转到支付页面

#### 3. `src/components/booking/PaymentPage.tsx`
- 添加了从localStorage恢复数据的功能
- 使用 `useEffect` 在组件加载时恢复数据

### 邮件内容包含

#### Step 1 - 纹身师选择
- 选择的纹身师信息

#### Step 2 - 基本信息
- 姓名、邮箱、电话

#### Step 3 - 纹身想法
- 纹身想法描述
- 参考图片数量
- 图片解释文字
- Instagram链接
- 背景故事

#### Step 4 - 尺寸位置
- 尺寸形状位置描述
- 身体部位照片数量
- 位置确定程度
- 身体评估开放度

#### Step 5 - 颜色偏好
- 颜色偏好选择
- 肤色选择

#### Step 6 - 个人信息
- 纹身经验
- 额外信息

#### 咨询选择
- 咨询需求：Yes/No
- 预期定金金额
- 选择时间戳

## 🧪 测试方法

### 1. 使用测试页面
访问：`http://localhost:5173/test-booking-draft.html`

### 2. 测试步骤
1. **测试完整预订流程** - 模拟用户填写6步表单
2. **测试咨询选择页面** - 模拟用户选择咨询选项
3. **查看邮件内容预览** - 验证邮件内容完整性
4. **测试支付页面数据恢复** - 验证数据恢复功能
5. **访问主应用测试实际功能**

### 3. 实际测试流程
1. 访问主应用：`http://localhost:5173`
2. 完成6步表单填写
3. 到达咨询选择页面
4. 点击任一选项（Yes/No）
5. 检查控制台日志确认邮件发送
6. 验证跳转到支付页面
7. 检查支付页面显示正确的预订摘要

## 📧 邮件配置

### 收件人信息
- **收件人**: info@patchtattootherapy.com
- **主题**: New Booking Request - Pending Payment
- **状态**: PENDING_PAYMENT

### 邮件模板参数
```javascript
{
  // 客户基本信息
  customer_name: string,
  customer_email: string,
  customer_phone: string,
  
  // 纹身师信息
  selected_artist: string,
  artist_id: string,
  
  // 纹身详情（所有6步表单数据）
  tattoo_idea: string,
  inspiration_images: number,
  additional_notes: string,
  instagram_link: string,
  background_story: string,
  size_placement: string,
  placement_photos: number,
  placement_certainty: string,
  body_assessment: string,
  color_preference: string,
  skin_tone: string,
  tattoo_experience: string,
  additional_info: string,
  
  // 咨询信息
  needs_consultation: 'Yes' | 'No',
  deposit_amount: number,
  
  // 时间信息
  timestamp: string,
  booking_date: string,
  booking_time: string
}
```

## 💾 数据存储

### localStorage结构
```javascript
{
  formData: {
    // 完整的6步表单数据
  },
  selectedArtist: {
    // 选择的纹身师信息
  },
  consultationChoice: boolean,
  timestamp: string,
  depositAmount: number,
  status: 'PENDING_PAYMENT'
}
```

## 🎯 用户操作流程

1. **用户填写6步表单** → 跳转到咨询选择页面
2. **选择咨询选项** → 发送预订草稿邮件 + 保存数据
3. **直接跳转到支付页面** → 显示预订摘要
4. **完成支付** → 进入成功页面

## ✅ 保持不变的部分

- ✅ 所有现有UI组件和样式
- ✅ 咨询选择页面的布局和按钮
- ✅ 表单的6步流程
- ✅ 现有的路由配置
- ✅ PaymentPage的支付逻辑

## 🚨 注意事项

1. **邮件发送失败不影响流程** - 即使邮件发送失败，用户仍能继续支付流程
2. **数据备份** - 所有数据都保存在localStorage中作为备份
3. **错误处理** - 包含完整的错误处理和日志记录
4. **UI不变** - 严格按照要求，没有修改任何现有UI

## 📞 支持

如有问题，请检查：
1. 浏览器控制台日志
2. EmailJS配置是否正确
3. 网络连接是否正常
4. localStorage数据是否正确保存
