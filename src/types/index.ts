export interface Artist {
  id: string;
  name: string;
  displayName: string;
  category: string;
  experience?: string;
  deposit: number;
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

export interface BookingFormData {
  // Step 1: Artist Selection
  artistId: string;
  needsHelpChoosing: boolean;
  
  // Step 2: Basic Info
  name: string;
  email: string;
  phone: string;
  
  // Step 3: Tattoo Idea + References (merged)
  tattooIdea: string;
  referenceImages: File[];
  additionalNotes: string;
  instagramReference: string;
  backgroundStory: string;
  
  // Step 4: Size, Shape, Placement
  placement: string;
  bodyPhotos: File[];
  placementCertainty: string;
  openToSuggestions: string;
  
  // Step 5: Color Preferences + Skin Tone (修复：将skinTone移到这里)
  colorPreference: string;
  skinTone: string;
  
  // Step 6: Personal Info (修复：删除skinTone，保持其他字段)
  isFirstTattoo: string;
  additionalInfo: string;
  
  // Consultation
  needsConsultation?: boolean;
  consultationDate?: string;
  consultationTime?: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface AppState {
  currentStep: number;
  formData: Partial<BookingFormData>;
  validationErrors: ValidationErrors;
  isSubmitting: boolean;
  selectedArtist?: Artist;
  showNotification: boolean;
  notificationMessage: string;
}

export type AppAction = 
  | { type: 'SET_STEP'; payload: number }
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<BookingFormData> }
  | { type: 'SET_VALIDATION_ERRORS'; payload: ValidationErrors }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_SELECTED_ARTIST'; payload: Artist }
  | { type: 'SHOW_NOTIFICATION'; payload: string }
  | { type: 'HIDE_NOTIFICATION' }
  | { type: 'RESET_FORM' };

// 导出额外的实用类型
export type StepNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles: number;
  required?: boolean;
  label: string;
  description?: string;
  acceptedFormats?: string[];
}

// 导出常量
export const SKIN_TONE_OPTIONS = [
  'Dark',
  'Medium-Dark',
  'Medium-Light', 
  'Light'
] as const;

export const COLOR_PREFERENCE_OPTIONS = [
  'I like vibrant colors, the more vivid, the better.',
  'I like colors, but not too vibrant.',
  'I only like black and grey.',
  'I like it to be mostly black and grey, but with a hint of single color, e.g. a bit of red.',
  'I\'m not sure, I need suggestions from the artist and then make a decision.',
  'I\'m not sure, but I\'m open for the artist to make the decision for me.'
] as const;

export const FIRST_TATTOO_OPTIONS = [
  'Yes it is, I never had tattoos before',
  'I have many other tattoos, I\'m covered',
  'I have 1-2 small walk-in tattoos from when I was young'
] as const;