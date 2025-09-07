"use client";
import React from "react";
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import {
    AcademicCapIcon,
    BriefcaseIcon,
    ChevronDownIcon,
  } from "@heroicons/react/24/solid";
import ParticleBackground from "@/components/ParticleBackground";

interface TimelineItem {
  date: string;
  title: string;
  location?: string;
  details: string;
  icon?: React.ReactNode;
}

const timelineData: TimelineItem[] = [
  {
      date: "2025/09 - present",
      title: "Teaching Assistant",
      location: "Northeastern University",
      details: "TA for CS5610: Web Development",
      icon: <BriefcaseIcon className="w-6 h-6 text-blue-400" />,
    },
  {
      date: "2025/06 - 2025/08",
      title: "Backend Software Enginnering Intern",
      location: "XPerf",
      details: "Engineered the backend of an AI-powered bookkeeping application using Django with Pydantic-ai agent tool, enabling expense and income tracking, automated invoice generation, and integration of tax calculation features.",
      icon: <BriefcaseIcon className="w-6 h-6 text-blue-400" />,
    },
    {
      date: "2025/1 - 2025/04",
      title: "Software Enginnering Intern",
      location: "IpserLab",
      details: "AI based Travel management system using Langchain for Java",
      icon: <BriefcaseIcon className="w-6 h-6 text-blue-400" />,
    },
    {
      date: "2024/6 - 2024/8",
      title: "Software Enginnering Intern",
      location: "SuperADS",
      details: 
        "Developed AI-driven video deduplication workflows, leveraging ComfyUI custom nodes to enhance video quality. My work on FUNCUIP, FUNSAR, and VCED models improved system scalability and maintainability. Additionally, I collaborated with cross-functional teams to introduce data-driven quality monitoring indicators, increasing self-check efficiency by 30%.",
      icon: <BriefcaseIcon className="w-6 h-6 text-blue-400" />,
    },
    {
      date: "2023/9 - Present",
      title: "M.S. in Computer Science",
      location: "Northeastern University",
      details:
        "Focusing on machine learning, deep learning, and big data analytics, building advanced skills to tackle real-world AI challenges.",
      icon: <AcademicCapIcon className="w-6 h-6 text-green-400" />,
    },
    {
      date: "2022/5 - 2022/8",
      title: "Data Science Intern",
      location: "Surge Consulting",
      details:
        "Automated voice-to-text transcription pipelines, reducing manual workload by 40% and improving efficiency. By deploying a Transformer-based ASR model (Wav2Vec 2.0), I enhanced transcription accuracy by 30%. My work also included integrating the ASR system into a scalable microservices architecture using Docker and Kubernetes.",
      icon: <BriefcaseIcon className="w-6 h-6 text-blue-400" />,
    },
    {
      date: "2018/9 - 2022/12",
      title: "B.S. in Applied Statistics & Data Science",
      location: "Penn State University",
      details:
        "Developed a strong foundation in statistical analysis, programming, and data manipulation. Collaborated on multiple data-driven research projects.",
      icon: <AcademicCapIcon className="w-6 h-6 text-green-400" />,
    },
  ];
  
  export default function ExperiencePage() {
    return (
      <section className="relative flex flex-col items-center px-6 py-[100px] bg-black text-white">
        <ParticleBackground particleCount={25} />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradientText mb-8">
          Experience
        </h1>
  
        <div className="relative w-full max-w-4xl">
          {/* 中间垂直中线 */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-600" />
  
          <div className="space-y-10">
            {timelineData.map((item, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <div key={idx} className="relative flex w-full">
                  {isLeft ? (
                    <>
                      {/* 左侧容器：让 box 靠近中线 */}
                      <div className="w-1/2 flex justify-end pr-2">
                        {/* Disclosure box */}
                        <Disclosure as="div" className="w-[310px] bg-white/5 rounded-xl p-4">
                          {({ open }) => (
                            <>
                              <div className="flex items-center gap-2 mb-2">
                                {item.icon}
                                <span className="text-sm text-gray-400 italic">
                                  {item.date}
                                </span>
                              </div>
                              <DisclosureButton className="group flex w-full items-center justify-between focus:outline-none">
                                <span className="text-base font-semibold text-gray-200 group-hover:text-white">
                                  {item.title}
                                </span>
                                <ChevronDownIcon
                                  className={`w-4 h-4 text-white/60 transition-transform ${
                                    open ? "rotate-180" : ""
                                  }`}
                                />
                              </DisclosureButton>
                              <DisclosurePanel className="mt-2 text-sm text-gray-300 leading-relaxed">
                                {item.location && (
                                  <p className="italic mb-1 text-gray-400">
                                    {item.location}
                                  </p>
                                )}
                                <p>{item.details}</p>
                              </DisclosurePanel>
                            </>
                          )}
                        </Disclosure>
                      </div>
                      <div className="w-1/2" />
                    </>
                  ) : (
                    <>
                      <div className="w-1/2" />
                      {/* 右侧容器 */}
                      <div className="w-1/2 flex justify-start pl-2">
                        <Disclosure as="div" className="w-[310px] bg-white/5 rounded-xl p-4">
                          {({ open }) => (
                            <>
                              <div className="flex items-center gap-2 mb-2">
                                {item.icon}
                                <span className="text-sm text-gray-400 italic">
                                  {item.date}
                                </span>
                              </div>
                              <DisclosureButton className="group flex w-full items-center justify-between focus:outline-none">
                                <span className="text-base font-semibold text-gray-200 group-hover:text-white">
                                  {item.title}
                                </span>
                                <ChevronDownIcon
                                  className={`w-4 h-4 text-white/60 transition-transform ${
                                    open ? "rotate-180" : ""
                                  }`}
                                />
                              </DisclosureButton>
                              <DisclosurePanel className="mt-2 text-sm text-gray-300 leading-relaxed">
                                {item.location && (
                                  <p className="italic mb-1 text-gray-400">
                                  {item.location}
                                  </p>
                                )}
                                <p>{item.details}</p>
                              </DisclosurePanel>
                            </>
                          )}
                        </Disclosure>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }