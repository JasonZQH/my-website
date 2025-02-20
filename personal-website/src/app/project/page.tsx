"use client";
import React from "react";

export default function ProjectsPage() {
  return (
    <section className="bg-black text-white px-6 py-[100px]">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradientText">
        PROJECTS
      </h1>
      <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
        {/* 第一项 */}
        <li>
          <div className="timeline-middle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="timeline-start mb-10 md:text-end">
            <time className="font-mono italic block text-green-400">2023</time>
            <div className="text-lg font-black text-purple-300">AI Chatbot</div>
            Developed an NLP-based chatbot using transformer architecture to enable real-time conversation and sentiment analysis.
          </div>
          <hr />
        </li>
        {/* 第二项 */}
        <li>
          <hr />
          <div className="timeline-middle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="timeline-end mb-10">
            <time className="font-mono italic block block text-green-400">2022</time>
            <div className="text-lg font-black text-purple-300">Computer Vision Research</div>
            Built a convolutional neural network for image classification with advanced augmentation techniques, achieving high accuracy on challenging datasets.
          </div>
          <hr />
        </li>
        {/* 第三项 */}
        <li>
          <hr />
          <div className="timeline-middle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="timeline-start mb-10 md:text-end">
            <time className="font-mono italic block text-green-400">2021</time>
            <div className="text-lg font-black text-purple-300">Web-based Data Visualization</div>
            Developed interactive dashboards to visualize large datasets, providing actionable insights for stakeholders.
          </div>
          <hr />
        </li>
      </ul>
    </section>
  );
}
