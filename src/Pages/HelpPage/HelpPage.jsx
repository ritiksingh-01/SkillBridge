import React, { useState } from 'react';
import { 
  Search, 
  HelpCircle, 
  BookOpen, 
  MessageSquare, 
  CreditCard, 
  UserCheck, 
  Mail, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle 
} from 'lucide-react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });

  const faqs = [
    {
      category: 'Getting Started',
      question: 'How do I find and choose the right mentor?',
      answer: 'Browse our Mentors directory using the top navigation bar. You can filter by domain expertise, technical skills, and session pricing. Check each mentor’s profile for verified reviews, previous company experience, and ratings from past mentees.'
    },
    {
      category: 'Sessions & Booking',
      question: 'How do session bookings work?',
      answer: 'When you find a mentor, click "Book Session" or "View Profile". Choose your preferred date, duration, and session format (video call or query). Once submitted, the mentor receives an instant notification to confirm or reschedule.'
    },
    {
      category: 'Chat & Video Calls',
      question: 'How do I communicate with my mentor before or during a session?',
      answer: 'SkillBridge includes built-in real-time messaging. Once a session is booked, a dedicated chat room is created where you can exchange goals, meeting links, and documents in real time.'
    },
    {
      category: 'Payments & Billing',
      question: 'Is payment processed securely?',
      answer: 'Yes, all payments are processed securely through Stripe with end-to-end encryption. You can view your completed transactions and receipts anytime on your Dashboard.'
    },
    {
      category: 'Mentorship',
      question: 'How can I become a mentor on SkillBridge?',
      answer: 'Click "Become a Mentor" in the navigation menu and fill out the application form with your experience, domain expertise, and pricing. Once submitted, our team reviews applications to maintain platform quality.'
    }
  ];

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.subject || !contactForm.message) return;
    setContactSubmitted(true);
    setContactForm({ subject: '', message: '' });
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-20">
        {/* Help Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex p-3 bg-blue-100 rounded-full text-blue-600 mb-4">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">How can we help you?</h1>
          <p className="text-gray-600 mt-2">Search our knowledge base or browse common questions below.</p>
          
          <div className="relative mt-6">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search topics (e.g., booking, refund, video call)..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>
        </div>

        {/* Quick Topic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-center">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">Getting Started</h3>
            <p className="text-xs text-gray-500 mt-1">Profile setup & searching</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-center">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">Live Messaging</h3>
            <p className="text-xs text-gray-500 mt-1">Chat & session links</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-center">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">Payments</h3>
            <p className="text-xs text-gray-500 mt-1">Stripe billing & receipts</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-center">
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">Mentors</h3>
            <p className="text-xs text-gray-500 mt-1">Applications & dashboard</p>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="border border-gray-100 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-4 text-left font-medium text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer text-sm"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-blue-600" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>
                    {isOpen && (
                      <div className="p-4 bg-gray-50 text-sm text-gray-600 border-t border-gray-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 text-center py-6">No matching questions found for "{searchTerm}".</p>
            )}
          </div>
        </div>

        {/* Contact Support Form */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
          <div className="max-w-2xl mx-auto text-center mb-6">
            <Mail className="w-8 h-8 mx-auto mb-2 text-blue-200" />
            <h2 className="text-2xl font-bold">Still need help?</h2>
            <p className="text-blue-100 text-sm mt-1">Our support team usually responds within 2-4 hours.</p>
          </div>

          {contactSubmitted ? (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center max-w-md mx-auto">
              <CheckCircle className="w-10 h-10 text-green-300 mx-auto mb-2" />
              <h3 className="font-semibold text-lg">Message Received!</h3>
              <p className="text-sm text-blue-100 mt-1">Thank you for reaching out. We will get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="max-w-md mx-auto space-y-3">
              <input
                type="text"
                placeholder="Subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 text-sm outline-none focus:bg-white/20"
                required
              />
              <textarea
                placeholder="Describe your issue or question..."
                rows={4}
                value={contactForm.message}
                onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 text-sm outline-none focus:bg-white/20"
                required
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-white text-blue-600 font-semibold rounded-lg text-sm hover:bg-blue-50 transition-colors cursor-pointer shadow-md"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HelpPage;

