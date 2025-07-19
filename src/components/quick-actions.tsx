"use client";

import { Button } from "@/components/ui/button";
import { Printer, FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { AllRecords } from '@/lib/types';

interface QuickActionsProps {
  allRecords: AllRecords;
}

const QuickActions = ({ allRecords }: QuickActionsProps) => {
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
        <div className="cyber-card neon-border p-6">
            <h3 className="cyber-title text-xl mb-4">ฟังก์ชันพิเศษ</h3>
            <div className="space-y-3">
                <Button onClick={handlePrint} className="w-full cyber-btn">
                    <Printer className="mr-2 h-4 w-4" /> PRINT REPORT
                </Button>
                <Button onClick={handleExport} className="w-full cyber-btn">
                    <FileText className="mr-2 h-4 w-4" /> EXPORT DATA (CSV)
                </Button>
            </div>
        </div>
    );
};

export default QuickActions;
