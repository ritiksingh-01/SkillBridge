import React, { useState, useEffect } from "react";
import Footer from "../Components/Footer";
import { 
  Star, 
  CheckCircle, 
  ArrowRight, 
  Calendar, 
  Briefcase, 
  Users, 
  Search, 
  BookOpen, 
  Award, 
  Globe, 
  Play,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Zap,
  BarChart,
  PanelLeft,
  GraduationCap,
  Tag
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CategoryCard from "../Components/CategoryCard";
import TestimonialSlider from "../Components/TestimonialSlider";
import FAQSection from "../Components/FAQSection";
import NewsletterSignup from "../Components/NewsletterSignup";
import HowItWorksSection from "../Components/HowItWorksSection";
import PopularMentorsSection from "../Components/PopularMentorsSection";
import HeroSection from "../Components/HeroSection";
import { ProfessionalImpactBanner } from "../Banners/ProfessionalImpactBanner";

const HomePage = () => {
  const navigate = useNavigate();
  const [activeSkillCategory, setActiveSkillCategory] = useState("Technology");
  function handleLoginPage(){
    navigate('/login');
  }
  
  function handleSignUpPage(){
    navigate('/signUp');
  }
  
  // Simulated data for skill domain categories
  const skillCategories = [
    { id: 1, name: "Technology", count: 1240 },
    { id: 2, name: "Business", count: 850 },
    { id: 3, name: "Design", count: 620 },
    { id: 4, name: "Marketing", count: 510 },
    { id: 5, name: "Finance", count: 480 },
    { id: 6, name: "Leadership", count: 390 }
  ];
  // Sample success statistics 
  const successStats = [
    { id: 1, value: "78%", label: "Career Growth", description: "of mentees reported significant career advancement within 6 months" },
    { id: 2, value: "92%", label: "Skill Improvement", description: "of users reported meaningful skill improvement after just 4 sessions" },
    { id: 3, value: "3.5×", label: "ROI", description: "average return on investment reported by our mentees in terms of salary growth" }
  ];

  return (
    <div className="w-full min-h-screen bg-white flex flex-col justify-start items-start">
      {/* Navigation Bar - More Professional */}
      <div className="w-full px-6 md:px-16 lg:px-24 py-4 bg-white shadow-sm sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 relative overflow-hidden rounded-md bg-gradient-to-r from-blue-600 to-indigo-700">
            <div className="w-6 h-6 absolute inset-1 bg-white rotate-45 transform translate-x-3"></div>
          </div>
          <div className="text-gray-800 text-xl font-bold">
            Skill<span className="text-blue-600">Bridge</span>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-8">
          <div className="text-gray-700 font-medium hover:text-blue-600 transition-colors cursor-pointer">Home</div>
          <div className="text-gray-700 font-medium hover:text-blue-600 transition-colors cursor-pointer">Find Mentors</div>
          <div className="text-gray-700 font-medium hover:text-blue-600 transition-colors cursor-pointer">About Us</div>
          <div className="text-gray-700 font-medium hover:text-blue-600 transition-colors cursor-pointer">Contact Us</div>
          {/* <div className="text-gray-700 font-medium hover:text-blue-600 transition-colors cursor-pointer">Enterprise</div> */}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="px-5 py-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg cursor-pointer">
            <div className="text-gray-700 font-medium" onClick={handleLoginPage}>Login</div>
          </div>
          <div className="px-5 py-2 bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg cursor-pointer shadow-md shadow-blue-200">
            <div className="text-white font-medium" onClick={handleSignUpPage}>Sign Up</div>
          </div>
        </div>
      </div>
      {/* Hero Section - Modern & Professional */}
      <HeroSection/>

      {/* NEW: Video Introduction Section */}
      <div className="w-full px-6 md:px-16 lg:px-24 py-20 bg-gray-50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="w-full md:w-1/2">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video">
              {/* This would be a video thumbnail in a real implementation */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/80 to-indigo-900/60 flex items-center justify-center">
                <div className="absolute z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center cursor-pointer transform transition-transform hover:scale-110">
                  <Play className="w-8 h-8 text-blue-600 ml-1" />
                </div>
              </div>
              <img src="/api/placeholder/640/360" alt="Video thumbnail" className="w-full h-full object-cover" />
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <div className="inline-flex items-center px-3 py-1 bg-blue-100 rounded-full mb-4">
              <span className="text-blue-700 text-sm font-medium">Our Story</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">See How SkillBridge Is Transforming Careers</h2>
            <p className="text-gray-600 mb-6">
              Watch how our platform connects ambitious professionals with world-class mentors to accelerate career growth and develop essential skills for today's competitive job market.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-gray-700">Hear success stories directly from our mentees</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-gray-700">Learn how our matching algorithm works</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-gray-700">See our platform's features in action</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* How It Works Section */}
      <HowItWorksSection />

      {/* NEW: Success Metrics Section */}
      <div className="w-full px-6 md:px-16 lg:px-24 py-20 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-3 py-1 bg-blue-800/50 rounded-full mb-4">
              <span className="text-blue-200 text-sm font-medium">Proven Results</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">Our Impact By The Numbers</h2>
            <p className="text-blue-200 max-w-2xl mx-auto">Real results that demonstrate the transformative power of expert mentorship</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStats.map((stat) => (
              <div key={stat.id} className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:bg-white/15 transition-all">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-xl font-semibold text-blue-200 mb-3">{stat.label}</div>
                <p className="text-blue-100">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NEW: Skill Categories Section */}
      <div className="w-full px-6 md:px-16 lg:px-24 py-20 bg-white">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 bg-blue-100 rounded-full mb-4">
            <span className="text-blue-700 text-sm font-medium">Explore By Domain</span>
          </div>
          <h2 className="text-3xl font-bold mb-2">Find Mentors In Your Field</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Browse our extensive network of verified mentors across diverse professional domains</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {skillCategories.map((category) => (
            <button 
              key={category.id}
              className={`px-5 py-2 rounded-full flex items-center gap-2 transition-all ${
                activeSkillCategory === category.name 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveSkillCategory(category.name)}
            >
              <span>{category.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">{category.count}</span>
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* This would be dynamically populated based on the selected category */}
          <CategoryCard 
            icon={<PanelLeft className="w-5 h-5 text-blue-600" />}
            title="Software Development"
            mentorsCount="720+ mentors"
            color="bg-blue-50"
          />
          <CategoryCard 
            icon={<BarChart className="w-5 h-5 text-purple-600" />}
            title="Data Science & Analytics"
            mentorsCount="340+ mentors"
            color="bg-purple-50"
          />
          <CategoryCard 
            icon={<Zap className="w-5 h-5 text-yellow-600" />}
            title="Product Management"
            mentorsCount="280+ mentors"
            color="bg-yellow-50"
          />
          <CategoryCard 
            icon={<MessageCircle className="w-5 h-5 text-green-600" />}
            title="UX/UI Design"
            mentorsCount="210+ mentors"
            color="bg-green-50"
          />
          <CategoryCard 
            icon={<GraduationCap className="w-5 h-5 text-indigo-600" />}
            title="AI & Machine Learning"
            mentorsCount="180+ mentors"
            color="bg-indigo-50"
          />
          <CategoryCard 
            icon={<Briefcase className="w-5 h-5 text-red-600" />}
            title="Leadership & Management"
            mentorsCount="310+ mentors"
            color="bg-red-50"
          />
          <CategoryCard 
            icon={<Globe className="w-5 h-5 text-teal-600" />}
            title="Digital Marketing"
            mentorsCount="240+ mentors"
            color="bg-teal-50"
          />
          <CategoryCard 
            icon={<Tag className="w-5 h-5 text-orange-600" />}
            title="Explore All Categories"
            mentorsCount="5000+ mentors"
            color="bg-orange-50"
            isSpecial={true}
          />
        </div>
      </div>

      {/* Popular Mentors Section */}

      <PopularMentorsSection/>

      <ProfessionalImpactBanner/>
      {/* Testimonials Section */}
      <div className="w-full px-6 md:px-16 lg:px-24 py-10 mb-10 bg-gray-50">
        <TestimonialSlider />
      </div>

      {/* CTA Section - Become a Mentor */}



      {/* FAQ Section */}
      <div className="w-full px-6 md:px-16 lg:px-24 py-20 bg-gray-50">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 bg-blue-100 rounded-full mb-4">
            <span className="text-blue-700 text-sm font-medium">Common Questions</span>
          </div>
          <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Find answers to the most common questions about our mentorship platform</p>
        </div>
        
        <FAQSection />
      </div>

      {/* Newsletter Section */}
      <div className="w-full px-6 md:px-16 lg:px-24 py-20 bg-white">
        <NewsletterSignup />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;