"use client";

import React from "react";
import ParticleBackground from "@/components/ParticleBackground";

export default function ProjectsPage() {
  return (
    <section className="relative bg-black text-white px-6 py-[100px]">
      <ParticleBackground particleCount={25} />
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradientText">
        PROJECTS & PUBLICATIONS
      </h1>
      <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
        
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
            <time className="font-mono italic block text-green-400">
              May. 2025 – present
            </time>
            <div className="text-lg font-black text-purple-300">
              Tradgent: AI-powered trading recommendation system
            </div>
            <p className="mt-2">
              Tradgent is an AI-powered trading recommendation system that provides real-time
              insights and personalized recommendations to help traders make informed decisions.
              The system uses FastAPI and Pydantic-ai to provide a RESTful API for traders to
              interact with the system. The system also uses MongoDB and Redis to store user data and
              transaction history. The AI chat for user will give real-time advice and alert user
              when there is a risk of loss.
            </p>
          </div>
          <hr />
        </li>

        {/* 第二项：EmojiCamera */}
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
            <time className="font-mono italic block text-green-400">
              Sep. 2024 – Jan. 2025
            </time>
            <div className="text-lg font-black text-purple-300">
              EmojiCamera: Facial Expression Detection AI
            </div>
            <p className="mt-2">
              Led the development of a real-time AI system that detects facial
              expressions and maps them to corresponding emojis. By leveraging MobileNetV3 with
              attention mechanisms, the model achieved a 75% accuracy. Additionally, I co-authored a
              research paper, “Lightweight Facial Expression Recognition Models for Low-Cost
              Computing Environments”.
            </p>
          </div>
          <hr />
        </li>

        {/* 第三项：Flight Subscription Service */}
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
            <time className="font-mono italic block text-green-400">
              Mar. 2024 – May. 2024
            </time>
            <div className="text-lg font-black text-purple-300">
              Flight Subscription Service
            </div>
            <p className="mt-2">
              Developed a flight deal subscription platform that integrates REST APIs for
              real-time flight data retrieval. The system allows users to sign up for alerts and
              search for deals, improving user engagement. Built with React (frontend), Node.js
              (backend), and MySQL (database), the platform optimizes performance and scalability.
            </p>
          </div>
          <hr />
        </li>

        {/* 第四项：Advanced Car Bidding System */}
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
            <time className="font-mono italic block text-green-400">
              Jan. 2024 – Apr. 2024
            </time>
            <div className="text-lg font-black text-purple-300">
              Advanced Car Bidding System
            </div>
            <p className="mt-2">
              Designed a real-time car auction platform with a Django backend, React frontend, and
              MySQL database. The system features secure user authentication, dynamic bidding
              interfaces, and Docker-based deployment on GCP. My contributions improved the platform’s
              usability, security, and scalability.
            </p>
          </div>
          <hr />
        </li>

        {/* 第五项：Stock Forecast */}
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
            <time className="font-mono italic block text-green-400">
              9. 2022 – 12. 2022
            </time>
            <div className="text-lg font-black text-purple-300">
              Vaccine Companies Stock Price Forecast During COVID-19
            </div>
            <p className="mt-2">
            Developed a time series forecasting model using ARIMA and SARIMA to predict stock price trends for Pfizer, Johnson & Johnson, and Moderna during the COVID-19 pandemic. 
            By collecting official CDC data (daily infections, deaths, vaccination rates, etc.) and applying differencing techniques, the model was trained to capture stock price movements. 
            However, due to the high volatility of stock markets and numerous external factors, the prediction accuracy remained around 50%, 
            highlighting the complexity of relying solely on pandemic-related data for financial forecasting.
            </p>
          </div>
          <hr />
        </li>
      </ul>
    </section>
  );
}
