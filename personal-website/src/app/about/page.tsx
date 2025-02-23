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
          Hello! I’m <span className="font-semibold">Qinhao Zhang</span>, 
          a passionate Data Scientist and Software Engineer, 
          currently pursuing my <span className="font-semibold">M.S. in Data Science</span> at <span className="font-semibold">Northeastern University - Khoury College of Computer Science</span>. 
          My academic journey has been shaped by a strong foundation in <span className="font-semibold">Applied Statistics and Data Science</span>, which I developed during my undergraduate studies at <span className="font-semibold">M.S. in Data Science</span> at <span className="font-semibold">Pennsylvania State University</span>.
        </p>

        <p className="leading-relaxed">
        My expertise spans <span className="font-semibold">machine learning, computer vision, and algorithm optimization</span>, with hands-on experience in <span className="font-semibold">full-stack development, 
        data engineering, and cloud computing</span>. 
        I have worked on projects involving <span className="font-semibold">real-time AI systems, video processing, and facial expression recognition</span>, 
        leading to contributions in both industry and research.
        </p>

        <p className="leading-relaxed">
        I am particularly interested in <span className="font-semibold">lightweight deep learning models, scalable AI architectures, 
        and real-world AI applications</span> that enhance automation and decision-making processes. 
        My recent research has focused on <span className="font-semibold">efficient AI models for resource-constrained environments</span>, with publications and practical implementations in emerging technologies.
        </p>
        
        <p className="leading-relaxed">
        Beyond academics, I enjoy building <span className="font-semibold">innovative AI-driven applications</span>, exploring algorithmic problem-solving, 
        and collaborating on interdisciplinary projects that merge <span className="font-semibold">data science, software engineering, and artificial intelligence</span>.
        </p>
      </div>
    </section>
  );
}
