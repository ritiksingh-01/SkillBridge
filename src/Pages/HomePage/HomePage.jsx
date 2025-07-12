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
  ChevronDown,
  Star,
  Users,
  TrendingUp,
  BookOpen,
  Target,
  Shield,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { useAuth } from "../../context/AuthContext";

// Enhanced Hero Section Component
const EnhancedHeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: "Accelerate Your Career",
      subtitle: "With Expert Mentorship",
      description: "Connect with industry leaders and unlock your potential through personalized guidance",
      cta: "Find Your Mentor",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Share Your Expertise",
      subtitle: "Become a Mentor",
      description: "Guide the next generation of professionals and build your personal brand",
      cta: "Start Mentoring",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleCTA = () => {
    if (currentSlide === 0) {
      navigate('/findMentorPage');
    } else {
      navigate('/becomeMentor');
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
          {/* Left Content */}
          <motion.div 
            className="text-white space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-4">
              <motion.div 
                className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
                <span className="text-sm font-medium">Trusted by 50,000+ professionals</span>
              </motion.div>

              <motion.h1 
                className="text-5xl lg:text-7xl font-bold leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {heroSlides[currentSlide].title}
                <br />
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  {heroSlides[currentSlide].subtitle}
                </span>
              </motion.h1>

              <motion.p 
                className="text-xl text-blue-100 leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {heroSlides[currentSlide].description}
              </motion.p>
            </div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button 
                onClick={handleCTA}
                className="group px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-xl hover:shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                <span>{heroSlides[currentSlide].cta}</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center">
                <Play className="w-5 h-5 mr-2" />
                <span>Watch Demo</span>
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-8 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { number: "50K+", label: "Active Users" },
                { number: "5K+", label: "Expert Mentors" },
                { number: "98%", label: "Success Rate" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-white">{stat.number}</div>
                  <div className="text-blue-200 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-3xl blur-xl"></div>
              <img 
                src={heroSlides[currentSlide].image}
                alt="Hero"
                className="relative z-10 w-full h-[500px] object-cover rounded-3xl shadow-2xl"
              />
              
              {/* Floating Cards */}
              <motion.div 
                className="absolute -top-4 -left-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Session Completed</div>
                    <div className="text-sm text-gray-600">with Sarah Johnson</div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">4.9/5 Rating</div>
                    <div className="text-sm text-gray-600">from 1,200+ reviews</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center space-x-2 mt-12">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-yellow-400 w-8' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Enhanced Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Mentors",
      description: "Connect with industry leaders from top companies worldwide",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Flexible Scheduling",
      description: "Book sessions that fit your schedule with real-time availability",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Platform",
      description: "Enterprise-grade security with encrypted communications",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Track Progress",
      description: "Monitor your growth with detailed analytics and insights",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Choose SkillBridge?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide everything you need to accelerate your career growth through meaningful mentorship connections
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative p-8 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Enhanced Categories Section
const CategoriesSection = () => {
  const categories = [
    { name: "Technology", count: "2,500+", icon: <PanelLeft className="w-6 h-6" />, color: "bg-blue-500" },
    { name: "Business", count: "1,800+", icon: <Briefcase className="w-6 h-6" />, color: "bg-green-500" },
    { name: "Design", count: "1,200+", icon: <Tag className="w-6 h-6" />, color: "bg-purple-500" },
    { name: "Marketing", count: "900+", icon: <BarChart className="w-6 h-6" />, color: "bg-orange-500" },
    { name: "Data Science", count: "800+", icon: <Zap className="w-6 h-6" />, color: "bg-red-500" },
    { name: "Leadership", count: "600+", icon: <Award className="w-6 h-6" />, color: "bg-indigo-500" }
  ];

  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Explore by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find mentors across diverse fields and industries
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${category.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-gray-600">{category.count} mentors available</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Enhanced Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager at Google",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      content: "SkillBridge connected me with an amazing mentor who helped me transition from engineering to product management. The guidance was invaluable!",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Software Engineer at Microsoft",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      content: "The mentorship I received helped me level up my technical skills and land my dream job. Highly recommend this platform!",
      rating: 5
    },
    {
      name: "Emily Johnson",
      role: "UX Designer at Airbnb",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      content: "Amazing platform with top-quality mentors. The sessions were structured and incredibly helpful for my career growth.",
      rating: 5
    }
  ];

  return (
    <div className="py-24 bg-gradient-to-br from-blue-900 to-indigo-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Success Stories
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Hear from professionals who transformed their careers with SkillBridge
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-white mb-6 leading-relaxed">"{testimonial.content}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-blue-200 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Enhanced CTA Section
const CTASection = () => {
  const navigate = useNavigate();

  return (
    <div className="py-24 bg-gradient-to-r from-yellow-400 to-orange-500">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">
            Ready to Accelerate Your Career?
          </h2>
          <p className="text-xl text-black/80 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already growing with SkillBridge
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/findMentorPage')}
              className="px-8 py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
            >
              Find Your Mentor
            </button>
            <button 
              onClick={() => navigate('/becomeMentor')}
              className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Become a Mentor
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Main HomePage Component
const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLoginPage() {
    navigate('/login');
  }
  
  function handleSignUpPage() {
    navigate('/signUp');
  }

  function handleFindMentor() {
    navigate('/findMentorPage');
  }

  return (
    <div className="w-full min-h-screen bg-white flex flex-col font-sans">
      {/* Header - Only show if authenticated */}
      {isAuthenticated && <Header />}
      
      {/* Modern Navigation - Only show if NOT authenticated */}
      {!isAuthenticated && (
        <motion.nav 
          className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">SB</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  Skill<span className="text-blue-600">Bridge</span>
                </span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8">
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</a>
                <a href="#" onClick={handleFindMentor} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Find Mentors</a>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</a>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</a>
              </div>

              {/* Auth Buttons */}
              <div className="hidden lg:flex items-center space-x-4">
                <button 
                  onClick={handleLoginPage}
                  className="px-6 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={handleSignUpPage}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Get Started
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div 
              className="lg:hidden bg-white border-t border-gray-100"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="px-6 py-4 space-y-4">
                <a href="#" className="block text-gray-700 hover:text-blue-600 font-medium">Home</a>
                <a href="#" onClick={handleFindMentor} className="block text-gray-700 hover:text-blue-600 font-medium">Find Mentors</a>
                <a href="#" className="block text-gray-700 hover:text-blue-600 font-medium">About</a>
                <a href="#" className="block text-gray-700 hover:text-blue-600 font-medium">Contact</a>
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <button 
                    onClick={handleLoginPage}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={handleSignUpPage}
                    className="block w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.nav>
      )}

      {/* Main Content */}
      <div className={isAuthenticated ? "mt-20" : ""}>
        {/* Enhanced Hero Section */}
        <EnhancedHeroSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Categories Section */}
        <CategoriesSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* CTA Section */}
        <CTASection />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;