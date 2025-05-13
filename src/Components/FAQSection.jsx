import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion"; // Added for animations

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  
  // FAQ data
  const faqs = [
    {
      id: 1,
      question: "How does the mentorship matching process work?",
      answer: "Our AI-powered matching algorithm considers your goals, skills you want to develop, industry, experience level, and personal preferences. We then suggest mentors who are best suited to your needs. You can browse mentor profiles, read reviews, and book sessions with your preferred mentor. All our mentors are carefully vetted for their expertise and commitment to helping others grow."
    },
    {
      id: 2,
      question: "What is the typical cost of mentorship sessions?",
      answer: "Pricing varies based on the mentor's experience level and expertise. Sessions typically range from $50-$200 per hour, with most falling in the $75-$120 range. Many mentors offer package deals for multiple sessions at discounted rates. You can filter mentors by price range to find options that fit your budget. We believe in providing value, and our satisfaction guarantee ensures you get quality guidance."
    },
    {
      id: 3,
      question: "How long does a typical mentorship relationship last?",
      answer: "The duration varies based on your goals. Some mentees benefit from just 1-3 sessions focused on specific challenges, while others maintain long-term relationships spanning months or even years. Most successful mentorships involve at least 4-6 sessions to build rapport and make meaningful progress. You're in control of scheduling and can adjust the frequency or discontinue at any time."
    },
    {
      id: 4,
      question: "What happens if I'm not satisfied with my mentor match?",
      answer: "Your satisfaction is our priority. If you feel your mentor isn't the right fit after your first session, simply let us know and we'll provide a full refund or rematch you with a different mentor at no additional cost. We have a 98% satisfaction rate with our initial matches, but we understand that personal connection is important in a mentoring relationship."
    },
    {
      id: 5,
      question: "Can I become a mentor on SkillBridge?",
      answer: "Yes! We're always looking for qualified mentors to join our platform. You'll need to have at least 5 years of professional experience in your field and pass our vetting process. Mentors on SkillBridge benefit from our matching algorithm, payment processing, scheduling tools, and marketing to potential mentees. Apply through our 'Become a Mentor' page, and our team will review your application."
    },
    {
      id: 6,
      question: "How are the mentoring sessions conducted?",
      answer: "Sessions take place through our secure video conferencing platform built directly into SkillBridge. You can also use our messaging system for quick questions between sessions. Our platform includes collaborative tools like screen sharing, document sharing, and a digital whiteboard to enhance your mentoring experience. All sessions can be recorded for your future reference, with the consent of both parties."
    }
  ];
  
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <div className="w-full px-6 md:px-16 lg:px-24 py-20 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            className="inline-flex items-center px-3 py-1 bg-blue-100 rounded-full mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <span className="text-blue-700 text-sm font-medium">Common Questions</span>
          </motion.div>
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Frequently Asked Questions
          </motion.h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-5">
              {faqs.map((faq, index) => (
                <div 
                  key={faq.id}
                  className={`bg-white rounded-xl overflow-hidden border transition-all ${
                    openIndex === index ? "border-blue-300 shadow-md" : "border-gray-200"
                  }`}
                >
                  <button
                    className="w-full flex justify-between items-center p-7 text-left focus:outline-none cursor-pointer"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span className="font-semibold text-gray-800">{faq.question}</span>
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-blue-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-7 pt-0 text-gray-600">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">Still have questions?</p>
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-colors inline-flex items-center gap-2 cursor-pointer">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;