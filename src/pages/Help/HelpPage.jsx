import React, { useState } from 'react';
import { 
  Search, 
  MessageCircle, 
  Mail, 
  Phone, 
  Book, 
  Video,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqCategories = [
    {
      title: 'Getting Started',
      faqs: [
        {
          question: 'How do I create an account?',
          answer: 'You can create an account by clicking the "Sign Up" button and choosing whether you want to be a mentor or mentee. Fill in your basic information and verify your email address.'
        },
        {
          question: 'What\'s the difference between mentor and mentee accounts?',
          answer: 'Mentors offer guidance and expertise to help others grow professionally. Mentees seek guidance and learning opportunities from experienced professionals.'
        },
        {
          question: 'How do I complete my profile?',
          answer: 'Go to your profile page and fill in all sections including your bio, skills, experience, and profile picture. A complete profile helps with better matching.'
        }
      ]
    },
    {
      title: 'Booking Sessions',
      faqs: [
        {
          question: 'How do I book a session with a mentor?',
          answer: 'Browse mentors, view their profiles, and click "Book Session". Choose your preferred time slot and complete the payment process.'
        },
        {
          question: 'Can I reschedule a session?',
          answer: 'Yes, you can reschedule sessions up to 24 hours before the scheduled time. Go to your sessions page and click "Reschedule".'
        },
        {
          question: 'What happens if a mentor cancels?',
          answer: 'If a mentor cancels, you\'ll receive a full refund and be notified immediately. We\'ll also help you find an alternative mentor if needed.'
        }
      ]
    },
    {
      title: 'Payments & Billing',
      faqs: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards, debit cards, and PayPal. All payments are processed securely through Stripe.'
        },
        {
          question: 'How do refunds work?',
          answer: 'Refunds are processed within 5-7 business days. You can request a refund up to 24 hours before a session or if a mentor cancels.'
        },
        {
          question: 'Do you offer any discounts?',
          answer: 'We offer student discounts and bulk session packages. Contact support for more information about available discounts.'
        }
      ]
    }
  ];

  const resources = [
    {
      title: 'Video Tutorials',
      description: 'Step-by-step guides to help you get the most out of SkillBridge',
      icon: Video,
      link: '#'
    },
    {
      title: 'User Guide',
      description: 'Comprehensive documentation covering all features',
      icon: Book,
      link: '#'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users and share experiences',
      icon: MessageCircle,
      link: '#'
    }
  ];

  const contactOptions = [
    {
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      icon: MessageCircle,
      action: 'Start Chat',
      available: true
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message and we\'ll respond within 24 hours',
      icon: Mail,
      action: 'Send Email',
      available: true
    },
    {
      title: 'Phone Support',
      description: 'Speak directly with our support team',
      icon: Phone,
      action: 'Call Now',
      available: false,
      note: 'Available Mon-Fri, 9AM-6PM EST'
    }
  ];

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help you?</h1>
        <p className="text-xl text-gray-600 mb-8">
          Find answers to common questions or get in touch with our support team
        </p>
        
        {/* Search */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FAQ Section */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No results found. Try a different search term.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredFaqs.map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.title}</h3>
                    <div className="space-y-4">
                      {category.faqs.map((faq, faqIndex) => {
                        const faqId = `${categoryIndex}-${faqIndex}`;
                        const isExpanded = expandedFaq === faqId;
                        
                        return (
                          <div key={faqIndex} className="border border-gray-200 rounded-lg">
                            <button
                              onClick={() => setExpandedFaq(isExpanded ? null : faqId)}
                              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                            >
                              <span className="font-medium text-gray-900">{faq.question}</span>
                              {isExpanded ? (
                                <ChevronDown className="w-5 h-5 text-gray-500" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-gray-500" />
                              )}
                            </button>
                            {isExpanded && (
                              <div className="px-4 pb-4">
                                <p className="text-gray-700">{faq.answer}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Contact Support */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Support</h3>
            <div className="space-y-4">
              {contactOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{option.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                      {option.available ? (
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          {option.action}
                        </button>
                      ) : (
                        <p className="text-xs text-gray-500">{option.note}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resources */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Helpful Resources</h3>
            <div className="space-y-4">
              {resources.map((resource, index) => {
                const Icon = resource.icon;
                return (
                  <a
                    key={index}
                    href={resource.link}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{resource.title}</h4>
                      <p className="text-sm text-gray-600">{resource.description}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">
                Platform Status
              </a>
              <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">
                Terms of Service
              </a>
              <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">
                Privacy Policy
              </a>
              <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm">
                Community Guidelines
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;