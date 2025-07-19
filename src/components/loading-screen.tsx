"use client";

import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen fixed inset-0 bg-black z-50">
      <h1 className="cyber-title text-4xl mb-8">กำลังเชื่อมต่อระบบ...</h1>
      <div className="spinner"></div>
      <p className="mt-4 text-cyan-300">กำลังโหลดข้อมูล...</p>
    </div>
  );
};

export default LoadingScreen;
