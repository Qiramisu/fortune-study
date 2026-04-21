'use client';

import Link from 'next/link';
import { useState } from 'react';
import { initializeStudy } from '@/lib/storage';

export default function Home() {
  const [participantId, setParticipantId] = useState<string | null>(null);

  const generateId = () => {
    const id = 'P' + Math.floor(10000 + Math.random() * 90000);
    setParticipantId(id);
    initializeStudy(id);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Fortune-Telling Study / AI 算命实验
        </h1>

        <p className="text-gray-700 mb-6 leading-7">
          You will complete several short tasks involving AI-generated
          fortune-telling responses.
        </p>
        <p className="text-gray-600 mb-6 leading-7">
          你将完成若干个与 AI 算命回答相关的小任务。
        </p>

        {!participantId ? (
          <button
            onClick={generateId}
            className="rounded-xl bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition"
          >
            Start Experiment / 开始实验
          </button>
        ) : (
          <div className="space-y-4">
            <p className="text-green-700 font-semibold">
              Your Participant ID / 你的参与者编号: {participantId}
            </p>

            <Link
              href="/demographics"
              className="inline-block rounded-xl bg-green-600 px-6 py-3 text-white font-medium hover:bg-green-700 transition"
            >
              Continue / 继续
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}