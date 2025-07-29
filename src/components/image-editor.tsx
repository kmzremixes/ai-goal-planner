
"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Download, Type } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const ImageEditor = () => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [text, setText] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageSrc(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDownload = () => {
        if (!imageSrc) {
            toast({ title: "⚠️ กรุณาอัพโหลดรูปภาพก่อน", variant: "destructive" });
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Draw image
            ctx.drawImage(image, 0, 0);

            // Draw text
            if (text) {
                const fontSize = image.width / 20;
                ctx.font = `bold ${fontSize}px Kanit`;
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'black';
                ctx.lineWidth = fontSize / 15;
                const x = canvas.width / 2;
                const y = canvas.height - (fontSize * 1.5);
                ctx.textAlign = 'center';
                
                ctx.strokeText(text, x, y);
                ctx.fillText(text, x, y);
            }

            // Trigger download
            const link = document.createElement('a');
            link.download = 'edited-image.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast({ title: "✅ ดาวน์โหลดรูปภาพเรียบร้อยแล้ว!" });
        };
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="cyber-card mt-8 no-print">
            <h3 className="cyber-title text-2xl mb-6">IMAGE EDITOR</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <Button onClick={triggerFileUpload} className="w-full cyber-btn flex justify-center items-center gap-2">
                        <Upload className="h-5 w-5" />
                        <span>อัพโหลดรูปภาพ</span>
                    </Button>
                    <Input
                        id="image-upload"
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                    />

                    <div>
                        <label htmlFor="image-text" className="block mb-3 font-bold text-cyan-300 flex items-center gap-2">
                           <Type /> ข้อความบนภาพ:
                        </label>
                        <Textarea
                            id="image-text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="cyber-input w-full h-24 resize-none"
                            placeholder="ใส่ข้อความที่นี่..."
                        />
                    </div>
                     <Button onClick={handleDownload} className="w-full cyber-btn flex justify-center items-center gap-2">
                        <Download className="h-5 w-5" />
                        <span>ดาวน์โหลดรูปภาพ</span>
                    </Button>
                </div>
                <div className="flex items-center justify-center p-4 bg-black/40 rounded-xl border border-pink-500/50 min-h-[250px]">
                    {imageSrc ? (
                        <img src={imageSrc} alt="Preview" className="max-w-full max-h-64 rounded-lg object-contain" />
                    ) : (
                        <div className="text-center text-pink-300">
                           <p>ดูตัวอย่างรูปภาพที่นี่</p>
                        </div>
                    )}
                </div>
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
};

export default ImageEditor;
