// src/services/emailService.ts
// 安全版本 - 不会在导入时立即初始化EmailJS

// 延迟导入EmailJS，避免立即执行
let emailjs: any = null;

// EmailJS配置
const EMAILJS_CONFIG = {
  serviceId: 'service_lp4pjsb',
  publicKey: 'ct8snDhw429TxbuI_',
  templates: {
    bookingConfirmation: 'template_26uphex', // 使用正确的模板ID
    bookingDraft: 'template_26uphex' // 预订草稿邮件模板ID（暂时使用相同模板）
  }
};

// 检查配置是否正确的函数
const validateEmailConfig = () => {
  const requiredFields = ['serviceId', 'publicKey', 'templates.bookingConfirmation'];
  for (const field of requiredFields) {
    const keys = field.split('.');
    let value = EMAILJS_CONFIG;
    for (const key of keys) {
      value = value[key];
    }
    // 修复验证逻辑：只检查占位符，不检查 template_ 前缀
    if (!value || value.includes('YOUR_') || value === 'template_user_confirm') {
      console.warn(`⚠️ EmailJS配置错误: ${field} = ${value}`);
      return false;
    }
  }
  console.log('✅ EmailJS配置验证通过');
  return true;
};

// 纹身师邮箱映射
const artistEmails: { [key: string]: string } = {
  'Jing': 'jing@patchtattootherapy.com',
  'Rachel Hong': 'rachel@patchtattootherapy.com', 
  'Jasmine Hsueh': 'jasmine@patchtattootherapy.com',
  'Lauren Hacaga': 'lauren@patchtattootherapy.com',
  'Annika Riggins': 'annika@patchtattootherapy.com',
  'Maili Cohen': 'maili@patchtattootherapy.com',
  'Keani Chavez': 'keani@patchtattootherapy.com'
};

// 安全的EmailJS初始化函数
export const initializeEmailJS = async () => {
  try {
    // 只有在需要时才导入EmailJS
    if (!emailjs) {
      const emailjsModule = await import('@emailjs/browser');
      emailjs = emailjsModule.default;
    }
    
    console.log('正在初始化EmailJS...');
    emailjs.init(EMAILJS_CONFIG.publicKey);
    console.log('EmailJS初始化完成！');
    return { success: true };
  } catch (error) {
    console.error('EmailJS初始化失败:', error);
    return { success: false, error };
  }
};

// 发送预约确认邮件
export const sendBookingConfirmationEmail = async (bookingData: any) => {
  try {
    // 首先验证配置
    if (!validateEmailConfig()) {
      console.warn('⚠️ EmailJS配置不完整，跳过邮件发送');
      return { 
        success: false, 
        error: 'EmailJS configuration incomplete',
        userMessage: 'Email service temporarily unavailable' 
      };
    }

    // 确保EmailJS已经初始化
    if (!emailjs) {
      const initResult = await initializeEmailJS();
      if (!initResult.success) {
        throw new Error('EmailJS初始化失败');
      }
    }

    console.log('📧 准备发送确认邮件');
    console.log('📋 原始预约数据：', bookingData);

    const templateParams = {
      // EmailJS基础字段 - 这些是必需的
      name: bookingData.name || 'Client',
      email: bookingData.email || 'test@example.com',
      
      // 收件人信息
      to_name: bookingData.name || 'Client',
      to_email: bookingData.email || 'test@example.com',
      
      // 纹身师信息
      artist_name: bookingData.selectedArtist || 'Artist',
      artist_email: artistEmails[bookingData.selectedArtist] || 'info@patchtattootherapy.com',
      
      // 纹身详情
      tattoo_idea: bookingData.tattooIdea || 'Custom design',
      placement: bookingData.placement || 'Not specified',
      color_preference: bookingData.colorPreference || 'Not specified',
      
      // 咨询信息
      consultation_needed: bookingData.needsConsultation ? 'Yes' : 'No',
      consultation_date: bookingData.consultationDate || 'To be scheduled',
      consultation_time: bookingData.consultationTime || 'To be scheduled',
      
      // 预约时间信息
      booking_date: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      booking_time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    console.log('📨 邮件模板参数：', templateParams);
    console.log('🔧 EmailJS配置：', {
      serviceId: EMAILJS_CONFIG.serviceId,
      templateId: EMAILJS_CONFIG.templates.bookingConfirmation,
      publicKey: EMAILJS_CONFIG.publicKey.substring(0, 10) + '...' // 只显示前10位用于调试
    });

    console.log('🚀 开始发送邮件...');

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templates.bookingConfirmation,
      templateParams
    );

    console.log('✅ 邮件发送成功！', response);
    return { success: true, response };

  } catch (error) {
    console.error('❌ 邮件发送失败，详细错误信息：', error);
    
    // 更详细的错误分析
    if (error.status) {
      console.error('🔍 HTTP状态码：', error.status);
    }
    if (error.text) {
      console.error('🔍 错误文本：', error.text);
    }
    if (error.message) {
      console.error('🔍 错误消息：', error.message);
    }
    
    // 根据错误类型提供不同的处理
    let userMessage = 'Email service temporarily unavailable';
    if (error.message && error.message.includes('template')) {
      userMessage = 'Email template configuration error';
    } else if (error.message && error.message.includes('network')) {
      userMessage = 'Network connectivity issue';
    }
    
    return { 
      success: false, 
      error: error.message || error,
      userMessage 
    };
  }
};

