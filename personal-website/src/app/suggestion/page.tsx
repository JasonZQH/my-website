"use client";

import React, { FormEvent, useState } from "react";
import {
  Button,
  Checkbox,
  Description,
  Field,
  Label,
  Input,
  Textarea,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import BrightnessOverlay from "@/components/BrightnessOverlay";
import Footer from "@/components/Footer";

interface FieldOption {
  label: string;
  value: string;
}

interface SuggestionData {
  field: string;
  canRefer: boolean;
  isRecruiter: boolean;
  content: string;
  email?: string;
}

const fieldOptions: FieldOption[] = [
  { label: "Software Engineering", value: "SDE" },
  { label: "Data Scientist", value: "DataScience" },
  { label: "AI/ML", value: "AI/ML" },
  { label: "Web Development", value: "WebDev" },
  { label: "Other", value: "Other" },
];

export default function ContactPage() {
  // ======== 1. 亮度相关状态（与主页类似） ========
  const [brightness, setBrightness] = useState(0);
  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setBrightness(isChecked ? 100 : 0);
  };

  // ======== 2. 表单状态 ========
  const [selectedField, setSelectedField] = useState<FieldOption>(fieldOptions[0]);
  const [canRefer, setCanRefer] = useState(false);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const dataToSubmit: SuggestionData = {
      field: selectedField.value,
      canRefer,
      isRecruiter,
      content,
    };

    if (canRefer) {
      dataToSubmit.email = email;
    }

    try {
      const res = await fetch("http://localhost:4000/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });

      if (res.ok) {
        const data = await res.json();
        setResponseMessage(data.message);
        // 清空表单
        setSelectedField(fieldOptions[0]);
        setCanRefer(false);
        setEmail("");
        setIsRecruiter(false);
        setContent("");
      } else {
        setResponseMessage("Submission failed.");
      }
    } catch (error) {
      console.error(error);
      setResponseMessage("An error occurred.");
    }

    // 清除响应提示（5秒后）
    setTimeout(() => {
      setResponseMessage("");
    }, 5000);
  };

  return (
    <div className="relative bg-black text-white min-h-screen flex flex-col">
      {/* 当 brightness 未达到 100 时，显示覆盖层 */}
      {brightness < 100 && (
        <BrightnessOverlay brightness={brightness} setBrightness={setBrightness} />
      )}

      <section className="max-w-md mx-auto py-[100px] flex-grow">
        <h1 className="text-3xl text-center font-bold mb-6">
          Seeking Your Advice!
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-10">
          {/* 选择领域 */}
          <Field>
            <Label className="text-sm font-medium text-white">Your Field:</Label>
            <div className="mt-1">
              <Listbox value={selectedField} onChange={setSelectedField}>
                <ListboxButton
                  className={clsx(
                    "relative block w-full rounded-lg bg-white/5 py-1.5 pr-8 pl-3 text-left text-sm text-white",
                    "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                  )}
                >
                  {selectedField.label}
                  <ChevronDownIcon
                    className="pointer-events-none absolute top-2.5 right-2.5 h-4 w-4 fill-white/60"
                    aria-hidden="true"
                  />
                </ListboxButton>
                <ListboxOptions
                  className={clsx(
                    "mt-1 w-full rounded-xl border border-white/5 bg-white/5 p-1",
                    "focus:outline-none transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
                  )}
                >
                  {fieldOptions.map((option) => (
                    <ListboxOption
                      key={option.value}
                      value={option}
                      className={({ active }) =>
                        clsx(
                          "group flex cursor-pointer items-center gap-2 rounded-lg py-1.5 px-3 select-none text-sm text-gray-300",
                          active && "bg-white/10 text-white"
                        )
                      }
                    >
                      {({ selected }) => (
                        <>
                          <CheckIcon
                            className={clsx(
                              "h-4 w-4 fill-white transition",
                              selected ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <span>{option.label}</span>
                        </>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Listbox>
            </div>
          </Field>

          {/* 提供内推的复选框 */}
          <label className="flex flex-col gap-2 cursor-pointer">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={canRefer}
                onChange={setCanRefer}
                className="group w-6 h-6 rounded-md bg-white/10 p-1 ring-1 ring-white/15 ring-inset data-[checked]:bg-white"
              >
                <CheckIcon className="hidden w-4 h-4 fill-black group-data-[checked]:block" />
              </Checkbox>
              <span>I can provide a job referral</span>
            </div>
            {/* 当 canRefer 为 true 时显示 email 输入框 */}
            {canRefer && (
              <div className="w-full max-w-md px-4">
                <Field>
                  <Description className="text-sm text-white/50">
                    I will email you, thank you!
                  </Description>
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={clsx(
                      "mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm text-white",
                      "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                    )}
                    required={canRefer}
                  />
                </Field>
              </div>
            )}
          </label>

          {/* 招聘方复选框 */}
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={isRecruiter}
              onChange={setIsRecruiter}
              className="group w-6 h-6 rounded-md bg-white/10 p-1 ring-1 ring-white/15 ring-inset data-[checked]:bg-white"
            >
              <CheckIcon className="hidden w-4 h-4 fill-black group-data-[checked]:block" />
            </Checkbox>
            <span>I'm a recruiter</span>
          </label>

          {/* 建议文本框 */}
          <Field>
            <Label className="text-sm font-medium text-white">Suggestion</Label>
            <Description className="text-sm text-white/50">
              Your suggestion will help me improve my career path.
            </Description>
            <Textarea
              className={clsx(
                "mt-2 block w-full resize-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm text-white",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </Field>

          {/* 提交按钮 */}
          <div className="flex justify-center">
            <Button
              type="submit"
              className={clsx(
                "inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm font-semibold text-white shadow-inner shadow-white/10 focus:outline-none",
                "data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
              )}
            >
              Submit
            </Button>
          </div>
        </form>

        {responseMessage && (
          <p className="mt-4 text-center text-green-400">{responseMessage}</p>
        )}
      </section>

      <Footer brightness={brightness} onToggle={handleToggleChange} />
    </div>
  );
}
