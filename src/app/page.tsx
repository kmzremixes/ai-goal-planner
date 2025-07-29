"use client";

import { useState, useEffect } from 'react';
import type { DailyData, AllRecords } from '@/lib/types';

import LoadingScreen from '@/components/loading-screen';
import MatrixBackground from '@/components/matrix-background';
import AppHeader from '@/components/app-header';
import NotebookView from '@/components/notebook-view';
import WeatherForecast from '@/components/weather-forecast';
import ContentCreator from '@/components/content-creator';
import AppFooter from '@/components/app-footer';
import CalculatorModal from '@/components/calculator-modal';
import AIPromptGeneratorModal from '@/components/ai-prompt-generator-modal';
import { useToast } from "@/hooks/use-toast";
import { Input } from '@/components/ui/input';

const defaultData: DailyData = { notebook: '' };

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isCalculatorOpen, setCalculatorOpen] = useState(false);
  const [isAiPromptOpen, setAiPromptOpen] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [allRecords, setAllRecords] = useState<AllRecords>({});
  
  const { toast } = useToast();

  useEffect(() => {
    // Simulate auth and data loading
    const timer = setTimeout(() => {
      setUserId(`user_${Math.random().toString(36).substring(2, 10)}`);
      // You can load initial data from localStorage here if desired
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleDataSave = (date: string, data: DailyData) => {
    setAllRecords(prev => {
      const updatedRecords = { ...prev, [date]: data };
      // You can save to localStorage here
      // localStorage.setItem('allRecords', JSON.stringify(updatedRecords));
      return updatedRecords;
    });
    toast({
      title: "✅ บันทึกข้อมูลเรียบร้อยแล้ว!",
      variant: 'default',
    });
  };

  const currentData = allRecords[selectedDate] || defaultData;
  
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <MatrixBackground />
      <main id="main-content" className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <AppHeader 
          allRecords={allRecords}
          onOpenCalculator={() => setCalculatorOpen(true)}
          onOpenAiPrompt={() => setAiPromptOpen(true)}
        />
        
        <WeatherForecast />

        <div className="cyber-card printable-area mb-8">
           <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
               <div>
                    <h2 className="text-3xl font-bold cyber-title">สมุดบันทึกประจำวัน</h2>
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
           <NotebookView 
                selectedDate={selectedDate}
                initialData={currentData}
                onSave={handleDataSave}
            />
        </div>
        
        <ContentCreator />
        
        <AppFooter />
      </main>
      
      <CalculatorModal isOpen={isCalculatorOpen} setIsOpen={setCalculatorOpen} />
      <AIPromptGeneratorModal isOpen={isAiPromptOpen} setIsOpen={setAiPromptOpen} />
    </>
  );
}
