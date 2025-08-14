import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, AppAction, BookingFormData, ValidationErrors } from '../types';

// 添加 PaymentInfo 接口
interface PaymentInfo {
  paymentId: string;
  amount: number;
  timestamp: string;
  artist?: string;
  customerName?: string;
  customerEmail?: string;
}

const initialFormData: Partial<BookingFormData> = {
  artistId: '',
  needsHelpChoosing: false,
  name: '',
  email: '',
  phone: '',
  tattooIdea: '',
  referenceImages: [],
  additionalNotes: '',
  instagramReference: '',
  backgroundStory: '',
  placement: '',
  bodyPhotos: [],
  placementCertainty: '',
  openToSuggestions: '',
  colorPreference: '',
  skinTone: '',
  isFirstTattoo: '',
  additionalInfo: '',
  needsConsultation: undefined,
  consultationDate: '',
  consultationTime: ''
};

const initialState: AppState = {
  currentStep: 1, // 正常起始步骤
  formData: initialFormData,
  validationErrors: {},
  isSubmitting: false,
  selectedArtist: undefined,
  paymentInfo: undefined // 添加支付信息状态
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'UPDATE_FORM_DATA':
      return { 
        ...state, 
        formData: { ...state.formData, ...action.payload } 
      };
    
    case 'SET_VALIDATION_ERRORS':
      return { ...state, validationErrors: action.payload };
    
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    
    case 'SET_SELECTED_ARTIST':
      return { ...state, selectedArtist: action.payload };
    
    case 'SET_PAYMENT_SUCCESS':
      return {
        ...state,
        paymentInfo: action.payload
      };
      
    case 'RESET_BOOKING':
      return {
        ...initialState,
        // 保持一些全局设置，只重置预约相关数据
        currentStep: 0
      };
    
    case 'RESET_FORM':
      return { 
        ...initialState, 
        currentStep: 1,
        formData: { ...initialFormData },
        validationErrors: {},
        isSubmitting: false,
        selectedArtist: undefined,
        paymentInfo: undefined
      };
    
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// 导出 PaymentInfo 类型供其他组件使用
export type { PaymentInfo };
