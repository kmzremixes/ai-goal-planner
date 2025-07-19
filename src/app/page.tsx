"use client";

import { useState, useEffect } from 'react';
import type { DailyData, AllRecords } from '@/lib/types';

import LoadingScreen from '@/components/loading-screen';
import MatrixBackground from '@/components/matrix-background';
import AppHeader from '@/components/app-header';
import ViewSwitcher from '@/components/view-switcher';
import IncomeView from '@/components/income-view';
import NotebookView from '@/components/notebook-view';
import WeatherForecast from '@/components/weather-forecast';
import AIGoalPlanner from '@/components/ai-goal-planner';
import ContentCreator from '@/components/content-creator';
import QuickActions from '@/components/quick-actions';
import Stats from '@/components/stats';
import AppFooter from '@/components/app-footer';
import CalculatorModal from '@/components/calculator-modal';
import AIPromptGeneratorModal from '@/components/ai-prompt-generator-modal';
import { useToast } from "@/hooks/use-toast";

const defaultData: DailyData = { idPhotos: 0, photoEditing: 0, designWork: 0, otherIncome: 0, notebook: '' };

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isCalculatorOpen, setCalculatorOpen] = useState(false);
  const [isAiPromptOpen, setAiPromptOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'income' | 'notebook'>('income');
  
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
          userId={userId}
          onOpenCalculator={() => setCalculatorOpen(true)}
          onOpenAiPrompt={() => setAiPromptOpen(true)}
        />
        
        <ViewSwitcher currentView={currentView} setCurrentView={setCurrentView} />

        {currentView === 'income' && (
          <IncomeView 
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            initialData={currentData}
            onSave={handleDataSave}
          />
        )}
        
        {currentView === 'notebook' && (
           <NotebookView 
            selectedDate={selectedDate}
            initialData={currentData}
            onSave={handleDataSave}
          />
        )}

        <WeatherForecast />
        
        <AIGoalPlanner />

        <ContentCreator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 no-print">
          <QuickActions allRecords={allRecords} />
          <Stats allRecords={allRecords} selectedDate={selectedDate} />
        </div>

        <AppFooter />
      </main>
      
      <CalculatorModal isOpen={isCalculatorOpen} setIsOpen={setCalculatorOpen} />
      <AIPromptGeneratorModal isOpen={isAiPromptOpen} setIsOpen={setAiPromptOpen} />
    </>
  );
}
