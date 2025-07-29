
"use client";

import { useState, useRef, useEffect } from 'react';
import type { StoredImage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Download, Type, Image as ImageIcon, Save, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface ImageEditorProps {
    savedImages: StoredImage[];
    onImageSave: (imageSrc: string) => void;
}

const ImageEditor = ({ savedImages, onImageSave }: ImageEditorProps) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [text, setText] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const [isViewerOpen, setViewerOpen] = useState(false);
    const [selectedImageForViewer, setSelectedImageForViewer] = useState<string | null>(null);

    useEffect(() => {
        // Set the first saved image as the initial preview if available
        if (!imageSrc && savedImages.length > 0) {
            setImageSrc(savedImages[0].src);
        }
    }, [savedImages, imageSrc]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setImageSrc(result);
                toast({ title: "🖼️ รูปภาพพร้อมสำหรับแก้ไข", description: "กด 'บันทึกรูปภาพ' เพื่อเก็บในคลัง" });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSaveImage = () => {
        if (!imageSrc) {
            toast({ title: "⚠️ ไม่มีรูปภาพให้บันทึก", variant: "destructive" });
            return;
        }
        onImageSave(imageSrc);
        toast({ title: "✅ บันทึกรูปภาพเรียบร้อยแล้ว!", description: "รูปภาพถูกบันทึกสำหรับวันนี้" });
    }

    const downloadImage = (src: string, textToAdd: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = src;
        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            ctx.drawImage(image, 0, 0);

            if (textToAdd) {
                const fontSize = image.width / 20;
                ctx.font = `bold ${fontSize}px Kanit`;
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'black';
                ctx.lineWidth = fontSize / 15;
                const x = canvas.width / 2;
                const y = canvas.height - (fontSize * 1.5);
                ctx.textAlign = 'center';
                
                ctx.strokeText(textToAdd, x, y);
                ctx.fillText(textToAdd, x, y);
            }

            const link = document.createElement('a');
            link.download = 'edited-image.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast({ title: "✅ ดาวน์โหลดรูปภาพเรียบร้อยแล้ว!" });
        };
        image.onerror = () => {
            toast({ title: "❌ ไม่สามารถโหลดรูปภาพเพื่อดาวน์โหลด", variant: "destructive" });
        }
    }

    const handleDownload = () => {
        if (!imageSrc) {
            toast({ title: "⚠️ กรุณาอัพโหลดหรือเลือกรูปภาพก่อน", variant: "destructive" });
            return;
        }
        downloadImage(imageSrc, text);
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    const openImageViewer = (src: string) => {
        setSelectedImageForViewer(src);
        setViewerOpen(true);
    };

    return (
        <div className="cyber-card mt-8 no-print">
            <h3 className="cyber-title text-2xl mb-6">IMAGE EDITOR</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                     <div className="flex gap-2">
                        <Button onClick={triggerFileUpload} className="w-full cyber-btn flex justify-center items-center gap-2">
                            <Upload className="h-5 w-5" />
                            <span>เลือกรูป</span>
                        </Button>
                        <Button onClick={handleSaveImage} className="w-full cyber-btn flex justify-center items-center gap-2">
                            <Save className="h-5 w-5" />
                            <span>บันทึกรูปภาพ</span>
                        </Button>
                     </div>
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
                        <span>ดาวน์โหลดรูปที่แก้ไข</span>
                    </Button>
                </div>
                <div className="flex items-center justify-center p-4 bg-black/40 rounded-xl border border-pink-500/50 min-h-[250px] relative">
                    {imageSrc ? (
                        <img src={imageSrc} alt="Preview" className="max-w-full max-h-64 rounded-lg object-contain" />
                    ) : (
                        <div className="text-center text-pink-300 flex flex-col items-center">
                           <ImageIcon size={48} className="mb-4" />
                           <p>ดูตัวอย่างรูปภาพที่นี่</p>
                           <p className="text-xs mt-1">อัพโหลดรูปภาพเพื่อเริ่มต้น</p>
                        </div>
                    )}
                </div>
            </div>

            {savedImages.length > 0 && (
                <div className="mt-8">
                    <h4 className="cyber-title text-xl mb-4">คลังรูปภาพสำหรับวันนี้</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {savedImages.map((img, index) => (
                            <button key={index} onClick={() => openImageViewer(img.src)} className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all">
                                <img src={img.src} alt={`Saved image ${index + 1}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <p className="text-white text-xs text-center">
                                        {new Date(img.timestamp).toLocaleTimeString('th-TH')}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            <Dialog open={isViewerOpen} onOpenChange={setViewerOpen}>
                <DialogContent className="max-w-4xl w-full h-[90vh] bg-black/80 backdrop-blur-md border-cyan-500/50 flex flex-col p-4">
                     <DialogHeader className="flex-shrink-0">
                        <DialogTitle className="cyber-title">Image Viewer</DialogTitle>
                        <DialogClose asChild>
                             <button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                                <X className="h-6 w-6" />
                                <span className="sr-only">Close</span>
                             </button>
                        </DialogClose>
                     </DialogHeader>
                     <div className="flex-grow flex items-center justify-center overflow-hidden p-4">
                        {selectedImageForViewer && <img src={selectedImageForViewer} alt="Full view" className="max-w-full max-h-full object-contain"/>}
                     </div>
                     <div className="flex-shrink-0 flex justify-center gap-4 p-4">
                        <Button onClick={() => selectedImageForViewer && downloadImage(selectedImageForViewer, '')} className="cyber-btn">
                            <Download className="mr-2 h-4 w-4" /> ดาวน์โหลด
                        </Button>
                     </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ImageEditor;
