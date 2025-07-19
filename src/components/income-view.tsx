"use client";

import { useState, useEffect, useMemo } from 'react';
import type { DailyData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IncomeViewProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  initialData: DailyData;
  onSave: (date: string, data: DailyData) => void;
}

const IncomeView = ({ selectedDate, setSelectedDate, initialData, onSave }: IncomeViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<DailyData>(initialData);

  useEffect(() => {
    setData(initialData);
    setIsEditing(false);
  }, [selectedDate, initialData]);
  
  const totalIncome = useMemo(() => {
    return (data.idPhotos || 0) * 30 + (data.photoEditing || 0) + (data.designWork || 0) + (data.otherIncome || 0);
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
  };

  const handleSaveClick = () => {
    onSave(selectedDate, data);
    setIsEditing(false);
  };
  
  const handleCancelClick = () => {
    setData(initialData);
    setIsEditing(false);
  }

  const fields = [
      { key: 'idPhotos', label: 'ถ่ายรูปด่วน', unit: 'คน', value: data.idPhotos, total: (data.idPhotos || 0) * 30, extra: 'x 30' },
      { key: 'photoEditing', label: 'แต่งรูป', unit: 'บาท', value: data.photoEditing, total: data.photoEditing },
      { key: 'designWork', label: 'ออกแบบ', unit: 'บาท', value: data.designWork, total: data.designWork },
      { key: 'otherIncome', label: 'ค่าอื่นๆ', unit: 'บาท', value: data.otherIncome, total: data.otherIncome }
  ];

  return (
    <div id="income-view">
        <div className="cyber-card printable-area">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold cyber-title">รายรับประจำวัน</h2>
                    <p className="text-cyan-300 text-lg mt-2">
                      {new Date(selectedDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                    </p>
                </div>
                <div className="flex items-center gap-4 no-print">
                    <Input 
                      type="date" 
                      value={selectedDate} 
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="cyber-input !w-auto"
                    />
                    {isEditing ? (
                      <div className="flex gap-3">
                        <Button onClick={handleSaveClick} className="cyber-btn"><Save className="mr-2 h-4 w-4" /> SAVE</Button>
                        <Button onClick={handleCancelClick} variant="ghost" size="icon"><X className="text-red-500"/></Button>
                      </div>
                    ) : (
                      <Button onClick={() => setIsEditing(true)} className={cn('cyber-btn red')}><Edit className="mr-2 h-4 w-4" /> EDIT</Button>
                    )}
                </div>
            </div>
            <div className="space-y-6 mb-8">
              {fields.map(field => (
                <div key={field.key} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center p-4 bg-black/30 rounded-lg border border-cyan-500/30">
                    <label className="font-bold text-cyan-300 text-lg">{field.label}</label>
                    {isEditing 
                        ? <div className="col-span-1 flex items-center gap-3">
                               <Input type="number" name={field.key} value={field.value || 0} onChange={handleInputChange} className="cyber-input w-28" />
                               {field.extra && <span className="text-pink-400 font-bold">{field.extra}</span>}
                           </div> 
                        : <span className="col-span-1 text-xl font-bold text-white">{(field.value || 0).toLocaleString()} {field.unit}</span>
                    }
                    <span className="sm:col-span-1 text-left sm:text-right text-xl font-bold text-green-400">{(field.total || 0).toLocaleString()} บาท</span>
                </div>
              ))}
            </div>
            <hr className="border-cyan-500/50 my-8" />
            <div className="flex justify-end items-center">
                <span className="text-2xl font-bold text-white">ยอดรวมสุทธิ:</span>
                <span className="cyber-title text-4xl ml-6">{totalIncome.toLocaleString()} บาท</span>
            </div>
        </div>
    </div>
  );
};

export default IncomeView;
