import React, { useState, useEffect, useRef } from "react";
import {  
  CheckCircle, 
  ArrowRight, 
  Calendar, 
  Briefcase, 
  Search,  
  Award, 
  Globe, 
  Play,
  MessageCircle,
  Zap,
  BarChart,
  PanelLeft,
  GraduationCap,
  Tag,
  Menu,
  X,
  ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Float, PresentationControls, Environment } from "@react-three/drei";
import HeroSection from "../../Components/HeroSection";
import PopularMentorsSection from "../../Components/PopularMentorsSection";
import TestimonialSlider from "../../Components/TestimonialSlider";
import FAQSection from "../../Components/FAQSection";
import NewsletterSignup from "../../Components/NewsletterSignup";
import LogoCarousel from "../../Components/LogoCarousel";
import HowItWorksSection from "../../Components/HowItWorksSection";
import Footer from "../../Components/Footer";

// Animated 3D Model Component
const Model3D = () => {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <PresentationControls 
        global 
        zoom={0.8} 
        rotation={[0, -Math.PI / 4, 0]} 
        polar={[-Math.PI / 4, Math.PI / 4]} 
        azimuth={[-Math.PI / 4, Math.PI / 4]}
      >
        <Float rotationIntensity={0.4}>
          <mesh>
            <torusKnotGeometry args={[1.4, 0.5, 128, 32]} />
            <meshPhongMaterial color="#3B82F6" shininess={100} />
          </mesh>
        </Float>
      </PresentationControls>
      <Environment preset="city" />
    </Canvas>
  );
};

