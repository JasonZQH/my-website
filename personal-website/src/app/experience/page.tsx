"use client";
import React from "react";
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import {
    AcademicCapIcon,
    BriefcaseIcon,
    ChevronDownIcon,
  } from "@heroicons/react/24/solid";

interface TimelineItem {
  date: string;
  title: string;
  location?: string;
  details: string;
  icon?: React.ReactNode;
}

const timelineData: TimelineItem[] = [
    {
      date: "2023 - Present",
      title: "M.S. in Data Science",
      location: "Northeastern University",
      details:
        "Focusing on machine learning, deep learning, and big data analytics, building advanced skills to tackle real-world AI challenges.",
      icon: <AcademicCapIcon className="w-6 h-6 text-green-400" />,
    },
    {
      date: "2018 - 2022",
      title: "B.S. in Applied Statistics & Data Science",
      location: "Penn State University",
      details:
        "Developed a strong foundation in statistical analysis, programming, and data manipulation. Collaborated on multiple data-driven research projects.",
      icon: <AcademicCapIcon className="w-6 h-6 text-green-400" />,
    },
    {
      date: "Summer 2021",
      title: "Data Science Intern",
      location: "Tech Company XYZ",
      details:
        "Worked on predictive modeling and data visualization, gaining hands-on experience with real-world datasets.",
      icon: <BriefcaseIcon className="w-6 h-6 text-blue-400" />,
    },
  ];
  
  export default function ExperiencePage() {
    return (
      <section className="relative flex flex-col items-center px-6 py-[100px] bg-black text-white">
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