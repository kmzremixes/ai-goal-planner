"use client";

import { useMemo } from 'react';
import type { AllRecords } from '@/lib/types';

interface StatsProps {
  allRecords: AllRecords;
  selectedDate: string;
}

const Stats = ({ allRecords, selectedDate }: StatsProps) => {
  const { monthlyTotal, dailyAverage } = useMemo(() => {
    const currentMonth = selectedDate.substring(0, 7);
    const monthlyRecords = Object.entries(allRecords).filter(([date]) => date.startsWith(currentMonth));
    
    const total = monthlyRecords.reduce((acc, [_, data]) => {
        const dayIncome = data.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const dayExpense = data.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        return acc + (dayIncome - dayExpense);
    }, 0);
    
    const average = monthlyRecords.length > 0 ? total / monthlyRecords.length : 0;
    
    return { monthlyTotal: total, dailyAverage: average };
  }, [allRecords, selectedDate]);

  return (
    <div className="cyber-card">
        <h3 className="cyber-title text-xl mb-4">สถิติรวม (เดือนปัจจุบัน)</h3>
        <div className="space-y-2 text-cyan-300">
            <div className="flex justify-between">
                <span>รายรับ-รายจ่ายเดือนนี้ (สุทธิ):</span>
                <span className="text-green-400 font-bold">{monthlyTotal.toLocaleString()} บาท</span>
            </div>
            <div className="flex justify-between">
                <span>เฉลี่ยต่อวัน:</span>
                <span className="text-blue-400 font-bold">{Math.round(dailyAverage).toLocaleString()} บาท</span>
            </div>
        </div>
    </div>
  );
};

export default Stats;
