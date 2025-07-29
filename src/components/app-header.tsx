"use client";

import { Button } from "@/components/ui/button";
import { Calculator, Bot, Printer } from 'lucide-react';
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
      </div>
    </header>
  );
};

export default AppHeader;
