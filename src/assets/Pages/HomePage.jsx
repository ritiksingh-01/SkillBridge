import React from "react";
import Footer from "../Components/Footer";
import { Star, CheckCircle, ArrowRight, Calendar, Briefcase, Users, Search, BookOpen, Award, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {

  const navigate = useNavigate();
  function handleClick(){
    navigate('/becomeMentor');
  }
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
          <div className="text-gray-700 font-medium hover:text-blue-600 transition-colors cursor-pointer">How It Works</div>
          <div className="text-gray-700 font-medium hover:text-blue-600 transition-colors cursor-pointer">Resources</div>
          <div className="text-gray-700 font-medium hover:text-blue-600 transition-colors cursor-pointer">Enterprise</div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="px-5 py-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg cursor-pointer">
            <div className="text-gray-700 font-medium">Login</div>
          </div>
          <div className="px-5 py-2 bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg cursor-pointer shadow-md shadow-blue-200">
            <div className="text-white font-medium">Sign Up</div>
          </div>
        </div>
      </div>

      {/* Hero Section - Modern & Professional */}
      <div className="w-full px-6 md:px-16 lg:px-24 py-16 md:py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-16">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-start items-start gap-6">
            <div className="inline-flex items-center px-3 py-1 bg-blue-100 rounded-full">
              <span className="text-blue-700 text-sm font-medium">Trusted by 10,000+ professionals</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Accelerate Your Career With Expert
              <span className="text-blue-600"> Mentorship</span>
            </h1>
            
            <p className="text-gray-600 text-lg font-normal leading-relaxed mt-2">
              Connect with industry leaders who provide personalized guidance, practical insights, and help you navigate your professional journey effectively.
            </p>
            
            <div className="grid grid-cols-2 gap-4 md:gap-8 mt-4 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">5,000+</p>
                  <p className="text-gray-500 text-sm">Expert Mentors</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">500+</p>
                  <p className="text-gray-500 text-sm">Companies</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">20,000+</p>
                  <p className="text-gray-500 text-sm">Sessions Completed</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">40+</p>
                  <p className="text-gray-500 text-sm">Countries</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
              <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer shadow-lg flex items-center justify-center gap-2 transition-all">
                <span className="text-white font-medium">Find Your Mentor</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
              
              <button className="px-8 py-3 bg-white border border-gray-300 hover:border-blue-600 hover:text-blue-600 rounded-lg cursor-pointer shadow-sm flex items-center justify-center gap-2 transition-all">
                <span className="text-gray-700 font-medium" onClick={handleClick}>Become a Mentor</span>
              </button>
            </div>
            
            <div className="mt-8">
              <p className="text-gray-500 mb-2 text-sm">TRUSTED BY PROFESSIONALS FROM</p>
              <div className="flex flex-wrap items-center gap-8 opacity-80">
                <div className="h-8 text-gray-400 font-bold">GOOGLE</div>
                <div className="h-8 text-gray-400 font-bold">MICROSOFT</div>
                <div className="h-8 text-gray-400 font-bold">AMAZON</div>
                <div className="h-8 text-gray-400 font-bold">META</div>
                <div className="h-8 text-gray-400 font-bold">APPLE</div>
              </div>
            </div>
          </div>
          
          {/* Right Image Section - More Professional */}
          <div className="w-full lg:w-1/2 flex justify-center items-center">
            <div className="relative w-full max-w-md">
              {/* Main illustration */}
              <div className="w-full h-96 md:h-[500px] bg-white rounded-3xl overflow-hidden shadow-xl relative">
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>
                
                {/* Profile cards overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-6 transform rotate-3">
                    {/* Mentor cards */}
                    <div className="w-44 h-64 bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transform -rotate-6 hover:rotate-0 transition-transform hover:scale-105">
                      <div className="h-1 bg-blue-600"></div>
                      <img src="/api/placeholder/176/176" alt="Mentor" className="w-full h-32 object-cover" />
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-800">Sarah Chen</p>
                          <div className="flex">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs ml-1 font-medium">4.9</span>
                          </div>
                        </div>
                        <p className="text-blue-600 text-xs font-medium">Director of Engineering</p>
                        <div className="flex items-center mt-2">
                          <div className="bg-blue-100 rounded-full px-2 py-1">
                            <span className="text-blue-700 text-xs">Product</span>
                          </div>
                          <div className="bg-indigo-100 rounded-full px-2 py-1 ml-1">
                            <span className="text-indigo-700 text-xs">Tech</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-44 h-64 bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transform rotate-6 hover:rotate-0 transition-transform hover:scale-105 mt-12">
                      <div className="h-1 bg-indigo-600"></div>
                      <img src="/api/placeholder/176/176" alt="Mentor" className="w-full h-32 object-cover" />
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-800">Alex Rivera</p>
                          <div className="flex">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs ml-1 font-medium">4.8</span>
                          </div>
                        </div>
                        <p className="text-blue-600 text-xs font-medium">Product Manager</p>
                        <div className="flex items-center mt-2">
                          <div className="bg-green-100 rounded-full px-2 py-1">
                            <span className="text-green-700 text-xs">Leadership</span>
                          </div>
                          <div className="bg-blue-100 rounded-full px-2 py-1 ml-1">
                            <span className="text-blue-700 text-xs">UX</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Testimonial floating card */}
                <div className="absolute -bottom-4 -left-6 bg-white p-4 rounded-xl shadow-lg w-64 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs font-bold">5.0</span>
                  </div>
                  <p className="text-gray-600 text-sm">"The mentorship completely transformed my career trajectory."</p>
                  <div className="flex items-center mt-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-600 font-bold">J</div>
                    <p className="text-gray-800 text-xs font-medium ml-2">James Wilson, Software Engineer</p>
                  </div>
                </div>
                
                {/* Ratings floating element */}
                <div className="absolute -top-4 -right-4 bg-white p-3 rounded-xl shadow-lg border border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 text-sm font-bold">96% Success Rate</p>
                      <p className="text-gray-500 text-xs">Career Transitions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="w-full px-6 md:px-16 lg:px-24 py-20 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-2">How SkillBridge Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Simple steps to connect with industry experts and accelerate your professional growth</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="relative">
            <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Find Your Perfect Match</h3>
            <p className="text-gray-600">Browse our curated network of vetted mentors from top companies and filter by industry, expertise, and availability.</p>
            
            <div className="absolute top-0 right-0 md:right-[-30%] hidden md:block">
              <svg width="100" height="16" viewBox="0 0 100 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 8H99M99 8L92 1M99 8L92 15" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Schedule Sessions</h3>
            <p className="text-gray-600">Book one-on-one mentorship sessions that fit your calendar and connect via our secure video platform or messaging.</p>
            
            <div className="absolute top-0 right-0 md:right-[-30%] hidden md:block">
              <svg width="100" height="16" viewBox="0 0 100 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 8H99M99 8L92 1M99 8L92 15" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          <div>
            <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Award className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Grow & Achieve</h3>
            <p className="text-gray-600">Track your progress, complete action items, and reach your professional goals with structured guidance.</p>
          </div>
        </div>
      </div>

      {/* Popular Mentors Section */}
      <div className="w-full px-6 md:px-16 lg:px-24 py-20 bg-gray-50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Mentors</h2>
            <p className="text-gray-600 max-w-xl">Connect with industry leaders who are ready to share their expertise and guide your career</p>
          </div>
          
          <button className="mt-4 md:mt-0 px-5 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 cursor-pointer">
            <span>View All Mentors</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-gray-100">
              <div className="h-1 bg-blue-600"></div>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src="/api/placeholder/64/64" alt="Mentor" className="w-full h-full object-cover" />
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg">David Kim</h3>
                    <p className="text-blue-600 text-sm">Senior Product Manager</p>
                    <p className="text-gray-600 text-sm mt-1">Former Amazon, Google</p>
                    
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">4.9</span>
                      <span className="text-gray-500 text-sm">(24 reviews)</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <div className="bg-gray-100 rounded-full px-3 py-1">
                    <span className="text-gray-700 text-xs">Product Strategy</span>
                  </div>
                  <div className="bg-gray-100 rounded-full px-3 py-1">
                    <span className="text-gray-700 text-xs">Leadership</span>
                  </div>
                  <div className="bg-gray-100 rounded-full px-3 py-1">
                    <span className="text-gray-700 text-xs">UX Design</span>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs">Starting at</p>
                    <p className="text-gray-900 font-bold">$75 / session</p>
                  </div>
                  
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full px-6 md:px-16 lg:px-24 py-20 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-2">Why Top Professionals Choose SkillBridge</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Our platform is designed to create meaningful connections and measurable career growth</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Vetted Industry Experts</h3>
            <p className="text-gray-600">Connect with mentors who have proven track records at top companies and institutions.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Structured Guidance</h3>
            <p className="text-gray-600">Follow proven frameworks and action plans designed to help you reach specific career milestones.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Flexible Scheduling</h3>
            <p className="text-gray-600">Book sessions that fit your calendar with options for various time zones and availability.</p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="w-full px-6 md:px-16 lg:px-24 py-20 bg-gray-50">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 bg-blue-100 rounded-full mb-4">
            <span className="text-blue-700 text-sm font-medium">Success Stories</span>
          </div>
          <h2 className="text-3xl font-bold mb-2">What Our Community Says</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Real experiences from professionals who transformed their careers</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-600 mt-4">"My mentor helped me navigate a challenging career transition and provided invaluable insights that I couldn't find anywhere else. Within 3 months, I landed my dream job."</p>
              
              <div className="mt-6 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                  <img src="/api/placeholder/48/48" alt="User" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-medium">Rebecca Taylor</p>
                  <p className="text-gray-500 text-sm">Product Designer at Airbnb</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full px-6 md:px-16 lg:px-24 py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Accelerate Your Career Growth?</h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">Join thousands of professionals who are achieving their career goals faster with expert mentorship.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all font-medium">
              Find Your Mentor
            </button>
            <button className="px-8 py-3 bg-transparent border border-white text-white rounded-lg hover:bg-blue-700 transition-all font-medium">
              Become a Mentor
            </button>
          </div>
          
          <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-200" />
              <span className="text-blue-100">7-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-200" />
              <span className="text-blue-100">Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-200" />
              <span className="text-blue-100">Satisfaction guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default HomePage;