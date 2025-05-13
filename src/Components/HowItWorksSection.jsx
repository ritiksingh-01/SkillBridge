import React from "react";
import { Search, Calendar, Award, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const HowItWorksSection = () => {
  // Define the steps for how the platform works
  const steps = [
    {
      id: 1,
      icon: <Search className="w-10 h-10 text-blue-600" />,
      title: "Find Your Perfect Match",
      description: "Browse our curated network of vetted mentors from top companies and filter by industry, expertise, and availability.",
      hasArrow: true
    },
    {
      id: 2,
      icon: <Calendar className="w-10 h-10 text-blue-600" />,
      title: "Schedule Sessions",
      description: "Book one-on-one mentorship sessions that fit your calendar and connect via our secure video platform or messaging.",
      hasArrow: true
    },
    {
      id: 3,
      icon: <Award className="w-10 h-10 text-blue-600" />,
      title: "Grow & Achieve",
      description: "Track your progress, complete action items, and reach your professional goals with structured guidance.",
      hasArrow: false
    }
  ];

  return (
      <div className="w-full px-6 md:px-16 lg:px-24 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 bg-blue-100 rounded-full mb-4">
              <span className="text-blue-700 text-sm font-medium">Simple Process</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How SkillBridge Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our streamlined process makes it easy to find the perfect mentor and start growing professionally</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Search className="w-8 h-8 text-blue-600" />, 
                title: "Find Your Mentor", 
                description: "Browse our curated network of industry experts, filter by specialty, and find the perfect match for your goals.",
                color: "from-blue-500 to-blue-600",
                delay: 0.1
              },
              { 
                icon: <Calendar className="w-8 h-8 text-indigo-600" />, 
                title: "Schedule Sessions", 
                description: "Book one-on-one video sessions at times that work for you, with smart calendar integration.",
                color: "from-indigo-500 to-indigo-600",
                delay: 0.3
              },
              { 
                icon: <Award className="w-8 h-8 text-purple-600" />, 
                title: "Grow & Succeed", 
                description: "Receive personalized guidance, actionable feedback, and track your progress toward your career goals.",
                color: "from-purple-500 to-purple-600",
                delay: 0.5
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 relative overflow-hidden group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: step.delay }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className={`absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-gradient-to-r ${step.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className="mb-6 w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center shadow-md">
                    {step.icon}
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 font-bold text-sm">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6">{step.description}</p>
                  
                  <motion.div 
                    className="inline-flex items-center text-blue-600 font-medium cursor-pointer"
                    whileHover={{ x: 5 }}
                  >
                    Learn more <ArrowRight className="w-4 h-4 ml-2" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default HowItWorksSection;