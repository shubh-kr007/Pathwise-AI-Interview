import React, { useState } from 'react';
import { HelpCircle, Book, MessageCircle, Video, ChevronDown, ChevronUp, Search } from 'lucide-react';

// 🔹 Popup Component for Contact Support
const ContactSupportPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 text-white rounded-2xl shadow-xl w-96 p-6 relative border border-gray-700">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-lg"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold mb-2 text-center">
          Contact Support
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Our customer care executives are ready to help you.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Call */}
          <button
            onClick={() => (window.location.href = 'tel:+919219234185')}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg transition-all font-medium"
          >
            📞 Call Executive
          </button>

          {/* WhatsApp */}
          <button
            onClick={() => window.open('https://wa.me/919219234185', '_blank')}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg transition-all font-medium"
          >
            💬 Chat on WhatsApp
          </button>

          
        </div>
      </div>
    </div>
  );
};

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('faq');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [isSupportOpen, setIsSupportOpen] = useState(false); // ✅ New state for popup

  const faqs = [
    {
      question: "How do I prepare for an AI interview?",
      answer: "To prepare for an AI interview, review common interview questions in your field, practice speaking clearly, ensure you have a stable internet connection, and find a quiet environment. Our system uses advanced AI to evaluate your responses based on content, clarity, and professional demeanor."
    },
    {
      question: "What types of interviews are available?",
      answer: "We offer various interview types including technical interviews for different programming languages, behavioral interviews, and role-specific interviews for positions like frontend developer, backend developer, full-stack developer, and more."
    },
    {
      question: "How is my interview evaluated?",
      answer: "Your interview is evaluated based on multiple factors including technical accuracy, communication skills, problem-solving ability, and professional conduct. Our AI provides detailed feedback and scoring for each aspect of your responses."
    },
    {
      question: "Can I review my past interviews?",
      answer: "Yes, you can access all your past interviews from your profile dashboard. Each interview includes a detailed breakdown of your performance, feedback, and areas for improvement."
    },
    {
      question: "What if I encounter technical issues during an interview?",
      answer: "If you experience technical issues, you can pause the interview and resume when the issues are resolved. Contact our support team for immediate assistance if needed."
    }
  ];

  const guides = [
    {
      title: "Getting Started Guide",
      description: "Learn how to set up your profile and start your first interview",
      icon: <Book size={24} className="text-blue-400" />
    },
    {
      title: "Interview Best Practices",
      description: "Tips and tricks for succeeding in AI interviews",
      icon: <Video size={24} className="text-purple-400" />
    },
    {
      title: "Technical Requirements",
      description: "Ensure your system is ready for the interview",
      icon: <MessageCircle size={24} className="text-green-400" />
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-white pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            How can we help you?
          </h1>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full pl-10 pr-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={() => setActiveSection('faq')}
            className={`px-5 py-2 rounded-full font-medium transition-colors duration-300 ${
              activeSection === 'faq'
                ? 'bg-blue-600 shadow-lg shadow-blue-500/30 text-white'
                : 'bg-gray-800 hover:bg-gray-700 text-gray-400'
            }`}
          >
            FAQs
          </button>
          <button
            onClick={() => setActiveSection('guides')}
            className={`px-5 py-2 rounded-full font-medium transition-colors duration-300 ${
              activeSection === 'guides'
                ? 'bg-blue-600 shadow-lg shadow-blue-500/30 text-white'
                : 'bg-gray-800 hover:bg-gray-700 text-gray-400'
            }`}
          >
            Guides
          </button>
        </div>

        {/* FAQ Section */}
        {activeSection === 'faq' && (
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700 transition-all hover:border-blue-500"
              >
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800/80 transition-colors"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <span className="font-semibold text-lg">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp size={20} className="text-blue-400" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                </button>
                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ${
                    expandedFaq === index ? 'max-h-60 py-4' : 'max-h-0 py-0'
                  }`}
                >
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Guides Section */}
        {activeSection === 'guides' && (
          <div className="grid gap-6 md:grid-cols-2">
            {guides.map((guide, index) => (
              <div
                key={index}
                className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-700 rounded-lg">
                    {guide.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{guide.title}</h3>
                    <p className="text-gray-400 text-sm">{guide.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact Support Button */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">Still need help?</h2>
          <button
            onClick={() => setIsSupportOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 rounded-full font-medium transition-all shadow-lg shadow-blue-500/30"
          >
            <HelpCircle size={20} />
            Contact Support
          </button>
        </div>
      </div>

      {/* Popup Component */}
      <ContactSupportPopup isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
    </div>
  );
};

export default Help;
