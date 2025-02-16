"use client";

import { FormEvent, useState } from 'react';

export default function ContactPage() {
  const [field, setField] = useState('');
  const [canRefer, setCanRefer] = useState(false);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [content, setContent] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ field, canRefer, isRecruiter, content }),
      });

      if (res.ok) {
        const data = await res.json();
        setResponseMessage(data.message);
        // 清空表单
        setField('');
        setCanRefer(false);
        setIsRecruiter(false);
        setContent('');
      } else {
        setResponseMessage('Submission failed.');
      }
    } catch (error) {
      console.error(error);
      setResponseMessage('An error occurred.');
    }
  };

  return (
    <section className="max-w-md mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Contact / Suggestion Box</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          Your Field:
          <select
            className="block w-full mt-1 bg-gray-800 p-2"
            value={field}
            onChange={(e) => setField(e.target.value)}
            required
          >
            <option value="">--Select--</option>
            <option value="SDE">Software Engineering</option>
            <option value="DataScience">Data Scientist</option>
            <option value="AI/ML">AI/ML</option>
            <option value="WebDev">Web Development</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={canRefer}
            onChange={(e) => setCanRefer(e.target.checked)}
          />
          I can provide a job referral
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={isRecruiter}
            onChange={(e) => setIsRecruiter(e.target.checked)}
          />
          I am a recruiter
        </label>

        <label>
          Suggestion:
          <textarea
            className="block w-full mt-1 bg-gray-800 p-2"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>

      {responseMessage && (
        <p className="mt-4 text-green-400">{responseMessage}</p>
      )}
    </section>
  );
}
