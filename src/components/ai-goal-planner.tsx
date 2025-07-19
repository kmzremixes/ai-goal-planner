"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles } from 'lucide-react';
import { generateActionPlan } from '@/ai/flows/generate-plan';
import { useToast } from "@/hooks/use-toast";

const AIGoalPlanner = () => {
    const [goal, setGoal] = useState('');
    const [plan, setPlan] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleGeneratePlan = async () => {
        if (!goal) {
            toast({
                title: "⚠️ กรุณาใส่เป้าหมายของคุณ",
                variant: "destructive"
            });
            return;
        }
        setIsLoading(true);
        setPlan('กำลังสร้างแผนการ...');
        try {
            const result = await generateActionPlan({ goal });
            setPlan(result.plan.trim());
        } catch (error) {
            console.error("Generate Plan Error:", error);
            const errorMessage = (error as Error).message || "Unknown error";
            setPlan(`เกิดข้อผิดพลาด: ${errorMessage}`);
            toast({
                title: "❌ เกิดข้อผิดพลาดในการสร้างแผน",
                description: errorMessage,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="cyber-card no-print">
            <h3 className="cyber-title text-2xl mb-6">AI GOAL PLANNER</h3>
            <div className="space-y-4">
                <div>
                    <label htmlFor="goal-input" className="block mb-3 font-bold text-cyan-300">เป้าหมายของคุณ:</label>
                    <Input
                        id="goal-input"
                        type="text"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="cyber-input"
                        placeholder="เช่น เพิ่มรายได้ 10% ในเดือนหน้า"
                    />
                </div>
                <Button
                    onClick={handleGeneratePlan}
                    disabled={isLoading}
                    className="w-full cyber-btn flex justify-center items-center gap-2"
                >
                    {isLoading ? <div className="spinner"></div> : <Sparkles className="h-5 w-5" />}
                    <span>สร้างแผนการ</span>
                </Button>
                <div>
                    <label htmlFor="generated-plan" className="block mb-3 font-bold text-cyan-300">ขั้นตอนสู่เป้าหมาย:</label>
                    <Textarea
                        id="generated-plan"
                        value={plan}
                        readOnly
                        className="cyber-input w-full h-48 resize-none font-code"
                        placeholder="AI จะสร้างแผนการที่นี่..."
                    />
                </div>
            </div>
        </div>
    );
};

export default AIGoalPlanner;
