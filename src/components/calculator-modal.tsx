"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface CalculatorModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CalculatorModal = ({ isOpen, setIsOpen }: CalculatorModalProps) => {
  const [display, setDisplay] = useState('0');
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(true);

  const handleButtonClick = (type: string, value: string) => {
    if (type === 'num') {
      if (waitingForOperand) {
        setDisplay(value);
        setWaitingForOperand(false);
      } else {
        setDisplay(display === '0' ? value : display + value);
      }
    } else if (type === 'dec') {
      if (waitingForOperand) {
        setDisplay('0.');
        setWaitingForOperand(false);
      } else if (!display.includes('.')) {
        setDisplay(display + '.');
      }
    } else if (type === 'op') {
        const inputValue = parseFloat(display);
        if (currentValue == null) {
            setCurrentValue(inputValue);
        } else if (operator) {
            const result = eval(`${currentValue} ${operator} ${inputValue}`);
            setCurrentValue(result);
            setDisplay(String(result));
        }
        setWaitingForOperand(true);
        setOperator(value);
    } else if (type === 'eq') {
        if (operator && currentValue !== null) {
            const result = eval(`${currentValue} ${operator} ${parseFloat(display)}`);
            setDisplay(String(result));
            setCurrentValue(null);
            setOperator(null);
            setWaitingForOperand(true);
        }
    } else if (type === 'clear') {
        setDisplay('0');
        setCurrentValue(null);
        setOperator(null);
        setWaitingForOperand(true);
    }
  };

  const buttonLayout = [
    { text: 'C', class: 'clear text-yellow-400 col-span-2', type: 'clear' },
    { text: '÷', class: 'op text-pink-400', value: '/', type: 'op' },
    { text: '×', class: 'op text-pink-400', value: '*', type: 'op' },
    { text: '7', class: 'num', type: 'num' },
    { text: '8', class: 'num', type: 'num' },
    { text: '9', class: 'num', type: 'num' },
    { text: '-', class: 'op text-pink-400', value: '-', type: 'op' },
    { text: '4', class: 'num', type: 'num' },
    { text: '5', class: 'num', type: 'num' },
    { text: '6', class: 'num', type: 'num' },
    { text: '+', class: 'op text-pink-400 row-span-2', value: '+', type: 'op' },
    { text: '1', class: 'num', type: 'num' },
    { text: '2', class: 'num', type: 'num' },
    { text: '3', class: 'num', type: 'num' },
    { text: '0', class: 'num col-span-2', type: 'num' },
    { text: '.', class: 'dec', type: 'dec' },
    { text: '=', class: 'eq bg-cyan-500 text-black hover:bg-cyan-400', type: 'eq' },
  ];

  const formattedDisplay = display.length > 9 ? parseFloat(display).toExponential(3) : display;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="cyber-card neon-border w-full max-w-xs p-4 bg-black/90 border-none no-print">
        <div className="w-full h-20 bg-black/50 border border-cyan-400 rounded-lg mb-4 flex items-center justify-end p-4 text-4xl text-white font-mono" style={{ textShadow: '0 0 5px #fff' }}>
          {formattedDisplay}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {buttonLayout.map((b) => (
            <button
              key={b.text}
              onClick={() => handleButtonClick(b.type, b.value || b.text)}
              className={`bg-black/40 rounded-lg text-2xl font-bold hover:bg-pink-500 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 py-4 ${b.class}`}
            >
              {b.text}
            </button>
          ))}
        </div>
        <Button onClick={() => setIsOpen(false)} className="w-full mt-4 cyber-btn">
          CLOSE
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CalculatorModal;
