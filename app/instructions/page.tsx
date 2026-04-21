import Link from 'next/link';

export default function InstructionsPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Experiment Instructions / 实验说明
        </h1>

        <div className="space-y-6 text-gray-700 leading-7">
          <div>
            <p>
              In this study, you will complete several fortune-telling tasks.
              In each task, you will read a scenario, write a prompt, view an
              AI-generated response, and rate that response.
            </p>
            <p className="mt-2 text-gray-600">
              在本研究中，你将完成若干个与“AI 算命回答”相关的小任务。
              在每个任务中，你需要阅读一个情境、写出一段提问、查看 AI
              生成的回答，并对该回答进行评分。
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Prompt Style 1: Subjective / Affective
              <br />
              提问风格 1：主观 / 情感型
            </h2>
            <p>
              This style should sound personal, emotional, and reflective. It
              may include feelings, worries, hopes, or inner thoughts.
            </p>
            <p className="mt-2 text-gray-600">
              这种风格应当更个人化、更带有情绪，也更偏向内心表达。
              可以包含你的感受、担忧、期待或内心想法。
            </p>
            <p className="mt-2 italic text-gray-600">
              Example 示例: “I feel anxious about my future career and wonder
              what will happen to me.”
            </p>
            <p className="mt-1 italic text-gray-500">
              “我对自己未来的职业发展感到焦虑，也想知道将来会发生什么。”
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Prompt Style 2: Objective / Factual
              <br />
              提问风格 2：客观 / 事实型
            </h2>
            <p>
              This style should sound neutral, factual, and less emotional. It
              should focus on concrete topics rather than feelings.
            </p>
            <p className="mt-2 text-gray-600">
              这种风格应当更中性、更客观，减少情绪化表达，
              更关注具体内容而不是个人感受。
            </p>
            <p className="mt-2 italic text-gray-600">
              Example 示例: “Please provide a prediction about my future career
              development.”
            </p>
            <p className="mt-1 italic text-gray-500">
              “请对我未来的职业发展做一个预测。”
            </p>
          </div>

          <div className="rounded-xl bg-blue-50 p-4 text-blue-900">
            <p>
              Please keep the topic of the question the same when writing in
              different styles. Only the writing style should change.
            </p>
            <p className="mt-2">
              在使用不同风格写提问时，请尽量保持问题主题一致，
              只改变表达风格，不改变核心内容。
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/trial?index=0"
            className="inline-block rounded-xl bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition"
          >
            Begin Trials / 开始实验
          </Link>
        </div>
      </div>
    </main>
  );
}