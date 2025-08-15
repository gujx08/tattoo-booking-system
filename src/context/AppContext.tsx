import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// 类型定义
export interface ClientInfo {
  name: string;
  email: string;
  phone: string;
}

export interface TattooIdea {
  description: string;
  inspirationImages: File[];
  explanation?: string;
  instagramLink?: string;
  backgroundStory?: string;
}

export interface PlacementInfo {
  description: string;
  bodyPhotos: File[];
  certaintyLevel: string;
  assessmentComfort: string;
}

export interface PaymentInfo {
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  timestamp: string;
  receiptUrl?: string;
}

export interface AppState {
  currentStep: number;
  selectedArtist: string;
  clientInfo: ClientInfo;
  tattooIdea: TattooIdea;
  placementInfo: PlacementInfo;
  colorPreference: string;
  personalInfo: {
    skinTone: string;
    firstTattoo: string;
  };
  needsConsultation: boolean;
  consultationTime?: string;
  paymentInfo?: PaymentInfo;
}

// Action types
export type AppAction = 
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_SELECTED_ARTIST'; payload: string }
  | { type: 'SET_CLIENT_INFO'; payload: ClientInfo }
  | { type: 'SET_TATTOO_IDEA'; payload: TattooIdea }
  | { type: 'SET_PLACEMENT_INFO'; payload: PlacementInfo }
  | { type: 'SET_COLOR_PREFERENCE'; payload: string }
  | { type: 'SET_PERSONAL_INFO'; payload: { skinTone: string; firstTattoo: string } }
  | { type: 'SET_CONSULTATION_CHOICE'; payload: boolean }
  | { type: 'SET_CONSULTATION_TIME'; payload: string }
  | { type: 'SET_PAYMENT_INFO'; payload: PaymentInfo }
  | { type: 'RESET_FORM' };

// Initial state
const initialState: AppState = {
  currentStep: 1,
  selectedArtist: '',
  clientInfo: {
    name: '',
    email: '',
    phone: ''
  },
  tattooIdea: {
    description: '',
    inspirationImages: []
  },
  placementInfo: {
    description: '',
    bodyPhotos: [],
    certaintyLevel: '',
    assessmentComfort: ''
  },
  colorPreference: '',
  personalInfo: {
    skinTone: '',
    firstTattoo: ''
  },
  needsConsultation: false
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_SELECTED_ARTIST':
      return { ...state, selectedArtist: action.payload };
    case 'SET_CLIENT_INFO':
      return { ...state, clientInfo: action.payload };
    case 'SET_TATTOO_IDEA':
      return { ...state, tattooIdea: action.payload };
    case 'SET_PLACEMENT_INFO':
      return { ...state, placementInfo: action.payload };
    case 'SET_COLOR_PREFERENCE':
      return { ...state, colorPreference: action.payload };
    case 'SET_PERSONAL_INFO':
      return { ...state, personalInfo: action.payload };
    case 'SET_CONSULTATION_CHOICE':
      return { ...state, needsConsultation: action.payload };
    case 'SET_CONSULTATION_TIME':
      return { ...state, consultationTime: action.payload };
    case 'SET_PAYMENT_INFO':
      return { ...state, paymentInfo: action.payload };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