// 发送预订草稿邮件给管理员
export const sendBookingDraftEmail = async (bookingData: any) => {
  try {
    // 首先验证配置
    if (!validateEmailConfig()) {
      console.warn('⚠️ EmailJS配置不完整，跳过邮件发送');
      return { 
        success: false, 
        error: 'EmailJS configuration incomplete',
        userMessage: 'Email service temporarily unavailable' 
      };
    }

    // 确保EmailJS已经初始化
    if (!emailjs) {
      const initResult = await initializeEmailJS();
      if (!initResult.success) {
        throw new Error('EmailJS初始化失败');
      }
    }

    console.log('📧 准备发送预订草稿邮件');
    console.log('📋 预订数据：', bookingData);

    const templateParams = {
      // 邮件基本信息
      to_name: 'Patch Tattoo Therapy Management',
      to_email: 'info@patchtattootherapy.com',
      subject: 'New Booking Request - Pending Payment',
      timestamp: bookingData.timestamp || new Date().toISOString(),
      status: 'PENDING_PAYMENT',
      
      // 客户基本信息
      customer_name: bookingData.formData?.name || '',
      customer_email: bookingData.formData?.email || '',
      customer_phone: bookingData.formData?.phone || '',
      
      // 纹身师信息
      selected_artist: (() => {
        // 如果是"Help Choosing Artist"流程，显示"Need Recommendation"
        if (bookingData.formData?.needsHelpChoosing) {
          return 'Need Recommendation';
        }
        // 否则显示选中的艺术家
        return bookingData.selectedArtist?.displayName || bookingData.selectedArtist?.name || 'Not Selected';
      })(),
      artist_id: bookingData.selectedArtist?.id || '',
      
      // Step 3 - 纹身想法
      tattoo_idea: bookingData.formData?.tattooIdea || '',
      inspiration_images: bookingData.formData?.referenceImages?.length || 0,
      additional_notes: bookingData.formData?.additionalNotes || '',
      instagram_link: bookingData.formData?.instagramReference || '',
      background_story: bookingData.formData?.backgroundStory || '',
      
      // Step 4 - 尺寸位置
      size_placement: bookingData.formData?.placement || '',
      placement_photos: bookingData.formData?.bodyPhotos?.length || 0,
      placement_certainty: bookingData.formData?.placementCertainty || '',
      body_assessment: bookingData.formData?.openToSuggestions || '',
      
      // Step 5 - 颜色偏好
      color_preference: bookingData.formData?.colorPreference || '',
      skin_tone: bookingData.formData?.skinTone || '',
      
      // Step 6 - 个人信息
      tattoo_experience: bookingData.formData?.isFirstTattoo || '',
      additional_info: bookingData.formData?.additionalInfo || '',
      
      // 咨询信息 - 显示具体的咨询时间或"No consultation needed"
      needs_consultation: (() => {
        if (bookingData.consultationChoice) {
          // 需要咨询，显示具体时间
          const consultationDate = bookingData.formData?.consultationDate || '';
          const consultationTime = bookingData.formData?.consultationTime || '';
          if (consultationDate && consultationTime) {
            return `Yes - ${consultationDate} at ${consultationTime}`;
          } else {
            return 'Yes - consultation time to be scheduled';
          }
        } else {
          // 不需要咨询
          return 'No consultation needed';
        }
      })(),
      deposit_amount: bookingData.depositAmount || 0,
      
      // 预约时间信息
      booking_date: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      booking_time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    console.log('📨 预订草稿邮件模板参数：', templateParams);

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templates.bookingDraft,
      templateParams
    );

    console.log('✅ 预订草稿邮件发送成功！', response);
    return { success: true, response };

  } catch (error) {
    console.error('❌ 预订草稿邮件发送失败：', error);
    
    return { 
      success: false, 
      error: error.message || error,
      userMessage: 'Failed to send booking draft email' 
    };
  }
};

// 测试函数
export const testEmailService = async () => {
  console.log('测试邮件服务...');
  
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    selectedArtist: 'Jing',
    tattooIdea: 'A small dragon tattoo',
    placement: 'On the forearm',
    colorPreference: 'Black and grey',
    needsConsultation: true,
    consultationDate: '2025-08-15',
    consultationTime: '2:00 PM'
  };

  return await sendBookingConfirmationEmail(testData);
};