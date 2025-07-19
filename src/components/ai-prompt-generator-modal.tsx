"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Copy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { generatePrompt } from '@/ai/flows/generate-prompt';

interface AIPromptGeneratorModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AIPromptGeneratorModal = ({ isOpen, setIsOpen }: AIPromptGeneratorModalProps) => {
    const [idea, setIdea] = useState('');
    const [model, setModel] = useState('Imagen 3');
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const models = [
        { name: 'Imagen 3 (สร้างภาพ)', value: 'Imagen 3' },
        { name: 'DALL-E 3 (สร้างภาพ)', value: 'DALL-E 3' },
        { name: 'Veo (สร้างวิดีโอ)', value: 'Veo' },
        { name: 'Gemini 1.5 Pro (ข้อความ/วิเคราะห์)', value: 'Gemini 1.5 Pro' },
        { name: 'Gemini 1.5 Flash (ข้อความเร็ว)', value: 'Gemini 1.5 Flash' }
    ];

    const handleGeneratePrompt = async () => {
        if (!idea) {
            toast({ title: '⚠️ กรุณาใส่ไอเดียของคุณก่อน', variant: 'destructive' });
            return;
        }
        setIsLoading(true);
        setGeneratedPrompt('กำลังสร้าง Prompt...');
        try {
            const result = await generatePrompt({ idea, model });
            setGeneratedPrompt(result.prompt.trim());
        } catch (error) {
            console.error("AI Prompt Generation Error:", error);
            const errorMessage = (error as Error).message || "Unknown error";
            setGeneratedPrompt(`เกิดข้อผิดพลาด: ${errorMessage}`);
            toast({
                title: '❌ เกิดข้อผิดพลาดในการสร้าง Prompt',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (!generatedPrompt || generatedPrompt.startsWith('กำลัง') || generatedPrompt.startsWith('เกิด')) {
            toast({ title: "ไม่มี Prompt ให้คัดลอก", variant: "destructive" });
            return;
        }
        navigator.clipboard.writeText(generatedPrompt);
        toast({ title: "✅ คัดลอกเรียบร้อยแล้ว!" });
    };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="cyber-card neon-border w-full max-w-2xl p-8 bg-black/90 border-none no-print">
        <div className="space-y-4">
            <h2 className="cyber-title text-2xl">AI PROMPT GENERATOR</h2>
            <div>
                <label htmlFor="ai-idea-input" className="block mb-3 font-bold text-cyan-300">1. ใส่ไอเดียของคุณ (ไทย/อังกฤษ):</label>
                <Input id="ai-idea-input" value={idea} onChange={(e) => setIdea(e.target.value)} className="cyber-input" placeholder="เช่น แมวในชุดอวกาศบนดาวอังคาร" />
            </div>
            <div>
                <label htmlFor="ai-model-select" className="block mb-3 font-bold text-cyan-300">2. เลือกโมเดลเป้าหมาย:</label>
                <Select onValueChange={setModel} defaultValue={model}>
                    <SelectTrigger className="cyber-input">
                        <SelectValue placeholder="เลือกโมเดล" />
                    </SelectTrigger>
                    <SelectContent className="cyber-card">
                        {models.map(m => <SelectItem key={m.value} value={m.value}>{m.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={handleGeneratePrompt} disabled={isLoading} className="w-full cyber-btn flex justify-center items-center gap-2">
                {isLoading ? <div className="spinner"></div> : <Sparkles className="h-5 w-5" />}
                <span>สร้าง Prompt</span>
            </Button>
            <div>
                <label htmlFor="ai-generated-prompt" className="block mb-3 font-bold text-cyan-300">3. Prompt ที่สร้างเสร็จ (ภาษาอังกฤษ):</label>
                <Textarea id="ai-generated-prompt" value={generatedPrompt} readOnly className="cyber-input w-full h-40 resize-none font-code" placeholder="AI จะสร้าง prompt ที่นี่..." />
            </div>
            <div className="flex gap-4">
                <Button onClick={handleCopy} className="w-full cyber-btn"><Copy className="mr-2 h-4 w-4" />คัดลอก</Button>
                <Button onClick={() => setIsOpen(false)} variant="ghost" className="w-full px-6 py-3 bg-gray-600 text-white font-bold rounded-lg border-2 border-gray-500 hover:bg-gray-700 transition-all">ปิด</Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIPromptGeneratorModal;
