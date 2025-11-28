import React from "react";

export default function LearnMore() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-24 px-4">
      <div className="max-w-3xl w-full text-center mb-16">
        
        <p className="text-lg text-gray-300 mb-8">
          Discover how our platform can help you ace your next interview with confidence. We combine advanced AI, expert content, and a supportive community to give you the edge you need.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-10 max-w-4xl w-full mb-24">
        <div className="bg-white/10 border border-gray-700 rounded-3xl p-8 shadow-xl flex flex-col items-center text-center">
          <h3 className="text-2xl font-bold mb-2 text-white drop-shadow-lg">Personalized Practice</h3>
          <p className="text-gray-300 text-base">Get mock interviews tailored to your role, experience, and goals. Practice technical, HR, and behavioral questions with instant feedback.</p>
        </div>
        <div className="bg-white/10 border border-gray-700 rounded-3xl p-8 shadow-xl flex flex-col items-center text-center">
          <h3 className="text-2xl font-bold mb-2 text-white drop-shadow-lg">AI-Powered Feedback</h3>
          <p className="text-gray-300 text-base">Receive actionable insights on your answers, communication, and confidence. Our AI helps you improve with every session.</p>
        </div>
        <div className="bg-white/10 border border-gray-700 rounded-3xl p-8 shadow-xl flex flex-col items-center text-center">
          <h3 className="text-2xl font-bold mb-2 text-white drop-shadow-lg">Progress Tracking</h3>
          <p className="text-gray-300 text-base">Visualize your growth with detailed analytics, charts, and performance reports. Set goals and celebrate your achievements.</p>
        </div>
        <div className="bg-white/10 border border-gray-700 rounded-3xl p-8 shadow-xl flex flex-col items-center text-center">
          <h3 className="text-2xl font-bold mb-2 text-white drop-shadow-lg">Community & Support</h3>
          <p className="text-gray-300 text-base">Join a community of learners, share experiences, and get tips from experts. Our support team is here to help you succeed.</p>
        </div>
      </div>
      <div className="w-full flex flex-col items-center mt-16">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl px-10 py-8 shadow-2xl flex flex-col items-center">
          <h3 className="text-2xl font-bold text-white mb-2">Ready to get started?</h3>
          <p className="text-gray-200 mb-4">Sign up now and unlock all features for free!</p>
          <a
            href="/interview"
            className="px-8 py-3 bg-black/80 hover:bg-black rounded-xl font-semibold text-blue-200 shadow-lg transition transform hover:scale-105 cursor-pointer"
          >
            Start Practicing
          </a>
        </div>
      </div>
    </div>
  );
}
