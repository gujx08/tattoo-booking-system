import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, ChevronDown } from 'lucide-react';
import Button from '../common/Button';
import { sendBookingDraftEmail } from '../../services/emailService';

const ConsultationScheduling: React.FC = () => {
  const { state, dispatch } = useApp();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // 获取选中的纹身师名字
  const getSelectedArtistName = () => {
    if (state.selectedArtist) {
      return state.selectedArtist.displayName || state.selectedArtist.name;
    }
    
    // 如果没有selectedArtist，根据artistId查找
    const artistNames: {[key: string]: string} = {
      'jing': 'Jing',
      'rachel': 'Rachel Hong', 
      'jas': 'Jasmine Hsueh (Jas)',
      'lauren': 'Lauren Hacaga',
      'annika': 'Annika Riggins',
      'maili': 'Maili Cohen',
      'keani': 'Keani Chavez'
    };
    
    return artistNames[state.formData.artistId || ''] || 'your selected artist';
  };

  // 生成未来8周的周三日期
  const generateWednesdayDates = () => {
    const dates = [];
    const today = new Date();
    const currentDay = today.getDay();
    
    // 找到下一个周三
    let daysUntilWednesday = (3 - currentDay + 7) % 7;
    if (daysUntilWednesday === 0) daysUntilWednesday = 7;
    
    const nextWednesday = new Date(today);
    nextWednesday.setDate(today.getDate() + daysUntilWednesday);
    
    // 生成8个周三的日期
    for (let i = 0; i < 8; i++) {
      const date = new Date(nextWednesday);
      date.setDate(nextWednesday.getDate() + (i * 7));
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      });
    }
    
    return dates;
  };

  const timeSlots = [
    { value: '20:00-20:30', label: '8:00 PM - 8:30 PM' },
    { value: '20:45-21:15', label: '8:45 PM - 9:15 PM' }
  ];

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
    if (errors.date) {
      setErrors(prev => ({ ...prev, date: '' }));
    }
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    if (errors.time) {
      setErrors(prev => ({ ...prev, time: '' }));
    }
  };

  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!selectedDate) {
      newErrors.date = 'Please select a consultation date';
    }
    
    if (!selectedTime) {
      newErrors.time = 'Please select a consultation time';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (validate()) {
      const selectedDateOption = generateWednesdayDates().find(d => d.value === selectedDate);
      const selectedTimeOption = timeSlots.find(t => t.value === selectedTime);
      
      // 保存咨询时间到formData
      dispatch({ 
        type: 'UPDATE_FORM_DATA', 
        payload: { 
          consultationDate: selectedDateOption?.label || selectedDate,
          consultationTime: selectedTimeOption?.label || selectedTime
        } 
      });
      
      // 准备完整的预订数据
      const completeBookingData = {
        formData: {
          ...state.formData,
          consultationDate: selectedDateOption?.label || selectedDate,
          consultationTime: selectedTimeOption?.label || selectedTime
        },
        selectedArtist: state.selectedArtist,
        consultationChoice: true,
        timestamp: new Date().toISOString(),
        depositAmount: 0, // 稍后在PaymentPage中会重新计算
        status: 'PENDING_PAYMENT'
      };
      
      // 保存到localStorage（备份）
      localStorage.setItem('patchTattooBooking', JSON.stringify(completeBookingData));
      
      // 发送预订草稿邮件
      console.log('📧 发送预订草稿邮件（咨询时间选择后）...');
      console.log('📋 发送的预订数据:', completeBookingData);
      
      try {
        const emailResult = await sendBookingDraftEmail(completeBookingData);
        if (emailResult.success) {
          console.log('✅ 预订草稿邮件发送成功');
        } else {
          console.warn('⚠️ 预订草稿邮件发送失败:', emailResult.error);
        }
      } catch (emailError) {
        console.error('❌ 邮件发送出错:', emailError);
      }
      
      // 跳转到支付页面
      dispatch({ type: 'SET_STEP', payload: 9 });
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 7 }); // 跳转回ConsultationChoice页面
  };

  const availableDates = generateWednesdayDates();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Pick a consultation date
        </h1>
        <p className="text-gray-600 text-lg">
          {getSelectedArtistName()}'s consultation time is: Every Wednesday 8PM-8:30PM or 8:45PM-9:15PM
        </p>
        <p className="text-gray-500 text-sm mt-2">
          You can also change the consultation time later with the artist via email
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select consultation date *
          </label>
          <div className="relative">
            <select
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className={`w-full px-4 py-4 border-2 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              } hover:border-gray-400 transition-colors`}
            >
              <option value="">Choose a date...</option>
              {availableDates.map((date) => (
                <option key={date.value} value={date.value}>
                  {date.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-600 pointer-events-none" />
          </div>
          {errors.date && (
            <p className="mt-2 text-sm text-red-600">{errors.date}</p>
          )}
        </div>

        {selectedDate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select consultation time *
            </label>
            <div className="grid gap-3">
              {timeSlots.map((slot) => (
                <label 
                  key={slot.value}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                    selectedTime === slot.value 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="timeSlot"
                    value={slot.value}
                    checked={selectedTime === slot.value}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="sr-only"
                  />
                  <Clock className={`w-5 h-5 mr-3 ${
                    selectedTime === slot.value ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <span className={`text-lg ${
                    selectedTime === slot.value ? 'text-blue-900 font-medium' : 'text-gray-700'
                  }`}>
                    {slot.label}
                  </span>
                </label>
              ))}
            </div>
            {errors.time && (
              <p className="mt-2 text-sm text-red-600">{errors.time}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!selectedDate || !selectedTime}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ConsultationScheduling;