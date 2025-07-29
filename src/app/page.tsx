"use client";

import { useState, useEffect } from 'react';
import type { DailyData, AllRecords, StoredImage } from '@/lib/types';

import LoadingScreen from '@/components/loading-screen';
import MatrixBackground from '@/components/matrix-background';
import AppHeader from '@/components/app-header';
import NotebookView from '@/components/notebook-view';
import WeatherForecast from '@/components/weather-forecast';
import ContentCreator from '@/components/content-creator';
import ImageEditor from '@/components/image-editor';
import AppFooter from '@/components/app-footer';
import CalculatorModal from '@/components/calculator-modal';
import AIPromptGeneratorModal from '@/components/ai-prompt-generator-modal';
import { useToast } from "@/hooks/use-toast";
import { Input } from '@/components/ui/input';

const defaultData: DailyData = { notebook: '', images: [] };

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isCalculatorOpen, setCalculatorOpen] = useState(false);
  const [isAiPromptOpen, setAiPromptOpen] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [allRecords, setAllRecords] = useState<AllRecords>({});
  
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setUserId(`user_${Math.random().toString(36).substring(2, 10)}`);
      try {
        const savedRecords = localStorage.getItem('allRecords');
        if (savedRecords) {
          setAllRecords(JSON.parse(savedRecords));
        }
      } catch (error) {
          console.error("Failed to load records from localStorage", error);
      }
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if(!loading) {
      try {
        localStorage.setItem('allRecords', JSON.stringify(allRecords));
      } catch (error) {
        console.error("Failed to save records to localStorage", error);
        toast({
          title: "⚠️ ไม่สามารถบันทึกข้อมูล",
          description: "พื้นที่จัดเก็บข้อมูลอาจเต็ม",
          variant: "destructive",
        })
      }
    }
  }, [allRecords, loading, toast]);


  const handleDataSave = (date: string, data: DailyData) => {
    setAllRecords(prev => ({ ...prev, [date]: data }));
    toast({
      title: "✅ บันทึกข้อมูลเรียบร้อยแล้ว!",
      variant: 'default',
    });
  };
  
  const handleImageSave = (newImageSrc: string) => {
    const newImage: StoredImage = {
        src: newImageSrc,
        timestamp: new Date().toISOString(),
    };
    const currentData = allRecords[selectedDate] || defaultData;
    const updatedImages = [...currentData.images, newImage];
    const updatedData = { ...currentData, images: updatedImages };
    setAllRecords(prev => ({ ...prev, [selectedDate]: updatedData }));
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

        <ImageEditor 
            savedImages={currentData.images}
            onImageSave={handleImageSave}
        />
        
        <AppFooter />
      </main>
      
      <CalculatorModal isOpen={isCalculatorOpen} setIsOpen={setCalculatorOpen} />
      <AIPromptGeneratorModal isOpen={isAiPromptOpen} setIsOpen={setAiPromptOpen} />
    </>
  );
}
