"use client";
import React from "react";

export default function AboutPage() {
  return (
    <section className="relative flex flex-col items-center px-6 py-[100px] bg-black text-white">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradientText mb-8">
        About Me
      </h1>

      <div className="max-w-3xl text-gray-300 space-y-6">
        <p className="leading-relaxed">
          Hello! I’m <span className="font-semibold">Qinhao Zhang</span>, a passionate Data Scientist with a strong background in AI, Machine Learning, and Data Analysis. 
          I thrive on solving complex problems, exploring innovative solutions, and staying on the cutting edge of technology.
        </p>

        <p className="leading-relaxed">
          I hold a <span className="font-semibold">B.S. in Applied Statistics & Data Science</span> from Penn State University and am currently pursuing a <span className="font-semibold">M.S. in Data Science</span> at Northeastern University. My academic and professional experiences have shaped my approach to data-driven insights and AI research.
        </p>

        <p className="leading-relaxed">
          Beyond coding and data crunching, I love to explore new frontiers in AI, collaborate on innovative projects, and share knowledge with the community. Welcome to my personal site—let’s build the future together!
        </p>
      </div>
    </section>
  );
}
