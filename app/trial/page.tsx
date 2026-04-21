'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { getStudyData, saveTrial } from '@/lib/storage';

const TRIALS = [
  {
    scenario: 'Relationship',
    scenarioZh: '感情关系',
    style: 'Subjective / Affective',
    styleZh: '主观 / 情感型',
  },
  {
    scenario: 'Career / Study',
    scenarioZh: '学业职业',
    style: 'Objective / Factual',
    styleZh: '客观 / 事实型',
  },
  {
    scenario: 'Life Direction',
    scenarioZh: '人生方向',
    style: 'Subjective / Affective',
    styleZh: '主观 / 情感型',
  },
  {
    scenario: 'Relationship',
    scenarioZh: '感情关系',
    style: 'Objective / Factual',
    styleZh: '客观 / 事实型',
  },
  {
    scenario: 'Career / Study',
    scenarioZh: '学业职业',
    style: 'Subjective / Affective',
    styleZh: '主观 / 情感型',
  },
  {
    scenario: 'Life Direction',
    scenarioZh: '人生方向',
    style: 'Objective / Factual',
    styleZh: '客观 / 事实型',
  },
];

function getScenarioText(scenario: string) {
  if (scenario === 'Relationship') {
    return {
      en: 'Imagine that you want to ask about your romantic or relationship future.',
      zh: '假设你想询问自己未来的感情或亲密关系发展。',
    };
  }

  if (scenario === 'Career / Study') {
    return {
      en: 'Imagine that you want to ask about your future in career or studies.',
      zh: '假设你想询问自己未来的学业或职业发展。',
    };
  }

  return {
    en: 'Imagine that you want to ask about your personal future or life direction.',
    zh: '假设你想询问自己未来的人生走向或生活方向。',
  };
}

function getStyleText(style: string) {
  if (style.includes('Subjective')) {
    return {
      en: 'Please write in a more personal, emotional, and reflective way.',
      zh: '请使用更个人化、更带有情绪和内心感受的方式来写你的提问。',
    };
  }

  return {
    en: 'Please write in a more neutral, factual, and less emotional way.',
    zh: '请使用更中性、更客观、较少情绪表达的方式来写你的提问。',
  };
}

type StudyData = {
  participantId: string;
  demographics: {
    age: string;
    gender: string;
    aiExperience: string;
    fortuneBelief: string;
  } | null;
  trials: Array<{
    trialIndex: number;
    scenario: string;
    style: string;
    promptText: string;
    aiResponse: string;
    selfFit: string;
    satisfaction: string;
  }>;
};