// Modern Category Card with Hover Effects
const ModernCategoryCard = ({ icon, title, mentorsCount, color, isSpecial }) => {
  return (
    <motion.div 
      className={`relative overflow-hidden rounded-xl p-6 ${color} group cursor-pointer`}
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700" />
      
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-white shadow-md">
          {icon}
        </div>
        
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{mentorsCount}</p>
        
        {isSpecial ? (
          <motion.div 
            className="flex items-center gap-2 text-blue-600 font-medium"
            whileHover={{ x: 5 }}
          >
            Explore all <ArrowRight className="w-4 h-4" />
          </motion.div>
        ) : (
          <motion.div 
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md cursor-pointer"
            whileHover={{ x: 5 }}
          >
            <ArrowRight className="w-4 h-4 text-blue-600" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Animated Stat Card Component
const StatCard = ({ value, label, description }) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <motion.div 
      ref={ref}
      className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="text-5xl font-bold text-white mb-2"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {value}
      </motion.div>
      <div className="text-xl font-semibold text-blue-200 mb-3">{label}</div>
      <p className="text-blue-100">{description}</p>
    </motion.div>
  );
};

// Main HomePage Component
const HomePage = () => {
  const navigate = useNavigate();
  const [activeSkillCategory, setActiveSkillCategory] = useState("Technology");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Animation references
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

  function handleLoginPage() {
    navigate('/login');
  }
  
  function handleSignUpPage() {
    navigate('/signUp');
  }
  function handleFindMentor(){
    navigate('/findMentorPage')
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
    <div className="w-full min-h-screen bg-gray-50 flex flex-col justify-start items-start font-sans">
      {/* Modern Glass-effect Navigation */}
      <motion.div 
        className="w-full px-6 md:px-16 lg:px-24 py-5 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 flex justify-between items-center"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700">
            <motion.div 
              className="w-6 h-6 absolute inset-1 bg-white"
              initial={{ rotate: 0 }}
              animate={{ rotate: 45 }}
              transition={{ duration: 0.6 }}
            ></motion.div>
          </div>
          <div className="text-gray-800 text-xl font-bold tracking-tight">
            Skill<span className="text-blue-600">Bridge</span>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-10">
          <motion.div 
            className="text-gray-700 font-medium hover:text-blue-600 transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            Home
          </motion.div>
          <motion.div 
            className="text-gray-700 font-medium hover:text-blue-600 transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={handleFindMentor}
          >
            Find Mentors
          </motion.div>
          <motion.div 
            className="text-gray-700 font-medium hover:text-blue-600 transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            About Us
          </motion.div>
          <motion.div 
            className="text-gray-700 font-medium hover:text-blue-600 transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            Contact
          </motion.div>
        </div>
        
        <div className="flex items-center gap-4">
          <motion.div 
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 transition-colors rounded-xl cursor-pointer hidden md:block"
            whileHover={{ scale: 1.05 }}
            onClick={handleLoginPage}
          >
            <div className="text-gray-700 font-medium">Login</div>
          </motion.div>
          <motion.div 
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-colors rounded-xl cursor-pointer shadow-lg shadow-blue-200/50 hidden md:block"
            whileHover={{ scale: 1.05 }}
            onClick={handleSignUpPage}
          >
            <div className="text-white font-medium">Sign Up</div>
          </motion.div>
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </div>
        </div>
      </motion.div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          className="fixed inset-0 bg-white z-40 pt-20 px-6 lg:hidden overflow-y-auto"
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col gap-6">
            <div className="text-gray-800 font-medium py-3 border-b cursor-pointer">Home</div>
            <div className="text-gray-800 font-medium py-3 border-b cursor-pointer" onClick={handleFindMentor}>Find Mentors</div>
            <div className="text-gray-800 font-medium py-3 border-b cursor-pointer">About Us</div>
            <div className="text-gray-800 font-medium py-3 border-b cursor-pointer">Resources</div>
            <div className="text-gray-800 font-medium py-3 border-b cursor-pointer">Contact</div>
            <div className="flex gap-4 mt-4">
              <div 
                className="w-1/2 px-5 py-3 bg-gray-100 text-center rounded-xl cursor-pointer"
                onClick={handleLoginPage}
              >
                <div className="text-gray-700 font-medium">Login</div>
              </div>
              <div 
                className="w-1/2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-center rounded-xl shadow-lg shadow-blue-200/50 cursor-pointer"
                onClick={handleSignUpPage}
              >
                <div className="text-white font-medium">Sign Up</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Enhanced Hero Section with 3D Element and Animation */}
      <HeroSection/>

      {/* Trusted By Section */}
      <LogoCarousel/> 

      {/* Enhanced Video Introduction Section */}
      <div className="w-full px-6 md:px-16 lg:px-24 py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <motion.div 
              className="w-full md:w-1/2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/80 to-indigo-900/60 flex items-center justify-center">
                  <motion.div 
                    className="absolute z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-xl shadow-blue-900/30"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Play className="w-8 h-8 text-blue-600 ml-1" />
                  </motion.div>
                </div>
                <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=640&q=80" alt="Video thumbnail" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
              </div>
            </motion.div>
            
            <motion.div 
              className="w-full md:w-1/2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="inline-flex items-center px-3 py-1 bg-blue-100 rounded-full mb-4">
                <span className="text-blue-700 text-sm font-medium">Our Story</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">See How SkillBridge Is Transforming Careers</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Watch how our platform connects ambitious professionals with world-class mentors to accelerate career growth and develop essential skills for today's competitive job market.
              </p>
              <ul className="space-y-4">
                <motion.li 
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Hear success stories directly from our mentees</span>
                </motion.li>
                <motion.li 
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Learn how our AI-powered matching algorithm works</span>
                </motion.li>
                <motion.li 
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">See our platform's interactive features in action</span>
                </motion.li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* How It Works Section - Modern Cards with Illustrations */}
      <HowItWorksSection/>

      {/* Success Metrics Section - Enhanced with Animations */}
      <div className="w-full px-6 md:px-16 lg:px-24 py-24 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 text-white relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-blue-500 filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-indigo-500 filter blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.div 
              className="inline-flex items-center px-3 py-1 bg-blue-800/50 rounded-full mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <span className="text-blue-200 text-sm font-medium">Proven Results</span>
            </motion.div>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Our Impact By The Numbers
            </motion.h2>
            <motion.p 
              className="text-blue-200 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Real results that demonstrate the transformative power of expert mentorship
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStats.map((stat, index) => (
              <StatCard 
                key={stat.id} 
                value={stat.value} 
                label={stat.label} 
                description={stat.description} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Skill Categories Section - Enhanced UI */}
      <div className="w-full px-6 md:px-16 lg:px-24 py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.div 
              className="inline-flex items-center px-3 py-1 bg-blue-100 rounded-full mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <span className="text-blue-700 text-sm font-medium">Explore By Domain</span>
            </motion.div>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Find Mentors In Your Field
            </motion.h2>
            <motion.p 
              className="text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Browse our extensive network of verified mentors across diverse professional domains
            </motion.p>
          </div>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {skillCategories.map((category) => (
              <motion.button 
                key={category.id}
                className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all ${
                  activeSkillCategory === category.name 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200/50" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveSkillCategory(category.name)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-medium">{category.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeSkillCategory === category.name 
                    ? "bg-white/20" 
                    : "bg-gray-200"
                }`}>{category.count}</span>
              </motion.button>
            ))}
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <ModernCategoryCard 
              icon={<PanelLeft className="w-5 h-5 text-blue-600" />}
              title="Software Development"
              mentorsCount="720+ mentors"
              color="bg-blue-50"
            />
            <ModernCategoryCard 
              icon={<BarChart className="w-5 h-5 text-purple-600" />}
              title="Data Science & Analytics"
              mentorsCount="340+ mentors"
              color="bg-purple-50"
            />
            <ModernCategoryCard 
              icon={<Zap className="w-5 h-5 text-yellow-600" />}
              title="Product Management"
              mentorsCount="280+ mentors"
              color="bg-yellow-50"
            />
            <ModernCategoryCard 
              icon={<MessageCircle className="w-5 h-5 text-green-600" />}
              title="UX/UI Design"
              mentorsCount="210+ mentors"
              color="bg-green-50"
            />
            <ModernCategoryCard 
              icon={<GraduationCap className="w-5 h-5 text-indigo-600" />}
              title="AI & Machine Learning"
              mentorsCount="180+ mentors"
              color="bg-indigo-50"
            />
            <ModernCategoryCard 
              icon={<Briefcase className="w-5 h-5 text-red-600" />}
              title="Leadership & Management"
              mentorsCount="310+ mentors"
              color="bg-red-50"
            />
            <ModernCategoryCard 
              icon={<Globe className="w-5 h-5 text-teal-600" />}
              title="Digital Marketing"
              mentorsCount="240+ mentors"
              color="bg-teal-50"
            />
            <ModernCategoryCard 
              icon={<Tag className="w-5 h-5 text-orange-600" />}
              title="Explore All Categories"
              mentorsCount="5000+ mentors"
              color="bg-orange-50"
              isSpecial={true}
            />
          </div>
        </div>
      </div>

      {/* Popular Mentors Section */}
        <PopularMentorsSection/>


      {/* Testimonials Section */}
      <div className="w-full  bg-white">
            <TestimonialSlider/>
      </div>

      {/* FAQ Section - Improved Design */}
      <FAQSection/>

        {/* Newsletter Section */}
      <div className="w-full px-6 md:px-16 lg:px-24 py-20 bg-white">
        <NewsletterSignup />
      </div>

      <Footer/>
    </div>
  );
};

export default HomePage;