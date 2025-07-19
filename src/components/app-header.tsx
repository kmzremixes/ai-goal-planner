"use client";

import { Button } from "@/components/ui/button";
import { Calculator, Bot } from 'lucide-react';

interface AppHeaderProps {
  userId: string | null;
  onOpenCalculator: () => void;
  onOpenAiPrompt: () => void;
}

const AppHeader = ({ userId, onOpenCalculator, onOpenAiPrompt }: AppHeaderProps) => {
  return (
    <header className="mb-8 no-print">
      <div className="text-center mb-6">
        <h1 className="cyber-title text-5xl md:text-6xl font-bold mb-4">
          CYBER DAILY TOOLS
        </h1>
        {userId && (
          <p className="text-sm text-pink-400 mt-4 opacity-70 font-code">
            UserID: {userId}
          </p>
        )}
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
      </div>
    </header>
  );
};

export default AppHeader;
