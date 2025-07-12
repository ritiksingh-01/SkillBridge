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
  ChevronRight,
  Clock,
  MapPin,
  Building,
  Coffee,
  Lightbulb,
  Rocket,
  Heart,
  Quote
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { useAuth } from "../../context/AuthContext";

// Authentic Hero Section
const AuthenticHeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      text: "SkillBridge helped me transition from engineering to product management at Google",
      author: "Sarah Chen",
      role: "Product Manager at Google",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face"
    },
    {
      text: "Found my mentor here and got promoted within 6 months",
      author: "Michael Rodriguez", 
      role: "Senior Developer at Microsoft",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
    },
    {
      text: "The best investment I made for my career growth",
      author: "Emily Johnson",
      role: "UX Designer at Airbnb", 
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative bg-white overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/30"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Trust indicator */}
            <div className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-green-700 text-sm font-medium">Trusted by 50,000+ professionals</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Learn from the
                <span className="block text-blue-600">best in your field</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Connect with industry experts who've been where you want to go. 
                Get personalized guidance, practical insights, and accelerate your career.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate('/findMentorPage')}
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                <span>Find Your Mentor</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => navigate('/becomeMentor')}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
              >
                <span>Become a Mentor</span>
              </button>
            </div>

            {/* Social proof */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <img 
                    key={i}
                    src={`https://randomuser.me/api/portraits/women/${i}.jpg`}
                    className="w-10 h-10 rounded-full border-2 border-white"
                    alt=""
                  />
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                  +2k
                </div>
              </div>
              <div className="text-gray-600">
                <span className="font-semibold text-gray-900">2,000+</span> professionals growing with us
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image with floating testimonial */}
          <div className="relative">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                alt="Professional mentorship"
                className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
              />
              
              {/* Floating testimonial card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border max-w-sm">
                <div className="flex items-start space-x-4">
                  <img 
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <Quote className="w-4 h-4 text-blue-600 mb-2" />
                    <p className="text-gray-700 text-sm mb-3">
                      "{testimonials[currentTestimonial].text}"
                    </p>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {testimonials[currentTestimonial].author}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {testimonials[currentTestimonial].role}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats overlay */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">4.9</div>
                  <div className="flex items-center justify-center mb-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <div className="text-xs text-gray-600">1,200+ reviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company logos */}
        <div className="mt-20 pt-12 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm mb-8">Mentors from leading companies</p>
          <div className="flex items-center justify-center space-x-12 opacity-60">
            <img src="https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" className="h-6" />
            <img src="https://1000logos.net/wp-content/uploads/2021/04/Microsoft-logo.png" alt="Microsoft" className="h-6" />
            <img src="https://cdn.worldvectorlogo.com/logos/netflix-3.svg" alt="Netflix" className="h-6" />
            <img src="https://cdn.worldvectorlogo.com/logos/apple-14.svg" alt="Apple" className="h-6" />
            <img src="https://cdn.worldvectorlogo.com/logos/adobe-2.svg" alt="Adobe" className="h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

// How it works section
const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Browse & Connect",
      description: "Explore our curated list of industry experts and find mentors who align with your goals and interests.",
      icon: <Search className="w-8 h-8" />
    },
    {
      number: "02", 
      title: "Book Your Session",
      description: "Schedule a session at your convenience. Choose from quick consultations or in-depth mentoring sessions.",
      icon: <Calendar className="w-8 h-8" />
    },
    {
      number: "03",
      title: "Learn & Grow",
      description: "Get personalized guidance, actionable insights, and build lasting professional relationships.",
      icon: <TrendingUp className="w-8 h-8" />
    }
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How SkillBridge Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple, effective mentorship in three easy steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gray-200 z-0"></div>
              )}
              
              <div className="relative bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-4">
                    {step.icon}
                  </div>
                  <span className="text-3xl font-bold text-gray-300">{step.number}</span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Featured mentors section
