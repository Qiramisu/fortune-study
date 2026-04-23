'use client';

import Link from 'next/link';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
      en: 'Ask about your romantic future or relationship development.',
      zh: '询问你未来的感情发展或亲密关系走向。',
    };
  }

  if (scenario === 'Career / Study') {
    return {
      en: 'Ask about your future in studies, work, or career development.',
      zh: '询问你未来的学业、工作或职业发展。',
    };
  }

  return {
    en: 'Ask about your personal future, major life changes, or life direction.',
    zh: '询问你未来的人生走向、重要变化或生活方向。',
  };
}

function getStyleText(style: string) {
  if (style.includes('Subjective')) {
    return {
      en: 'Please write your question in a more personal, emotional, and reflective way.',
      zh: '请用更个人化、更带情绪和内心感受的方式来提问。',
    };
  }

  return {
    en: 'Please write your question in a more neutral and factual way, avoiding emotional expressions.',
    zh: '请用更客观、中性的方式来提问，尽量减少情绪表达。',
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

function TrialContent() {
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

    if (!promptText.match(/\d+/)) {
      alert('Please include a number (1–78). / 请包含一个数字（1–78）。');
      return;
    }

    try {
      setLoading(true);
      setAiResponse('');

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
            Task Instructions / 任务说明
          </h2>

          <p className="text-gray-700">
            In this task, you will consult a tarot reader.
          </p>
          <p className="mt-2 text-gray-600">
            在这个任务中，你将咨询一位塔罗占卜师。
          </p>

          <ul className="mt-3 list-disc pl-5 text-gray-700 space-y-1">
            <li>Choose a number between 1 and 78</li>
            <li>Think of a question related to the scenario below</li>
            <li>Include BOTH the number and your question</li>
          </ul>

          <ul className="mt-3 list-disc pl-5 text-gray-600 space-y-1">
            <li>选择一个 1–78 之间的数字</li>
            <li>根据下方情境思考一个问题</li>
            <li>在提问中同时包含数字和你的问题</li>
          </ul>

          <p className="mt-4 text-sm text-gray-500">
            Example / 示例: My number is 12. Will my career improve next year?
          </p>
        </div>

        <div className="mb-6 rounded-xl bg-green-50 p-5">
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
            placeholder="e.g., My number is 7. Will my relationship improve? / 示例：我的数字是7，我的感情会变好吗？"
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
            Tarot Reading / 塔罗解读
          </h2>

          {aiResponse ? (
            <p className="whitespace-pre-wrap text-gray-800">{aiResponse}</p>
          ) : (
            <div>
              <p className="text-gray-700">
                No response yet. Please generate a tarot reading after writing your prompt.
              </p>
              <p className="mt-2 text-gray-600">
                还没有解读结果。请先写下提问，再点击按钮生成塔罗解读。
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
            This reading fits me well. / 这个解读与我很贴合。
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
            This reading meets my expectations. / 这个解读符合我的预期。
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

export default function TrialPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <p className="text-gray-700">Loading... / 加载中...</p>
          </div>
        </main>
      }
    >
      <TrialContent />
    </Suspense>
  );
}