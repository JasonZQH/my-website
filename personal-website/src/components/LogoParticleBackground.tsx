"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { companyLogos } from "./CompanyLogos";

interface LogoParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  targetOpacity: number;
  fadePhase: 'fadeIn' | 'visible' | 'fadeOut';
  phaseTimer: number;
  logoId: string;
  logoComponent: React.ComponentType<{ size?: number }>;
  logoName: string;
  logoColor: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

interface LogoParticleBackgroundProps {
  logoCount?: number;
}

export default function LogoParticleBackground({ logoCount = 6 }: LogoParticleBackgroundProps) {
  const [logoParticles, setLogoParticles] = useState<LogoParticle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  // 随机选择logos
  const getRandomLogos = (count: number) => {
    const shuffled = [...companyLogos].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // 创建新的logo粒子
  const createLogoParticle = (logo: typeof companyLogos[0]): LogoParticle => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const height = typeof window !== 'undefined' ? window.innerHeight : 1080;
    
    return {
      id: `${logo.id}-${Date.now()}-${Math.random()}`,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3, // 比普通粒子慢50%
      vy: (Math.random() - 0.5) * 0.3,
      opacity: 0,
      targetOpacity: 0.4 + Math.random() * 0.3, // 0.4-0.7之间
      fadePhase: 'fadeIn',
      phaseTimer: 0,
      logoId: logo.id,
      logoComponent: logo.component,
      logoName: logo.name,
      logoColor: logo.color,
      size: 32 + Math.random() * 16, // 32-48px
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.5, // 轻微旋转
    };
  };

  // 初始化logo粒子
  useEffect(() => {
    const initLogoParticles = () => {
      const randomCount = Math.floor(Math.random() * 4) + 5; // 5-8个
      const selectedLogos = getRandomLogos(randomCount);
      const particles = selectedLogos.map(logo => createLogoParticle(logo));
      setLogoParticles(particles);
    };

    initLogoParticles();
    
    // 窗口大小改变时重新初始化
    const handleResize = () => {
      initLogoParticles();
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [logoCount]);

  // 动画循环
  useEffect(() => {
    const animate = () => {
      setLogoParticles(prevParticles => 
        prevParticles.map(particle => {
          const width = typeof window !== 'undefined' ? window.innerWidth : 1920;
          const height = typeof window !== 'undefined' ? window.innerHeight : 1080;
          
          // 更新位置
          let newX = particle.x + particle.vx;
          let newY = particle.y + particle.vy;
          
          // 边界检测
          if (newX < -particle.size || newX > width + particle.size) {
            particle.vx *= -1;
            newX = Math.max(-particle.size, Math.min(width + particle.size, newX));
          }
          if (newY < -particle.size || newY > height + particle.size) {
            particle.vy *= -1;
            newY = Math.max(-particle.size, Math.min(height + particle.size, newY));
          }
          
          // 更新旋转
          const newRotation = particle.rotation + particle.rotationSpeed;
          
          // 更新透明度和阶段
          let newOpacity = particle.opacity;
          let newPhase = particle.fadePhase;
          let newPhaseTimer = particle.phaseTimer + 1;
          
          switch (particle.fadePhase) {
            case 'fadeIn':
              newOpacity = Math.min(particle.targetOpacity, particle.opacity + 0.01);
              if (newOpacity >= particle.targetOpacity) {
                newPhase = 'visible';
                newPhaseTimer = 0;
              }
              break;
              
            case 'visible':
              if (newPhaseTimer > 480) { // 8秒 (60fps * 8)
                newPhase = 'fadeOut';
                newPhaseTimer = 0;
              }
              break;
              
            case 'fadeOut':
              newOpacity = Math.max(0, particle.opacity - 0.008);
              if (newOpacity <= 0) {
                // 重新生成新的logo
                const randomLogos = getRandomLogos(1);
                if (randomLogos.length > 0) {
                  const newParticle = createLogoParticle(randomLogos[0]);
                  return {
                    ...newParticle,
                    x: Math.random() * width,
                    y: Math.random() * height,
                  };
                }
              }
              break;
          }
          
          return {
            ...particle,
            x: newX,
            y: newY,
            vx: particle.vx * 0.999, // 轻微阻尼
            vy: particle.vy * 0.999,
            opacity: newOpacity,
            fadePhase: newPhase,
            phaseTimer: newPhaseTimer,
            rotation: newRotation,
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
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {logoParticles.map(particle => {
        const LogoComponent = particle.logoComponent;
        
        return (
          <motion.div
            key={particle.id}
            className="absolute pointer-events-none"
            style={{
              left: particle.x - particle.size / 2,
              top: particle.y - particle.size / 2,
              opacity: particle.opacity,
              transform: `rotate(${particle.rotation}deg)`,
            }}
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div 
              className="flex items-center justify-center"
              style={{
                width: particle.size,
                height: particle.size,
                color: particle.logoColor,
                filter: `drop-shadow(0 0 8px ${particle.logoColor}40)`,
              }}
            >
              <LogoComponent size={particle.size * 0.8} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}