import React, { useEffect, useRef, useState } from 'react';
import { CreditCard, AlertCircle, Loader2 } from 'lucide-react';

interface SquarePaymentFormProps {
  applicationId: string;
  locationId: string;
  environment: 'sandbox' | 'production';
  amount: number;
  onPaymentSuccess: (result: any) => void;
  onPaymentError: (error: any) => void;
  disabled?: boolean;
}

const SquarePaymentForm: React.FC<SquarePaymentFormProps> = ({
  applicationId,
  locationId,
  environment,
  amount,
  onPaymentSuccess,
  onPaymentError,
  disabled = false
}) => {
  const [status, setStatus] = useState<'initializing' | 'loading' | 'ready' | 'error'>('initializing');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const cardInstanceRef = useRef<any>(null);
  const paymentsInstanceRef = useRef<any>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // 防止重复初始化
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const timer = setTimeout(() => {
      initializeSquarePayments();
    }, 500);

    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (cardInstanceRef.current) {
      try {
        cardInstanceRef.current.destroy();
      } catch (e) {
        // 忽略清理错误
      }
      cardInstanceRef.current = null;
    }
  };

  const initializeSquarePayments = async () => {
    console.log('🚀 开始Square支付初始化...');
    setStatus('loading');
    setErrorMessage('');

    try {
      // 验证容器是否存在
      if (!cardContainerRef.current) {
        throw new Error('支付容器未准备好');
      }

      // 等待并加载Square SDK
      const Square = await loadSquareSDK();
      console.log('✅ Square SDK加载成功');

      // 初始化支付对象
      const payments = Square.payments(applicationId, locationId);
      paymentsInstanceRef.current = payments;
      console.log('✅ Square Payments初始化成功');

      // 创建卡片支付组件
      const card = await payments.card({
        style: {
          '.input-container': {
            borderColor: '#d1d5db',
            borderRadius: '8px',
            borderWidth: '1px',
            fontSize: '16px',
            padding: '16px',
            backgroundColor: '#ffffff'
          },
          '.input-container.is-focus': {
            borderColor: '#3b82f6'
          },
          '.input-container.is-error': {
            borderColor: '#ef4444'
          },
          '.message-text': {
            color: '#ef4444',
            fontSize: '14px'
          }
        }
      });

      console.log('✅ Square Card组件创建成功');

      // 将卡片附加到DOM
      await card.attach(cardContainerRef.current);
      cardInstanceRef.current = card;

      console.log('✅ Square Card附加成功');
      setStatus('ready');

    } catch (error: any) {
      console.error('❌ Square初始化失败:', error);
      setErrorMessage(error.message || '支付系统初始化失败');
      setStatus('error');
    }
  };

  const loadSquareSDK = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      // 检查是否已经加载
      if ((window as any).Square) {
        console.log('Square SDK已存在');
        resolve((window as any).Square);
        return;
      }

      console.log('开始加载Square SDK...');

      // 移除可能存在的旧脚本
      const existingScript = document.querySelector('script[src*="square.js"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.src = 'https://sandbox.web.squarecdn.com/v1/square.js';
      script.type = 'text/javascript';
      script.async = true;

      script.onload = () => {
        console.log('Square SDK脚本加载完成');
        // 等待Square对象可用
        const waitForSquare = () => {
          if ((window as any).Square) {
            console.log('Square对象可用');
            resolve((window as any).Square);
          } else {
            setTimeout(waitForSquare, 50);
          }
        };
        waitForSquare();
      };

      script.onerror = (error) => {
        console.error('Square SDK加载失败:', error);
        reject(new Error('无法加载Square支付系统'));
      };

      document.head.appendChild(script);

      // 设置超时
      setTimeout(() => {
        reject(new Error('Square SDK加载超时'));
      }, 15000);
    });
  };

  const handlePayment = async () => {
    if (!cardInstanceRef.current || isProcessing || !paymentsInstanceRef.current) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      console.log('💳 开始处理支付...');

      // 获取支付令牌
      const tokenResult = await cardInstanceRef.current.tokenize();

      if (tokenResult.status === 'OK') {
        console.log('✅ 支付令牌获取成功');

        // 这里应该调用你的后端API来处理实际支付
        // 目前我们模拟成功的支付处理
        const paymentResult = await simulatePaymentProcessing(tokenResult.token, amount);

        if (paymentResult.success) {
          console.log('✅ 支付处理成功');
          onPaymentSuccess({
            paymentId: paymentResult.paymentId,
            token: tokenResult.token,
            amount: amount,
            last4: tokenResult.details?.card?.last4 || 'xxxx'
          });
        } else {
          throw new Error(paymentResult.error || '支付处理失败');
        }

      } else {
        const errors = tokenResult.errors || [];
        const errorMessage = errors.length > 0 ? errors[0].message : '请检查您的卡片信息';
        throw new Error(errorMessage);
      }

    } catch (error: any) {
      console.error('❌ 支付处理失败:', error);
      setErrorMessage(error.message || '支付失败，请重试');
      onPaymentError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  // 模拟支付处理（在真实环境中，这应该是对你后端的API调用）
  const simulatePaymentProcessing = async (token: string, amount: number): Promise<{success: boolean, paymentId?: string, error?: string}> => {
    console.log('🔄 模拟支付处理...', { token: token.substring(0, 20) + '...', amount });
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // 模拟成功响应
    return {
      success: true,
      paymentId: `sq_payment_${Date.now()}`
    };
  };

  const handleRetry = () => {
    cleanup();
    isInitializedRef.current = false;
    setStatus('initializing');
    const timer = setTimeout(() => {
      initializeSquarePayments();
    }, 1000);
  };

  // 渲染不同状态
  if (status === 'initializing') {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Card Information
          </label>
          <div className="min-h-[80px] border border-gray-300 rounded-lg bg-white flex items-center justify-center">
            <div className="text-gray-500 text-sm">准备支付表单...</div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Card Information
          </label>
          <div className="min-h-[80px] border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
            <div className="flex items-center space-x-3 text-gray-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">正在加载安全支付表单...</span>
            </div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">请稍候，正在连接支付系统</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800 mb-1">支付表单加载失败</h4>
              <p className="text-sm text-red-700 mb-3">{errorMessage}</p>
              <button 
                onClick={handleRetry}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
              >
                重新尝试
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 支付表单就绪
  return (
    <div className="space-y-4">
      {/* Square Card Container */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Card Information
        </label>
        <div 
          ref={cardContainerRef}
          className="min-h-[80px] border border-gray-300 rounded-lg bg-white"
        />
      </div>

      {/* 错误显示 */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* 测试卡信息 */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800 font-medium mb-2">🧪 测试模式 - 使用以下测试卡:</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
          <div><strong>Visa:</strong> 4111 1111 1111 1111</div>
          <div><strong>到期:</strong> 12/25</div>
          <div><strong>Mastercard:</strong> 5555 5555 5555 4444</div>
          <div><strong>CVV:</strong> 123</div>
        </div>
      </div>

      {/* 支付按钮 */}
      <button
        onClick={handlePayment}
        disabled={disabled || isProcessing}
        className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-lg font-medium transition-colors ${
          disabled || isProcessing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>处理支付中...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            <span>支付 ${amount}</span>
          </>
        )}
      </button>

      {/* 安全信息 */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          🔒 您的支付信息由Square安全加密保护
        </p>
      </div>
    </div>
  );
};

export default SquarePaymentForm;
