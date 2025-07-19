"use client";

import { Button } from "@/components/ui/button";
import { Calculator, Bot, Printer, FileText } from 'lucide-react';
import type { AllRecords } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

interface AppHeaderProps {
  onOpenCalculator: () => void;
  onOpenAiPrompt: () => void;
  allRecords: AllRecords;
}

const AppHeader = ({ onOpenCalculator, onOpenAiPrompt, allRecords }: AppHeaderProps) => {
  const { toast } = useToast();

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    if (Object.keys(allRecords).length === 0) {
        toast({
            title: "⚠️ ไม่มีข้อมูลให้ Export",
            variant: "destructive"
        });
        return;
    }
    let csvContent = "data:text/csv;charset=utf-8,Date,ID Photos (Count),Photo Editing (THB),Design Work (THB),Other Income (THB),Total Income (THB),Notebook\n";
    const sortedDates = Object.keys(allRecords).sort();
    
    sortedDates.forEach(date => {
        const data = allRecords[date];
        const total = (data.idPhotos || 0) * 30 + (data.photoEditing || 0) + (data.designWork || 0) + (data.otherIncome || 0);
        const notebookText = `"${(data.notebook || '').replace(/"/g, '""')}"`;
        const row = [date, data.idPhotos || 0, data.photoEditing || 0, data.designWork || 0, data.otherIncome || 0, total, notebookText].join(",");
        csvContent += row + "\r\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `daily_data_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header className="mb-8 no-print">
      <div className="text-center mb-6">
        <h1 className="cyber-title text-5xl md:text-6xl font-bold">
          CYBER DAILY TOOLS
        </h1>
      </div>
      <div className="flex justify-center flex-wrap gap-4 mb-8">
        <Button onClick={onOpenCalculator} className="cyber-btn">
          <Calculator className="mr-2 h-5 w-5" />
          <span>CALCULATOR</span>
        </Button>
        <Button onClick={onOpenAiPrompt} className="cyber-btn">
          <Bot className="mr-2 h-5 w-5" />
          <span>AI PROMPT</span>
        </Button>
        <Button onClick={handlePrint} className="cyber-btn">
            <Printer className="mr-2 h-4 w-4" /> <span>PRINT</span>
        </Button>
        <Button onClick={handleExport} className="cyber-btn">
            <FileText className="mr-2 h-4 w-4" /> <span>EXPORT</span>
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;
