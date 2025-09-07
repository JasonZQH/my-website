"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import LogoParticleBackground from "@/components/LogoParticleBackground";

export default function HomePage() {
  return (
    <div className="relative bg-black text-white flex flex-col flex-grow min-h-screen overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground particleCount={30} />
      {/* Logo Particle Background */}
      <LogoParticleBackground logoCount={6} />
      <section className="relative z-10 flex flex-col items-center justify-center flex-grow pt-16 pb-16">
        {/* 3D Avatar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
        >
          <motion.div
            className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gradient-to-r from-green-400 via-blue-500 to-purple-500 shadow-2xl"
            whileHover={{ 
              scale: 1.1,
              rotateY: 15,
              rotateX: 10,
              boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)"
            }}
            style={{ 
              transformStyle: "preserve-3d",
              perspective: 1000 
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Image
              src="/avatar.jpeg"
              alt="Qinhao Zhang Avatar"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Main Quote with 3D Interaction */}
        <motion.h1 
          className="text-4xl font-bold text-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradientText cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          whileHover={{
            scale: 1.02,
            rotateX: 5,
            rotateY: 5,
            textShadow: "0 0 30px rgba(16, 185, 129, 0.5)"
          }}
          style={{
            transformStyle: "preserve-3d",
            perspective: 1000
          }}
        >
          {"The best way to predict the future is to create it.".split("").map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 50, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ 
                delay: 0.5 + i * 0.03,
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -5,
                rotateZ: Math.random() * 20 - 10,
                scale: 1.1,
                color: "#ffffff",
                textShadow: "0 0 20px rgba(16, 185, 129, 0.8)",
                transition: { duration: 0.2 }
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>
        
        <motion.p 
          className="mt-4 max-w-md text-center text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          Seeking An Opportunity To Get a Better Self-Development and Creativity
        </motion.p>
      </section>

      <Footer />
    </div>
  );
}
