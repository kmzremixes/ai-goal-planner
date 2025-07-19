"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Copy } from 'lucide-react';
import { generateMarketingCopy } from '@/ai/flows/generate-content';
import { useToast } from "@/hooks/use-toast";

const ContentCreator = () => {
    const [topic, setTopic] = useState('');
    const [type, setType] = useState('a Facebook post');
    const [generatedContent, setGeneratedContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const contentTypes = [
        { name: 'โพสต์ Facebook', value: 'a Facebook post' },
        { name: 'แคปชันโฆษณา (สั้น)', value: 'a short and catchy advertisement caption' },
        { name: 'ไอเดีย 3 หัวข้อบทความ', value: '3 blog post ideas in a numbered list' },
        { name: 'อีเมลการตลาด', value: 'a marketing email' },
        { name: 'Instagram Story', value: 'an Instagram story caption' },
        { name: 'TikTok Script', value: 'a TikTok video script' }
    ];

    const handleGenerateContent = async () => {
        if (!topic) {
            toast({ title: "⚠️ กรุณาใส่หัวข้อที่ต้องการเขียน", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        setGeneratedContent('กำลังสร้างสรรค์...');
        try {
            const result = await generateMarketingCopy({ description: topic, type });
            setGeneratedContent(result.marketingCopy.trim());
        } catch (error) {
            console.error("Content Generation Error:", error);
            const errorMessage = (error as Error).message || "Unknown error";
            setGeneratedContent(`เกิดข้อผิดพลาด: ${errorMessage}`);
            toast({
                title: "❌ เกิดข้อผิดพลาดในการสร้างคอนเทนต์",
                description: errorMessage,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (!generatedContent || generatedContent.startsWith('กำลัง') || generatedContent.startsWith('เกิด')) {
            toast({ title: "ไม่มีเนื้อหาให้คัดลอก", variant: "destructive" });
            return;
        }
        navigator.clipboard.writeText(generatedContent);
        toast({ title: "✅ คัดลอกเรียบร้อยแล้ว!" });
    };

    return (
        <div className="cyber-card neon-border p-8 mb-8 no-print">
            <h3 className="cyber-title text-2xl mb-6">AI CONTENT CREATOR</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="content-topic" className="block mb-3 font-bold text-cyan-300">หัวข้อเนื้อหา:</label>
                        <Input
                            id="content-topic"
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="cyber-input"
                            placeholder="เช่น โปรโมชันกาแฟเดือนกรกฎาคม"
                        />
                    </div>
                    <div>
                        <label htmlFor="content-type" className="block mb-3 font-bold text-cyan-300">ประเภทคอนเทนต์:</label>
                        <Select onValueChange={setType} defaultValue={type}>
                            <SelectTrigger className="cyber-input">
                                <SelectValue placeholder="เลือกประเภทคอนเทนต์" />
                            </SelectTrigger>
                            <SelectContent className="cyber-card">
                                {contentTypes.map(t => (
                                    <SelectItem key={t.value} value={t.value}>{t.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleGenerateContent} disabled={isLoading} className="w-full cyber-btn flex justify-center items-center gap-2">
                        {isLoading ? <div className="spinner"></div> : <Sparkles className="h-5 w-5" />}
                        <span>สร้างคอนเทนต์</span>
                    </Button>
                </div>
                <div>
                    <label htmlFor="generated-content" className="block mb-3 font-bold text-cyan-300">ผลลัพธ์:</label>
                    <Textarea
                        id="generated-content"
                        value={generatedContent}
                        readOnly
                        className="cyber-input w-full h-48 resize-none font-code"
                        placeholder="AI จะสร้างคอนเทนต์ที่นี่..."
                    />
                    <Button onClick={handleCopy} className="w-full mt-3 cyber-btn">
                        <Copy className="mr-2 h-4 w-4" /> COPY CONTENT
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ContentCreator;
