import React from "react";

export default function InterviewTips() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white/5 border border-gray-800 rounded-2xl p-10 shadow-2xl text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-purple-300">Interview Tips</h1>
        <ul className="text-left space-y-6 text-lg">
          <li>
            <span className="font-semibold text-blue-400">1. Research the Company:</span>
            <br />
            Understand their mission, products, and recent news. Tailor your answers to show you fit their culture.
          </li>
          <li>
            <span className="font-semibold text-blue-400">2. Practice Common Questions:</span>
            <br />
            Prepare for behavioral, technical, and situational questions. Use the STAR method for structured answers.
          </li>
          <li>
            <span className="font-semibold text-blue-400">3. Ask Insightful Questions:</span>
            <br />
            Show your interest by asking about team culture, growth opportunities, and expectations for the role.
          </li>
          <li>
            <span className="font-semibold text-blue-400">4. Mind Your Body Language:</span>
            <br />
            Maintain eye contact, sit up straight, and use positive gestures to convey confidence.
          </li>
          <li>
            <span className="font-semibold text-blue-400">5. Follow Up:</span>
            <br />
            Send a thank-you email after the interview, reiterating your interest and summarizing key points.
          </li>
        </ul>
        <div className="mt-10">
          <a href="/interview" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold shadow-lg transition transform hover:scale-105">
            Back to Interview Room
          </a>
        </div>
      </div>
    </div>
  );
}
