"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ViewSwitcherProps {
    currentView: 'income' | 'notebook';
    setCurrentView: (view: 'income' | 'notebook') => void;
}

const ViewSwitcher = ({ currentView, setCurrentView }: ViewSwitcherProps) => {
  return (
    <div className="flex justify-center gap-4 mb-8 no-print">
      <Button
        onClick={() => setCurrentView('income')}
        className={cn('cyber-btn view-btn', { 'active': currentView === 'income' })}
      >
        สรุปรายรับประจำวัน
      </Button>
      <Button
        onClick={() => setCurrentView('notebook')}
        className={cn('cyber-btn view-btn', { 'active': currentView === 'notebook' })}
      >
        สมุดบันทึก
      </Button>
    </div>
  );
};

export default ViewSwitcher;
