import React from "react";
import { Search, Calendar, Award, ArrowRight } from "lucide-react";

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
    <section className="py-16 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 bg-blue-100 rounded-full mb-4">
            <span className="text-blue-600 text-sm font-medium">Simple Process</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How SkillBridge Works
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Simple steps to connect with industry experts and accelerate your professional growth
          </p>
        </div>

        <div className="relative">
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.id} className="relative group">
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 h-full flex flex-col items-center text-center transform group-hover:-translate-y-2">
                  <div className="bg-blue-100 p-4 rounded-full mb-6">
                    {step.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
                
                {step.hasArrow && (
                  <div className="hidden md:flex absolute top-1/2 -right-8 transform -translate-y-1/2 z-10 justify-center items-center">
                    <ArrowRight className="w-8 h-8 text-blue-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center mx-auto space-x-2 group">
            <span>Start Your Journey</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;