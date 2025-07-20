"use client";

import { useState, useEffect, useMemo } from 'react';
import type { DailyData, Transaction } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Plus, Trash2, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IncomeViewProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  initialData: DailyData;
  onSave: (date: string, data: DailyData) => void;
}

const IncomeView = ({ selectedDate, setSelectedDate, initialData, onSave }: IncomeViewProps) => {
  const [data, setData] = useState<DailyData>(initialData);
  const [newTransaction, setNewTransaction] = useState({ type: 'income', description: '', amount: '' });

  useEffect(() => {
    setData(initialData);
  }, [selectedDate, initialData]);

  const { totalIncome, totalExpense, netTotal } = useMemo(() => {
    const income = data.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = data.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { totalIncome: income, totalExpense: expense, netTotal: income - expense };
  }, [data.transactions]);

  const handleAddTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount) {
      alert('กรุณากรอกรายละเอียดและจำนวนเงิน');
      return;
    }
    const newTx: Transaction = {
      id: new Date().toISOString(),
      type: newTransaction.type as 'income' | 'expense',
      description: newTransaction.description,
      amount: parseFloat(newTransaction.amount),
    };
    const updatedData = { ...data, transactions: [...data.transactions, newTx] };
    setData(updatedData);
    onSave(selectedDate, updatedData);
    setNewTransaction({ type: 'income', description: '', amount: '' });
  };
  
  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = data.transactions.filter(t => t.id !== id);
    const updatedData = { ...data, transactions: updatedTransactions };
    setData(updatedData);
    onSave(selectedDate, updatedData);
  };

  const incomeTransactions = data.transactions.filter(t => t.type === 'income');
  const expenseTransactions = data.transactions.filter(t => t.type === 'expense');

  return (
    <div id="income-expense-view">
      <div className="cyber-card printable-area">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold cyber-title">รายรับ-รายจ่ายประจำวัน</h2>
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
          </div>
        </div>
        
        {/* Add Transaction Form */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8 p-4 bg-black/30 rounded-lg border border-cyan-500/30 no-print">
            <div className="md:col-span-2">
                <Select value={newTransaction.type} onValueChange={(value) => setNewTransaction(p => ({...p, type: value}))}>
                    <SelectTrigger className="cyber-input">
                        <SelectValue placeholder="ประเภท" />
                    </SelectTrigger>
                    <SelectContent className="cyber-card">
                        <SelectItem value="income">รายรับ</SelectItem>
                        <SelectItem value="expense">รายจ่าย</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="md:col-span-6">
                <Input
                    type="text"
                    placeholder="รายละเอียด (เช่น ค่ากาแฟ, ขายของ)"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction(p => ({...p, description: e.target.value}))}
                    className="cyber-input"
                />
            </div>
            <div className="md:col-span-2">
                <Input
                    type="number"
                    placeholder="จำนวนเงิน"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction(p => ({...p, amount: e.target.value}))}
                    className="cyber-input"
                />
            </div>
            <div className="md:col-span-2">
                <Button onClick={handleAddTransaction} className="w-full cyber-btn"><Plus className="mr-2 h-4 w-4" /> เพิ่ม</Button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Income List */}
            <div>
                <h3 className="cyber-title text-2xl mb-4">รายรับ</h3>
                <div className="space-y-3">
                    {incomeTransactions.length > 0 ? incomeTransactions.map(tx => (
                        <div key={tx.id} className="flex justify-between items-center p-3 bg-black/20 rounded-lg border border-green-500/30">
                            <span>{tx.description}</span>
                            <div className="flex items-center gap-4">
                               <span className="font-bold text-green-400">{tx.amount.toLocaleString()} บาท</span>
                               <Button size="icon" variant="ghost" className="no-print text-red-500 hover:text-red-400" onClick={() => handleDeleteTransaction(tx.id)}><Trash2 className="h-4 w-4"/></Button>
                            </div>
                        </div>
                    )) : <p className="text-gray-500">ไม่มีรายการรายรับ</p>}
                </div>
            </div>

            {/* Expense List */}
            <div>
                <h3 className="cyber-title text-2xl mb-4">รายจ่าย</h3>
                <div className="space-y-3">
                    {expenseTransactions.length > 0 ? expenseTransactions.map(tx => (
                        <div key={tx.id} className="flex justify-between items-center p-3 bg-black/20 rounded-lg border border-red-500/30">
                            <span>{tx.description}</span>
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-red-400">{tx.amount.toLocaleString()} บาท</span>
                                <Button size="icon" variant="ghost" className="no-print text-red-500 hover:text-red-400" onClick={() => handleDeleteTransaction(tx.id)}><Trash2 className="h-4 w-4"/></Button>
                            </div>
                        </div>
                    )) : <p className="text-gray-500">ไม่มีรายการรายจ่าย</p>}
                </div>
            </div>
        </div>

        <hr className="border-cyan-500/50 my-8" />
        
        <div className="space-y-4 text-right">
            <div className="flex justify-end items-center gap-6">
                <span className="text-xl font-bold text-white">รวมรายรับ:</span>
                <span className="text-2xl font-bold text-green-400 w-48 text-left">{totalIncome.toLocaleString()} บาท</span>
            </div>
            <div className="flex justify-end items-center gap-6">
                <span className="text-xl font-bold text-white">รวมรายจ่าย:</span>
                <span className="text-2xl font-bold text-red-400 w-48 text-left">{totalExpense.toLocaleString()} บาท</span>
            </div>
             <div className="flex justify-end items-center gap-6">
                <span className="text-2xl font-bold text-white">ยอดรวมสุทธิ:</span>
                <span className={`cyber-title text-4xl w-48 text-left ${netTotal >= 0 ? 'text-green-400' : 'text-red-400'}`}>{netTotal.toLocaleString()} บาท</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeView;
