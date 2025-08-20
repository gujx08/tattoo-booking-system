import React from 'react';
import { Save } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  message: string;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-4 border-2 border-blue-200 bg-blue-50">
        <div className="flex flex-col items-center text-center">
          {/* 圆形图标 */}
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
            <Save className="w-8 h-8 text-white" />
          </div>
          
          {/* 消息文本 */}
          <p className="text-gray-800 text-lg font-medium leading-relaxed">
            {message}
          </p>
          
          {/* 加载动画 */}
          <div className="mt-4 flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
