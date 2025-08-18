export const validateEmail = (email: string): boolean => {
  if (!email || email.trim() === '') {
    return false;
  }
  
  const trimmedEmail = email.trim();
  
  // 更严格的邮箱正则表达式 - 要求@前至少1个字符，@后有域名和至少2字符的顶级域名
  const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._%-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
  
  // Check basic format
  if (!emailRegex.test(trimmedEmail)) {
    return false;
  }
  
  // 额外检查：确保@前后都有有效内容
  const atIndex = trimmedEmail.indexOf('@');
  const dotIndex = trimmedEmail.lastIndexOf('.');
  
  // 必须有@和.，且.在@之后
  if (atIndex === -1 || dotIndex === -1 || dotIndex <= atIndex) {
    return false;
  }
  
  // @前必须有内容
  if (atIndex === 0) {
    return false;
  }
  
  // @后到最后一个.之间必须有内容
  if (dotIndex - atIndex <= 1) {
    return false;
  }
  
  // 最后一个.后必须有至少2个字符
  if (trimmedEmail.length - dotIndex <= 2) {
    return false;
  }
  
  // Check for common errors
  if (trimmedEmail.includes('..') || trimmedEmail.startsWith('.') || trimmedEmail.endsWith('.')) {
    return false;
  }
  
  return true;
};

export const validatePhone = (phone: string): boolean => {
  if (!phone || phone.trim() === '') {
    return false;
  }
  
  // Remove all non-digit characters for validation
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check length (at least 10 digits, max 15)
  if (cleanPhone.length < 10 || cleanPhone.length > 15) {
    return false;
  }
  
  return true;
};

export const getEmailError = (email: string): string => {
  if (!email || email.trim() === '') {
    return 'Email is required';
  }
  
  const trimmedEmail = email.trim();
  
  // 使用更严格的邮箱正则表达式
  const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._%-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(trimmedEmail)) {
    return 'Please enter a valid email address';
  }
  
  // 额外验证
  const atIndex = trimmedEmail.indexOf('@');
  const dotIndex = trimmedEmail.lastIndexOf('.');
  
  // 必须有@和.，且.在@之后
  if (atIndex === -1 || dotIndex === -1 || dotIndex <= atIndex) {
    return 'Please enter a valid email address';
  }
  
  // @前必须有内容
  if (atIndex === 0) {
    return 'Please enter a valid email address';
  }
  
  // @后到最后一个.之间必须有内容
  if (dotIndex - atIndex <= 1) {
    return 'Please enter a complete email address (missing domain)';
  }
  
  // 最后一个.后必须有至少2个字符
  if (trimmedEmail.length - dotIndex <= 2) {
    return 'Please enter a complete email address (missing domain extension)';
  }
  
  if (trimmedEmail.includes('..') || trimmedEmail.startsWith('.') || trimmedEmail.endsWith('.')) {
    return 'Please enter a valid email address';
  }
  
  return '';
};

export const getPhoneError = (phone: string): string => {
  if (!phone || phone.trim() === '') {
    return 'Phone number is required';
  }
  
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length < 10) {
    return 'Please enter a complete phone number (at least 10 digits)';
  }
  
  if (cleanPhone.length > 15) {
    return 'Phone number is too long';
  }
  
  return '';
};

export const validateFileSize = (file: File, maxSizeMB: number = 5): boolean => {
  return file.size <= maxSizeMB * 1024 * 1024;
};

export const validateFileType = (file: File, allowedTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif']): boolean => {
  // 检查文件类型和文件扩展名
  const fileName = file.name.toLowerCase();
  const isHeic = fileName.endsWith('.heic') || fileName.endsWith('.heif');
  
  return allowedTypes.includes(file.type) || isHeic;
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};