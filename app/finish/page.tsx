'use client';

import { useEffect, useState } from 'react';
import { clearStudyData, getStudyData } from '@/lib/storage';

export default function FinishPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const saved = getStudyData();
    setData(saved);
  }, []);

  const downloadJSON = () => {
    if (!data) {
      alert('No data found. / 没有找到实验数据。');
      return;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data?.participantId || 'unknown'}_results.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    clearStudyData();
    window.location.href = '/';
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto w-full max-w-4xl rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          Study Complete / 实验完成
        </h1>

        <p className="mb-2 text-gray-700">
          Thank you for participating.
        </p>
        <p className="mb-8 text-gray-600">
          感谢你的参与。
        </p>

        <div className="mb-8 rounded-xl bg-gray-50 p-5">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Current Saved Data / 当前已保存数据
          </h2>
          <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-gray-700">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={downloadJSON}
            className="rounded-xl bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition"
          >
            Download Results / 下载结果
          </button>

          <button
            onClick={handleReset}
            className="rounded-xl bg-red-600 px-6 py-3 text-white font-medium hover:bg-red-700 transition"
          >
            Clear Data / 清空数据
          </button>
        </div>
      </div>
    </main>
  );
}