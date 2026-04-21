'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getStudyData, saveDemographics } from '@/lib/storage';

export default function DemographicsPage() {
  const router = useRouter();
  const studyData = getStudyData();

  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [aiExperience, setAiExperience] = useState('');
  const [fortuneBelief, setFortuneBelief] = useState('');

  const handleContinue = () => {
    if (!age || !aiExperience || !fortuneBelief) {
      alert('Please complete the required fields. / 请填写必填项。');
      return;
    }

    saveDemographics({
      age,
      gender,
      aiExperience,
      fortuneBelief,
    });

    router.push('/instructions');
  };

  if (!studyData) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-xl">
          <p className="mb-4">No study session found. / 未找到实验会话。</p>
          <Link href="/" className="text-blue-600 underline">
            Return Home / 返回首页
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Demographics / 基本信息
        </h1>
        <p className="text-gray-600 mb-6">
          Participant ID: {studyData.participantId}
        </p>

        <div className="space-y-5">
          <div>
            <label className="block font-semibold mb-2">Age / 年龄 *</label>
            <input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Gender (optional) / 性别（可选）
            </label>
            <input
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Have you used AI chatbots before? / 你以前使用过 AI 聊天机器人吗？ *
            </label>
            <select
              value={aiExperience}
              onChange={(e) => setAiExperience(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-3"
            >
              <option value="">Select / 请选择</option>
              <option value="Yes">Yes / 是</option>
              <option value="No">No / 否</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Do you believe in fortune-telling? (1-7) / 你相信算命吗？(1-7) *
            </label>
            <select
              value={fortuneBelief}
              onChange={(e) => setFortuneBelief(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-3"
            >
              <option value="">Select / 请选择</option>
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <option key={n} value={String(n)}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="mt-8 rounded-xl bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition"
        >
          Continue / 继续
        </button>
      </div>
    </main>
  );
}