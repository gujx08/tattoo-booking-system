import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, AppAction, BookingFormData, ValidationErrors } from '../types';

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
  selectedArtist: undefined
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
    
    case 'RESET_FORM':
      return { 
        ...initialState, 
        currentStep: 1,
        formData: { ...initialFormData },
        validationErrors: {},
        isSubmitting: false,
        selectedArtist: undefined
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