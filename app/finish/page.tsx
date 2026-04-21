'use client';

import { useEffect, useState } from 'react';

export default function FinishPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('studyData');
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `study_${data?.participantId || 'unknown'}.json`;
    a.click();
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">
        Thank you for participating! / 感谢参与！
      </h1>

      <button
        onClick={downloadJSON}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg"
      >
        Download Results / 下载结果
      </button>
    </main>
  );
}