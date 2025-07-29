"use client";

import { useState, useEffect } from 'react';
import type { DailyData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save, Sparkles } from 'lucide-react';
import { summarizeNotebook } from '@/ai/flows/summarize-notebook-flow';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface NotebookViewProps {
  selectedDate: string;
  initialData: DailyData;
  onSave: (date: string, data: DailyData) => void;
}

const NotebookView = ({ selectedDate, initialData, onSave }: NotebookViewProps) => {
  const [notebookText, setNotebookText] = useState(initialData.notebook || '');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setNotebookText(initialData.notebook || '');
  }, [selectedDate, initialData]);
  
  const handleSave = () => {
    onSave(selectedDate, { notebook: notebookText });
  };

  const handleSummarize = async () => {
    if (!notebookText.trim()) {
      toast({
        title: "⚠️ ยังไม่มีบันทึกให้สรุป",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const result = await summarizeNotebook({ notebookText });
      setSummary(result.summary);
      setIsSummaryOpen(true);
    } catch (error) {
      console.error("Summarize Notebook Error:", error);
      toast({
        title: "❌ เกิดข้อผิดพลาดในการสรุป",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="notebook-view" className="printable-area">
        <Textarea
            value={notebookText}
            onChange={(e) => setNotebookText(e.target.value)}
            className="cyber-input w-full h-64 resize-none mb-4"
            placeholder={`พิมพ์บันทึกสำหรับวันที่ ${new Date(selectedDate).toLocaleDateString('th-TH')} ที่นี่...`}
        />
        <div className="flex flex-col sm:flex-row gap-4 no-print">
            <Button onClick={handleSave} className="w-full cyber-btn">
                <Save className="mr-2 h-4 w-4" /> บันทึก
            </Button>
            <Button onClick={handleSummarize} disabled={isLoading} className="w-full cyber-btn flex justify-center items-center gap-2">
                {isLoading ? (
                    <div className="spinner"></div>
                ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                )}
                <span>สรุปด้วย AI</span>
            </Button>
        </div>
        <AlertDialog open={isSummaryOpen} onOpenChange={setIsSummaryOpen}>
          <AlertDialogContent className="cyber-card neon-border">
            <AlertDialogHeader>
              <AlertDialogTitle className="cyber-title">สรุปบันทึก</AlertDialogTitle>
              <AlertDialogDescription className="text-cyan-300 whitespace-pre-wrap py-4">
                {summary}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setIsSummaryOpen(false)} className="cyber-btn">
                CLOSE
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </div>
  );
};

export default NotebookView;
