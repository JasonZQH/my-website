"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

interface ParticleBackgroundProps {
  particleCount?: number;
}

export default function ParticleBackground({ particleCount = 50 }: ParticleBackgroundProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  // 初始化粒子
  useEffect(() => {
    const initParticles = () => {
      const newParticles: Particle[] = [];
      const width = typeof window !== 'undefined' ? window.innerWidth : 1920;
      const height = typeof window !== 'undefined' ? window.innerHeight : 1080;
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: Math.random() * 100,
          maxLife: 100,
          size: Math.random() * 3 + 1
        });
      }
      setParticles(newParticles);
    };

    initParticles();
    
    // 窗口大小改变时重新初始化
    const handleResize = () => {
      initParticles();
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [particleCount]);

  // 鼠标移动事件
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // 粒子动画循环
  useEffect(() => {
    const animate = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          // 计算与鼠标的距离
          const dx = mousePos.x - particle.x;
          const dy = mousePos.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // 鼠标附近的粒子会被吸引
          let newVx = particle.vx;
          let newVy = particle.vy;
          
          if (distance < 100) {
            const force = (100 - distance) / 100 * 0.01;
            newVx += (dx / distance) * force;
            newVy += (dy / distance) * force;
          }
          
          // 更新位置
          let newX = particle.x + newVx;
          let newY = particle.y + newVy;
          
          // 边界检测
          const width = typeof window !== 'undefined' ? window.innerWidth : 1920;
          const height = typeof window !== 'undefined' ? window.innerHeight : 1080;
          
          if (newX < 0 || newX > width) {
            newVx *= -0.8;
            newX = Math.max(0, Math.min(width, newX));
          }
          if (newY < 0 || newY > height) {
            newVy *= -0.8;
            newY = Math.max(0, Math.min(height, newY));
          }
          
          // 生命周期
          let newLife = particle.life + 1;
          if (newLife > particle.maxLife) {
            newLife = 0;
            newX = Math.random() * width;
            newY = Math.random() * height;
            newVx = (Math.random() - 0.5) * 0.5;
            newVy = (Math.random() - 0.5) * 0.5;
          }
          
          return {
            ...particle,
            x: newX,
            y: newY,
            vx: newVx * 0.99, // 阻尼
            vy: newVy * 0.99,
            life: newLife
          };
        })
      );
      
      if (typeof window !== 'undefined') {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (typeof window !== 'undefined') {
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePos]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {/* 鼠标光晕效果 */}
      <motion.div
        className="absolute w-32 h-32 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)",
          left: mousePos.x - 64,
          top: mousePos.y - 64,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* 粒子 */}
      {particles.map(particle => {
        const opacity = 1 - (particle.life / particle.maxLife);
        const distance = Math.sqrt(
          Math.pow(mousePos.x - particle.x, 2) + 
          Math.pow(mousePos.y - particle.y, 2)
        );
        const glowIntensity = Math.max(0, 1 - distance / 150);
        
        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              background: `rgba(16, 185, 129, ${Math.max(0.3, opacity * 0.8)})`,
              boxShadow: glowIntensity > 0.1 
                ? `0 0 ${glowIntensity * 20}px rgba(16, 185, 129, ${glowIntensity * 0.8})` 
                : `0 0 4px rgba(16, 185, 129, 0.3)`
            }}
            animate={{
              scale: glowIntensity > 0.2 ? 1.5 : 1
            }}
            transition={{ duration: 0.3 }}
          />
        );
      })}
    </div>
  );
}