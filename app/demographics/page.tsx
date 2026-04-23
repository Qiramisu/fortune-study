'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getStudyData, saveDemographics } from '@/lib/storage';

export default function DemographicsPage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [participantId, setParticipantId] = useState('');

  const [age, setAge] = useState('');
  const [aiExperience, setAiExperience] = useState('');
  const [fortuneBelief, setFortuneBelief] = useState('');

  useEffect(() => {
    setMounted(true);
    const studyData = getStudyData();
    if (studyData?.participantId) {
      setParticipantId(studyData.participantId);
    }
  }, []);

  const handleContinue = () => {
    if (!age || !aiExperience || !fortuneBelief) {
      alert('Please complete the required fields. / 请填写必填项。');
      return;
    }

    saveDemographics({
      age,
      aiExperience,
      fortuneBelief,
    });

    router.push('/instructions');
  };

  if (!mounted) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <p className="text-gray-800">Loading... / 加载中...</p>
        </div>
      </main>
    );
  }

  if (!participantId) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-xl">
          <p className="mb-4 text-gray-800">No study session found. / 未找到实验会话。</p>
          <Link href="/" className="text-blue-700 underline">
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
          Basic Information / 基本信息
        </h1>
        <p className="text-gray-800 mb-6">
          Participant ID: {participantId}
        </p>

        <div className="space-y-5">
          <div>
            <label className="block font-semibold mb-2 text-gray-900">
              Age / 年龄 *
            </label>
            <input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full rounded-xl border border-gray-400 p-3 text-gray-900"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-900">
              Have you used AI chatbots before? / 你以前使用过 AI 聊天机器人吗？ *
            </label>
            <select
              value={aiExperience}
              onChange={(e) => setAiExperience(e.target.value)}
              className="w-full rounded-xl border border-gray-400 p-3 text-gray-900"
            >
              <option value="">Select / 请选择</option>
              <option value="Yes">Yes / 是</option>
              <option value="No">No / 否</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-900">
              Do you believe in fortune-telling? (1-7) / 你相信占卜吗？(1-7) *
            </label>
            <select
              value={fortuneBelief}
              onChange={(e) => setFortuneBelief(e.target.value)}
              className="w-full rounded-xl border border-gray-400 p-3 text-gray-900"
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
          className="mt-8 rounded-xl bg-blue-700 px-6 py-3 text-white font-medium hover:bg-blue-800 transition"
        >
          Continue / 继续
        </button>
      </div>
    </main>
  );
}