const FeaturedMentorsSection = () => {
  const mentors = [
    {
      name: "Sarah Johnson",
      role: "Senior Product Manager",
      company: "Google",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 4.9,
      sessions: 150,
      expertise: ["Product Strategy", "Leadership", "Career Growth"],
      price: 120
    },
    {
      name: "Michael Chen", 
      role: "Engineering Director",
      company: "Microsoft",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 4.8,
      sessions: 200,
      expertise: ["System Design", "Team Management", "Tech Leadership"],
      price: 150
    },
    {
      name: "Emily Rodriguez",
      role: "UX Design Lead", 
      company: "Airbnb",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5.0,
      sessions: 120,
      expertise: ["UX Design", "Design Systems", "User Research"],
      price: 100
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Top Mentors</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn from industry leaders who are passionate about helping others succeed
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {mentors.map((mentor, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group">
              <div className="text-center mb-6">
                <img 
                  src={mentor.image}
                  alt={mentor.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{mentor.name}</h3>
                <p className="text-blue-600 font-medium mb-1">{mentor.role}</p>
                <p className="text-gray-500 text-sm">{mentor.company}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{mentor.rating}</span>
                  </div>
                  <span className="text-gray-500">{mentor.sessions} sessions</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.slice(0, 2).map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                  {mentor.expertise.length > 2 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                      +{mentor.expertise.length - 2}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-gray-900">${mentor.price}</span>
                  <span className="text-gray-500 text-sm">/session</span>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200">
            View All Mentors
          </button>
        </div>
      </div>
    </div>
  );
};

// Categories section
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
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore by Category</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find mentors across diverse fields and industries
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${category.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-gray-600">{category.count} mentors available</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Success stories section
const SuccessStoriesSection = () => {
  const stories = [
    {
      name: "Alex Thompson",
      role: "Software Engineer → Product Manager",
      company: "Stripe",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      story: "With my mentor's guidance, I successfully transitioned from engineering to product management and landed my dream role at Stripe.",
      achievement: "Career Transition"
    },
    {
      name: "Maria Garcia",
      role: "Junior Designer → Design Lead", 
      company: "Figma",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      story: "My mentor helped me build confidence and leadership skills. I got promoted to Design Lead within 8 months.",
      achievement: "Leadership Role"
    },
    {
      name: "David Kim",
      role: "Startup Founder",
      company: "TechCorp",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", 
      story: "The entrepreneurship mentoring I received was invaluable. My startup just raised Series A funding.",
      achievement: "Startup Success"
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real people, real results. See how mentorship transformed careers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-6">
                <img 
                  src={story.image}
                  alt={story.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{story.name}</h3>
                  <p className="text-blue-600 text-sm font-medium">{story.role}</p>
                  <p className="text-gray-500 text-sm">{story.company}</p>
                </div>
              </div>
              
              <Quote className="w-6 h-6 text-blue-600 mb-4" />
              <p className="text-gray-700 mb-4 leading-relaxed">"{story.story}"</p>
              
              <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4 mr-1" />
                {story.achievement}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Why choose us section
const WhyChooseUsSection = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Verified Experts",
      description: "All mentors are thoroughly vetted professionals from top companies"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Flexible Scheduling", 
      description: "Book sessions that fit your schedule with easy rescheduling options"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Personalized Matching",
      description: "Our algorithm matches you with mentors based on your goals and interests"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Career Acceleration",
      description: "Get actionable insights and strategies to fast-track your career growth"
    }
  ];

  return (
    <div className="py-20 bg-blue-600">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Why Choose SkillBridge?</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            We're committed to providing the best mentorship experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex p-4 bg-white/10 rounded-xl text-white mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-blue-100 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// CTA Section
const CTASection = () => {
  const navigate = useNavigate();

  return (
    <div className="py-20 bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Accelerate Your Career?
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of professionals who are already growing with SkillBridge
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/findMentorPage')}
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg"
          >
            Find Your Mentor
          </button>
          <button 
            onClick={() => navigate('/becomeMentor')}
            className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            Become a Mentor
          </button>
        </div>
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
    <div className="w-full min-h-screen bg-white flex flex-col">
      {/* Header - Only show if authenticated */}
      {isAuthenticated && <Header />}
      
      {/* Navigation - Only show if NOT authenticated */}
      {!isAuthenticated && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SB</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  Skill<span className="text-blue-600">Bridge</span>
                </span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8">
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</a>
                <a href="#" onClick={handleFindMentor} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Find Mentors</a>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">How it Works</a>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</a>
              </div>

              {/* Auth Buttons */}
              <div className="hidden lg:flex items-center space-x-4">
                <button 
                  onClick={handleLoginPage}
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={handleSignUpPage}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
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
            <div className="lg:hidden bg-white border-t border-gray-100">
              <div className="px-6 py-4 space-y-4">
                <a href="#" className="block text-gray-700 hover:text-blue-600 font-medium">Home</a>
                <a href="#" onClick={handleFindMentor} className="block text-gray-700 hover:text-blue-600 font-medium">Find Mentors</a>
                <a href="#" className="block text-gray-700 hover:text-blue-600 font-medium">How it Works</a>
                <a href="#" className="block text-gray-700 hover:text-blue-600 font-medium">About</a>
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <button 
                    onClick={handleLoginPage}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={handleSignUpPage}
                    className="block w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          )}
        </nav>
      )}

      {/* Main Content */}
      <div className={isAuthenticated ? "mt-20" : ""}>
        <AuthenticHeroSection />
        <HowItWorksSection />
        <FeaturedMentorsSection />
        <CategoriesSection />
        <SuccessStoriesSection />
        <WhyChooseUsSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;