export default function TrialPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false);
  const [studyData, setStudyData] = useState<StudyData | null>(null);

  const trialIndex = Number(searchParams.get('index') || '0');
  const trial = TRIALS[trialIndex];

  const [promptText, setPromptText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [selfFit, setSelfFit] = useState('');
  const [satisfaction, setSatisfaction] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    const data = getStudyData();
    setStudyData(data);
  }, []);

  useEffect(() => {
    setPromptText('');
    setAiResponse('');
    setSelfFit('');
    setSatisfaction('');
    setLoading(false);
  }, [trialIndex]);

  const scenarioText = useMemo(() => {
    if (!trial) return null;
    return getScenarioText(trial.scenario);
  }, [trial]);

  const styleText = useMemo(() => {
    if (!trial) return null;
    return getStyleText(trial.style);
  }, [trial]);

  const handleGenerate = async () => {
    if (!promptText.trim()) {
      alert('Please write your prompt first. / 请先写下你的提问。');
      return;
    }

    try {
      setLoading(true);
      setAiResponse('');

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptText }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('API error response:', data);
        alert(data.error || 'Failed to generate response.');
        return;
      }

      setAiResponse(data.response || '');
    } catch (error) {
      console.error('Generate error:', error);
      alert('Failed to generate AI response. / 生成 AI 回答失败。');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!trial) return;

    if (!promptText.trim() || !aiResponse.trim() || !selfFit || !satisfaction) {
      alert(
        'Please complete all fields and generate the AI response. / 请填写所有内容并生成 AI 回答。'
      );
      return;
    }

    saveTrial({
      trialIndex,
      scenario: trial.scenario,
      style: trial.style,
      promptText,
      aiResponse,
      selfFit,
      satisfaction,
    });

    if (trialIndex < TRIALS.length - 1) {
      router.push(`/trial?index=${trialIndex + 1}`);
    } else {
      router.push('/finish');
    }
  };

  if (!mounted) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <p className="text-gray-700">Loading... / 加载中...</p>
        </div>
      </main>
    );
  }

  if (!studyData) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="rounded-2xl bg-white p-8 shadow-lg max-w-xl">
          <p className="mb-4 text-gray-700">No study session found. / 未找到实验会话。</p>
          <Link href="/" className="text-blue-600 underline">
            Return Home / 返回首页
          </Link>
        </div>
      </main>
    );
  }

  if (!trial) {
    router.push('/finish');
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Trial {trialIndex + 1} / 实验任务 {trialIndex + 1}
        </h1>

        <p className="mb-6 text-gray-600">
          Participant ID: {studyData.participantId}
        </p>

        <div className="mb-6 rounded-xl bg-gray-50 p-5">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Scenario / 情境
          </h2>
          <p className="text-gray-700">{scenarioText?.en}</p>
          <p className="mt-2 text-gray-600">{scenarioText?.zh}</p>
          <p className="mt-3 text-sm text-gray-500">
            {trial.scenario} / {trial.scenarioZh}
          </p>
        </div>

        <div className="mb-6 rounded-xl bg-blue-50 p-5">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Prompt Style / 提问风格
          </h2>
          <p className="text-gray-700">{trial.style}</p>
          <p className="mt-2 text-gray-600">{trial.styleZh}</p>
          <p className="mt-3 text-gray-700">{styleText?.en}</p>
          <p className="mt-2 text-gray-600">{styleText?.zh}</p>
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-lg font-semibold text-gray-900">
            Your Prompt / 你的提问
          </label>
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Write your prompt here... / 请在这里写下你的提问..."
            className="min-h-[140px] w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-blue-500"
          />

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="mt-4 rounded-xl bg-purple-600 px-6 py-3 text-white font-medium transition hover:bg-purple-700 disabled:opacity-60"
          >
            {loading
              ? 'Generating... / 生成中...'
              : 'Generate AI Response / 生成 AI 回答'}
          </button>
        </div>

        <div className="mb-6 rounded-xl bg-yellow-50 p-5">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            AI Response / AI 回答
          </h2>

          {aiResponse ? (
            <p className="whitespace-pre-wrap text-gray-800">{aiResponse}</p>
          ) : (
            <div>
              <p className="text-gray-700">
                No AI response yet. Please generate one after writing your prompt.
              </p>
              <p className="mt-2 text-gray-600">
                还没有 AI 回答。请先写下提问，再点击按钮生成回答。
              </p>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-lg font-semibold text-gray-900">
            Self-Fit / 自我贴合度
          </label>
          <select
            value={selfFit}
            onChange={(e) => setSelfFit(e.target.value)}
            className="w-full rounded-xl border border-gray-300 p-3"
          >
            <option value="">Select a rating / 请选择评分</option>
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <option key={n} value={String(n)}>
                {n}
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm text-gray-600">
            This response fits me well. / 这个回答与我很贴合。
          </p>
        </div>

        <div className="mb-8">
          <label className="mb-2 block text-lg font-semibold text-gray-900">
            Expectation Satisfaction / 预期满意度
          </label>
          <select
            value={satisfaction}
            onChange={(e) => setSatisfaction(e.target.value)}
            className="w-full rounded-xl border border-gray-300 p-3"
          >
            <option value="">Select a rating / 请选择评分</option>
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <option key={n} value={String(n)}>
                {n}
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm text-gray-600">
            This response meets my expectations. / 这个回答符合我的预期。
          </p>
        </div>

        <button
          onClick={handleNext}
          className="rounded-xl bg-blue-600 px-6 py-3 text-white font-medium transition hover:bg-blue-700"
        >
          {trialIndex === TRIALS.length - 1 ? 'Finish / 完成' : 'Next / 下一步'}
        </button>
      </div>
    </main>
  );
}