import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence for smooth exit animations

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
  
  // Animation variants for FAQ items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  // Animation variants for the content of each FAQ
  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    }
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
            className="text-3xl md:text-4xl font-bold mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Frequently Asked Questions
          </motion.h2>
          
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="space-y-5"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {faqs.map((faq, index) => (
                <motion.div 
                  key={faq.id}
                  variants={itemVariants}
                  className={`bg-white rounded-xl overflow-hidden border transition-all duration-300 ${
                    openIndex === index ? "border-blue-300 shadow-md" : "border-gray-200"
                  }`}
                  whileHover={{ 
                    scale: 1.01, 
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                    borderColor: openIndex === index ? "#93c5fd" : "#e5e7eb" 
                  }}
                >
                  <motion.button
                    className="w-full flex justify-between items-center p-7 text-left focus:outline-none cursor-pointer"
                    onClick={() => toggleFAQ(index)}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span className="font-semibold text-gray-800">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {openIndex === index ? (
                        <ChevronUp className="w-5 h-5 text-blue-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </motion.div>
                  </motion.button>
                  
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div 
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={contentVariants}
                      >
                        <div className="p-7 pt-0 text-gray-600">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div 
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true, amount: 0.5 }}
            >
              <p className="text-gray-600 mb-4">Still have questions?</p>
              <motion.button 
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-colors inline-flex items-center gap-2 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Support
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;