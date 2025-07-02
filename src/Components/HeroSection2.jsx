import React, { useState, useEffect, useRef } from "react";
import { 
  Star,  
  ArrowRight, 
  Calendar, 
  Users, 
} from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import Image1 from '../assets/1.jpg'; 
import { motion } from "framer-motion";

const HeroSection2 = () => {
  const heroRef = useRef();
  const [isHeroInView, setIsHeroInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeroInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  const navigate = useNavigate();

  function handleFindMentor() {
    navigate('/findMentorPage');
  }

  function handleClick() {
    navigate('/becomeMentor');
  }

  return (
    <div ref={heroRef} className="w-full px-6 md:px-16 lg:px-24 py-16 md:py-24 bg-gradient-to-br from-white via-gray-50 to-blue-50 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        <motion.div 
          className="w-full md:w-1/2"
          initial={{ opacity: 0, x: -50 }}
          animate={isHeroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="inline-block px-4 py-1.5 bg-blue-100 rounded-full mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-blue-700 text-sm font-medium">Learn from the best in your field</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Accelerate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Professional Growth</span> With Expert Mentorship
          </h1>
          
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Connect with experienced industry leaders who can help you navigate career challenges, develop in-demand skills, and unlock new opportunities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <motion.button 
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleFindMentor}
            >
              Find Your Mentor <ArrowRight className="w-5 h-5" />
            </motion.button>
            
            <motion.button 
              className="px-8 py-3.5 bg-white text-gray-800 font-medium rounded-xl border border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-50"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClick}
            >
              Become a Mentor
            </motion.button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex -space-x-4">
              <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="User  " className="w-10 h-10 rounded-full border-2 border-white" />
              <img src="https://randomuser.me/api/portraits/men/43.jpg" alt="User   " className="w-10 h-10 rounded-full border-2 border-white" />
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User   " className="w-10 h-10 rounded-full border-2 border-white" />
              <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-xs">+2k</div>
            </div>
            <div className="text-gray-600">
              <span className="font-bold text-gray-900">2,000+</span> professionals already growing with us
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="w-full md:w-1/2 h-96 flex items-center justify-center" // Added flex properties
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isHeroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="relative w-full h-full">
            <div className="absolute inset-0 rounded-full overflow-hidden border-8 border-white shadow-xl">
              <img 
                src={Image1} 
                alt="Mentor Image" 
                className="w-full h-full object-cover rounded-full" 
              />
            </div>
            
            <motion.div 
              className="absolute top-10 left-0 bg-white p-4 rounded-xl shadow-lg flex items-center gap-3"
              initial={{ y: 20, opacity: 0 }}
              animate={isHeroInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Active Mentors</div>
                <div className="font-bold">5,000+</div>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute bottom-10 right-0 bg-white p-4 rounded-xl shadow-lg flex items-center gap-3"
              initial={{ y: 20, opacity: 0 }}
              animate={isHeroInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ delay: 1.1 }}
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Satisfaction Rate</div>
                <div className="font-bold">97%</div>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute bottom-20 left-10 bg-white p-4 rounded-xl shadow-lg flex items-center gap-3"
              initial={{ y: 20, opacity: 0 }}
              animate={isHeroInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ delay: 1.3 }}
            >
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Sessions Completed</div>
                <div className="font-bold">150,000+</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection2;