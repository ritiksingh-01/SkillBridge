"use client"

import { useState } from "react"
import {
  Star,
  MessageCircle,
  Phone,
  Video,
  ChevronLeft,
  ChevronRight,
  Award,
  Clock,
  Linkedin,
  Twitter,
  Github,
  Globe,
  X,
  Upload,
  CreditCard,
  Shield,
  Check,
  CalendarDays,
  FileText,
  User,
  Building,
} from "lucide-react"
import { useLocation } from "react-router-dom"
import Footer from "../../Components/Footer"
import Header from "../../Components/Header"
import MentorCard from "../../Components/MentorCard"

const MentorProfilePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const location = useLocation()
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [resumeFile, setResumeFile] = useState(null)
  const [query, setQuery] = useState("")
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [bookingStep, setBookingStep] = useState(1)
const [isProcessingPayment, setIsProcessingPayment] = useState(false);
const [showSuccessModal, setShowSuccessModal] = useState(false);
const [currentMonth, setCurrentMonth] = useState(new Date());
const [availableDates, setAvailableDates] = useState(new Set());

// Mock availability data - replace with real data from your API
const mockAvailability = {
  '2025-06-10': true, '2025-06-11': true, '2025-06-12': false,
  '2025-06-13': true, '2025-06-14': false, '2025-06-15': true,
  '2025-06-16': true, '2025-06-17': true, '2025-06-18': false,
  '2025-06-19': true, '2025-06-20': true, '2025-06-21': false,
  '2025-06-22': true, '2025-06-23': true, '2025-06-24': true,
  '2025-06-25': false, '2025-06-26': true, '2025-06-27': true,
  '2025-06-28': true, '2025-06-29': false, '2025-06-30': true,
  '2025-07-01': true, '2025-07-02': false, '2025-07-03': true,
  '2025-07-04': true, '2025-07-05': false, '2025-07-06': true,
};


  // Get mentor data from navigation state
  const mentorDataFromProps = location.state?.mentorData

  const handleServiceSelect = (service) => {
    setSelectedService(service)
    setShowBookingModal(true)
    setBookingStep(1)
  }

  const handleResumeUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setResumeFile(file)
    }
  }

const handleBookingSubmit = () => {
  // Close booking modal and open payment modal directly
  setShowBookingModal(false);
  setTimeout(() => {
    setShowPaymentModal(true);
  }, 200); // Small delay for smooth transition
};

// 3. Update your handlePayment function
const handlePayment = async () => {
  setIsProcessingPayment(true);
  
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessingPayment(false);
    setShowPaymentModal(false);
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 200);
    
    setTimeout(() => {
      setShowSuccessModal(false);
      // Reset form states
      setSelectedDate('');
      setSelectedTime('');
      setQuery('');
      setResumeFile(null);
    }, 5000);
    
  } catch (error) {
    setIsProcessingPayment(false);
    alert('Payment failed. Please try again.');
  }
};

// 4. Calendar helper functions
const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

const formatDateString = (year, month, day) => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const isDateAvailable = (dateString) => {
  return mockAvailability[dateString] === true;
};

const isDatePast = (year, month, day) => {
  const today = new Date();
  const dateToCheck = new Date(year, month, day);
  return dateToCheck < today;
};
<style jsx>{`
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }
  
  @keyframes confetti-0 {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(-100px) rotate(180deg); opacity: 0; }
  }
  
  @keyframes confetti-1 {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(-120px) rotate(-180deg); opacity: 0; }
  }
  
  @keyframes confetti-2 {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(-80px) rotate(270deg); opacity: 0; }
  }
  
  @keyframes confetti-3 {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(-110px) rotate(-270deg); opacity: 0; }
  }
  
  .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
  .animate-scaleIn { animation: scaleIn 0.4s ease-out; }
  .animate-confetti-0 { animation: confetti-0 1.5s ease-out forwards; }
  .animate-confetti-1 { animation: confetti-1 1.5s ease-out forwards; }
  .animate-confetti-2 { animation: confetti-2 1.5s ease-out forwards; }
  .animate-confetti-3 { animation: confetti-3 1.5s ease-out forwards; }
  
  /* Hide scrollbar */
  .hide-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
`}</style>

  // Create enhanced mentor data by merging passed data with defaults
  const createEnhancedMentor = (basicMentor) => {
    if (!basicMentor) return null

    const basePrice = basicMentor.price || 100
    const baseRating = basicMentor.rating || 4.5

    return {
      // Use passed data as base
      ...basicMentor,

      // Enhanced about section
      about:
        basicMentor.about ||
        `I'm ${basicMentor.name}, ${basicMentor.role || "experienced professional"}. With ${basicMentor.experience || "years of experience"}, I'm passionate about sharing my knowledge and helping others grow in their careers. I bring real-world experience and practical insights to every mentoring session.`,

      // Location fallback
      location: basicMentor.location || "Location not specified",

      // Reviews data
      totalReviews: basicMentor.totalReviews || basicMentor.reviews || Math.floor(Math.random() * 1000) + 100,

      // Generate rating breakdown based on overall rating
      ratingBreakdown: basicMentor.ratingBreakdown || [
        { stars: 5, percentage: Math.round(baseRating * 15) },
        { stars: 4, percentage: Math.round((5 - baseRating) * 10) },
        { stars: 3, percentage: Math.round((5 - baseRating) * 5) },
        { stars: 2, percentage: 2 },
        { stars: 1, percentage: 1 },
      ],

      // Generate sample reviews if not provided
      reviews: basicMentor.reviews?.length
        ? basicMentor.reviews
        : [
            {
              name: "Prathamesh",
              comment: `Thank you so much ${basicMentor.name?.split(" ")[0] || "mentor"}! Great guidance.`,
              rating: baseRating.toFixed(1),
              date: "2 days ago",
            },
            {
              name: "Alex Chen",
              comment: "Great Mentor!! Very knowledgeable and patient",
              rating: baseRating.toFixed(1),
              date: "1 week ago",
            },
            {
              name: "Maria Garcia",
              comment: "Excellent guidance and real-world insights",
              rating: baseRating.toFixed(1),
              date: "2 weeks ago",
            },
          ],

      // Generate services based on price and role
      services: basicMentor.services || [
        {
          id: 1,
          type: "Query",
          title: "Ask Query",
          duration: "48 hour response",
          price: Math.round(basePrice * 1.5),
          icon: MessageCircle,
          buttonText: "ASK QUERY",
          description: "Get personalized answers to your career questions",
          features: ["Detailed written response", "Follow-up questions included", "Resume review available"],
        },
        {
          id: 2,
          type: "1:1 Call",
          title: "Quick Call",
          duration: "30 min",
          price: Math.round(basePrice * 15),
          icon: Phone,
          buttonText: "BOOK NOW",
          description: "Quick consultation for immediate guidance",
          features: ["Live conversation", "Instant feedback", "Action plan provided"],
        },
        {
          id: 3,
          type: "1:1 Call",
          title: "Mentor Meet",
          duration: "60 min",
          price: Math.round(basePrice * 25),
          icon: Video,
          buttonText: "BOOK NOW",
          description: "Comprehensive mentoring session",
          features: ["Video call", "Screen sharing", "Detailed roadmap", "Follow-up notes"],
        },
      ],

      // Social links with fallback
      socialLinks: basicMentor.socialLinks || [
        { platform: "LinkedIn", color: "text-blue-600", icon: Linkedin, url: "#" },
        { platform: "Twitter", color: "text-sky-500", icon: Twitter, url: "#" },
        { platform: "GitHub", color: "text-gray-800", icon: Github, url: "#" },
        { platform: "Website", color: "text-green-600", icon: Globe, url: "#" },
      ],

      // Skills enhancement
      skills:
        basicMentor.skills ||
        (basicMentor.category
          ? [basicMentor.category, "Leadership", "Mentoring"]
          : ["Technology", "Leadership", "Problem Solving"]),

      // Generate achievements based on available data
      achievements:
        basicMentor.achievements ||
        [
          `Expert in ${basicMentor.skills?.[0] || basicMentor.category || "Technology"}`,
          `${basicMentor.experience || "Extensive experience"} in the industry`,
          `Worked at ${basicMentor.experience?.includes("Former") ? basicMentor.experience.replace("Former ", "") : "top companies"}`,
          `Passionate about mentoring and teaching`,
          ...(basicMentor.badge ? [`${basicMentor.badge} mentor on platform`] : []),
        ]
          .filter(Boolean)
          .slice(0, 4),

      // Response time
      responseTime: basicMentor.responseTime || "Usually responds within 2 hours",
    }
  }

  const mentor = createEnhancedMentor(mentorDataFromProps)

  // Sample similar mentors
  const similarMentors = [
    // {
    //   id: 2,
    //   name: "John Rodriguez",
    //   role: "Senior Security Architect",
    //   company: "Microsoft",
    //   experience: "8 years",
    //   rating: 4.8,
    //   reviews: 124,
    //   skills: ["Cloud Security", "Zero Trust", "Compliance"],
    //   price: 120,
    //   image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    //   badge: "Top Rated",
    //   responseTime: "4 hours",
    // },
    // {
    //   id: 3,
    //   name: "Emily Chen",
    //   role: "Cybersecurity Director",
    //   company: "Tesla",
    //   experience: "12 years",
    //   rating: 4.9,
    //   reviews: 89,
    //   skills: ["Threat Intelligence", "Incident Response", "Security Architecture"],
    //   price: 180,
    //   image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    //   badge: "Expert",
    //   responseTime: "2 hours",
    // },
    // {
    //   id: 4,
    //   name: "Michael Chang",
    //   role: "Principal Security Engineer",
    //   company: "Google",
    //   experience: "15 years",
    //   rating: 4.7,
    //   reviews: 256,
    //   skills: ["Application Security", "Penetration Testing", "Security Automation"],
    //   price: 200,
    //   image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    //   badge: "Trending",
    //   responseTime: "6 hours",
    // },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Engineering Director",
      experience: "Former Microsoft, Meta",
      rating: 4.8,
      reviews: 31,
      skills: ["Software Architecture", "Team Management", "Career Growth"],
      price: 90,
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      availability: "Next available May 15",
      badge: "Top Rated",
      category: "Engineering",
      responseTime: "6 hours",
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Marketing Executive",
      company: "Google",
      experience: "Former Spotify, Netflix",
      rating: 4.9,
      reviews: 19,
      skills: ["Growth Strategy", "Brand Building", "Digital Marketing"],
      price: 65,
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      availability: "Available this week",
      category: "Marketing",
      responseTime: "6 hours",
    },
    {
      id: 4,
      name: "Elena Rodriguez",
      role: "UX Design Lead",
      company: "Google",
      experience: "Former Apple, Airbnb",
      rating: 5.0,
      reviews: 27,
      skills: ["Product Design", "User  Research", "Design Systems"],
      price: 80,
      image: "https://randomuser.me/api/portraits/women/69.jpg",
      availability: "Limited availability",
      category: "Design",
      responseTime: "6 hours",
    },
    {
      id: 5,
      name: "James Wilson",
      role: "CTO",
      company: "Google",
      experience: "Former Oracle, IBM",
      rating: 4.7,
      reviews: 32,
      skills: ["Technical Leadership", "System Architecture", "Cloud Strategy"],
      price: 95,
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      availability: "Available next week",
      category: "Engineering",
      responseTime: "6 hours",
    },
    {
      id: 6,
      name: "Aisha Patel",
      company: "Google",
      role: "Data Science Director",
      experience: "Former Tesla, Uber",
      rating: 4.9,
      reviews: 18,
      skills: ["AI/ML", "Analytics Strategy", "Big Data"],
      price: 85,
      image: "https://randomuser.me/api/portraits/women/70.jpg",
      availability: "Available this week",
      category: "Data",
      responseTime: "6 hours",
    },
    {
      id: 7,
      name: "Laura Smith",
      company: "Google",
      role: "Product Marketing Manager",
      experience: "Former Google, Facebook",
      rating: 4.6,
      reviews: 22,
      skills: ["Market Research", "Product Launch", "Customer Insights"],
      price: 70,
      image: "https://randomuser.me/api/portraits/women/71.jpg",
      availability: "Available this week",
      category: "Marketing",
      responseTime: "6 hours",
    },
    {
      id: 8,
      name: "Robert Brown",
      role: "Software Engineer",
      company: "Google",
      experience: "Former IBM, Intel",
      rating: 4.5,
      reviews: 15,
      skills: ["Full Stack Development", "DevOps", "Cloud Computing"],
      price: 80,
      image: "https://randomuser.me/api/portraits/men/4.jpg",
      availability: "Available next week",
      category: "Engineering",
      responseTime: "6 hours",
    },
    {
      id: 9,
      name: "Nina Patel",
      role: "Data Analyst",
      company: "Google",
      experience: "Former Deloitte, Accenture",
      rating: 4.8,
      reviews: 20,
      skills: ["Data Visualization", "Statistical Analysis", "Business Intelligence"],
      price: 65,
      image: "https://randomuser.me/api/portraits/women/72.jpg",
      availability: "Available this week",
      category: "Data",
      responseTime: "6 hours"
    },
    {
      id: 10,
      name: "Chris Evans",
      role: "Cybersecurity Specialist",
      company: "Google",
      experience: "Former Cisco, Symantec",
      rating: 4.9,
      reviews: 30,
      skills: ["Network Security", " Risk Management", "Incident Response"],
      price: 100,
      image: "https://randomuser.me/api/portraits/men/5.jpg",
      availability: "Available next week",
      category: "Security",
      responseTime: "6 hours",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(similarMentors.length / 2))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(similarMentors.length / 2)) % Math.ceil(similarMentors.length / 2))
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Backdrop blur when modals are open */}
      {(showBookingModal || showPaymentModal) && (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-40 transition-all duration-300" />
      )}
      {/* Header */}
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Enhanced Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100 sticky top-24">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-20"></div>
                <img
                  src={mentor.image || "/placeholder.svg"}
                  alt={mentor.name}
                  className="relative w-32 h-32 rounded-full mx-auto border-4 border-white shadow-lg object-cover"
                />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                  Online
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">{mentor.name}</h2>
              <p className="text-gray-600 text-sm mb-1">{mentor.role}</p>
              <div className="flex items-center justify-center text-gray-500 text-sm mb-4">
                <Building size={14} className="mr-1" />
                {mentor.company}
              </div>

              <div className="flex items-center justify-center mb-4">
                <Star size={16} className="text-yellow-400 fill-current mr-1" />
                <span className="font-semibold text-gray-800">{mentor.rating}</span>
                <span className="text-gray-500 text-sm ml-2">({mentor.totalReviews?.toLocaleString()} reviews)</span>
              </div>

              {/* <div className="bg-blue-50 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-center text-blue-700 text-sm mb-2">
                  <Clock size={14} className="mr-2" />
                  {mentor.responseTime}
                </div>
                <div className="text-xs text-blue-600">Languages: {mentor.languages?.join(", ")}</div>
              </div> */}

              {/* Enhanced Skills Tags */}
              <div className="flex flex-wrap gap-2 mb-6 justify-center">
                {mentor.skills?.slice(0, 6).map((skill, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full px-3 py-1"
                  >
                    <span className="text-blue-700 text-xs font-medium">{skill}</span>
                  </div>
                ))}
                {mentor.skills?.length > 6 && (
                  <div className="bg-gray-100 rounded-full px-3 py-1">
                    <span className="text-gray-600 text-xs">+{mentor.skills.length - 6} more</span>
                  </div>
                )}
              </div>

              {/* Enhanced Social Links */}
              <div className="flex justify-center space-x-3">
                {mentor.socialLinks?.map((link, index) => {
                  const IconComponent = link.icon
                  return (
                    <a
                      key={index}
                      href={link.url}
                      className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-300 group"
                    >
                      <IconComponent size={18} className={`${link.color} group-hover:scale-110 transition-transform`} />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Enhanced About Section */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <User className="mr-3 text-blue-500" size={24} />
                About {mentor.name?.split(" ")[0]}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">{mentor.about}</p>

              {/* Enhanced Achievements */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Award className="mr-2 text-yellow-500" size={20} />
                  Key Achievements
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mentor.achievements?.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
                    >
                      <div className="bg-yellow-100 p-1 rounded-full">
                        <Award className="w-3 h-3 text-yellow-600" />
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Services Section */}
            {mentor.services && mentor.services.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Services & Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {mentor.services.map((service, index) => {
                    const IconComponent = service.icon
                    return (
                      <div key={index} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <div className="relative border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-all duration-300 bg-white">
                          <div className="flex items-center justify-between mb-4">
                            <div className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 text-xs px-3 py-1 rounded-full flex items-center font-medium">
                              <IconComponent size={12} className="mr-1" />
                              {service.type}
                            </div>
                            {service.type !== "Query" && (
                              <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">₹{service.price}</div>
                                <div className="text-xs text-gray-500">{service.duration}</div>
                              </div>
                            )}
                          </div>

                          <h4 className="font-bold text-gray-900 mb-2 text-lg">{service.title}</h4>
                          <p className="text-gray-600 text-sm mb-4">{service.description}</p>

                          <div className="space-y-2 mb-6">
                            {service.features?.map((feature, idx) => (
                              <div key={idx} className="flex items-center text-sm text-gray-600">
                                <Check size={14} className="text-green-500 mr-2" />
                                {feature}
                              </div>
                            ))}
                          </div>

                          {service.type === "Query" && (
                            <div className="text-center mb-4">
                              <div className="text-2xl font-bold text-gray-900">₹{service.price}</div>
                              <div className="text-xs text-gray-500">{service.duration}</div>
                            </div>
                          )}

                          <button
                            onClick={() => handleServiceSelect(service)}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                          >
                            {service.buttonText}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Enhanced Rating & Reviews Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Rating & Reviews</h3>
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-gray-900 mb-2">{mentor.rating}</div>
                  <div className="flex justify-center text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={20} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-gray-500">{mentor.totalReviews?.toLocaleString()} total reviews</p>
                </div>

                <div className="space-y-3">
                  {mentor.ratingBreakdown?.map((rating) => (
                    <div key={rating.stars} className="flex items-center">
                      <span className="w-3 text-sm text-gray-600">{rating.stars}</span>
                      <Star size={12} className="text-yellow-400 mx-2" />
                      <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${rating.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 w-8">{rating.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Reviews</h3>
                <div className="space-y-4">
                  {mentor.reviews?.map((review, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {review.name.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <div className="font-semibold text-gray-900 text-sm">{review.name}</div>
                            <div className="text-xs text-gray-500">{review.date}</div>
                          </div>
                        </div>
                        <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
                          {review.rating}★
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Similar Mentors Section */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Similar Mentors</h3>
                  <p className="text-gray-500">Discover other experts in cybersecurity</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={prevSlide}
                    className="w-10 h-10 border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="w-10 h-10 border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {Array.from({ length: Math.ceil(similarMentors.length / 2) }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {similarMentors.slice(slideIndex * 2, (slideIndex + 1) * 2).map((mentor) => (
                          <MentorCard key={mentor.id} mentor={mentor} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Booking Modal */}
{showBookingModal && (
  <div className="fixed inset-0 flex items-center justify-center z-[110] p-4 animate-fadeIn">
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg h-[85vh] border border-white/20 flex flex-col hide-scrollbar">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl p-4 border-b border-gray-100 rounded-t-2xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {selectedService?.type === "Query" ? "Ask Your Query" : "Schedule Session"}
          </h2>
          <button
            onClick={() => setShowBookingModal(false)}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 overflow-y-auto hide-scrollbar">
        {/* Service Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{selectedService?.title}</h3>
              <p className="text-gray-600 text-xs mt-1">{selectedService?.duration}</p>
            </div>
            <div className="text-xl font-bold text-gray-900">₹{selectedService?.price}</div>
          </div>
        </div>

        {selectedService?.type === "Query" ? (
          // Query Form
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Upload Resume *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  {resumeFile ? (
                    <div className="text-green-600 text-sm">
                      <Check className="inline mr-1" size={16} />
                      {resumeFile.name}
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Click to upload</p>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX (10MB max)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Your Query *</label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe your question in detail..."
                className="w-full h-24 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                maxLength={1000}
              />
              <div className="text-right text-xs text-gray-500 mt-1">{query.length}/1000</div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
              <div className="flex items-start">
                <FileText className="text-yellow-600 mr-2 mt-0.5 flex-shrink-0" size={16} />
                <div>
                  <h4 className="font-semibold text-yellow-800 text-sm mb-1">Include:</h4>
                  <ul className="text-xs text-yellow-700 space-y-0.5">
                    <li>• Your role & experience</li>
                    <li>• Specific challenges</li>
                    <li>• Career goals</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Enhanced Calendar Scheduling Form
          <div className="space-y-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Date</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="text-sm font-medium text-gray-900 min-w-[120px] text-center">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 p-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2"></div>
                ))}
                
                {Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => {
                  const day = i + 1;
                  const year = currentMonth.getFullYear();
                  const month = currentMonth.getMonth();
                  const dateString = formatDateString(year, month, day);
                  const isAvailable = isDateAvailable(dateString);
                  const isPast = isDatePast(year, month, day);
                  const isSelected = selectedDate === dateString;
                  
                  return (
                    <button
                      key={day}
                      onClick={() => !isPast && isAvailable && setSelectedDate(dateString)}
                      disabled={isPast || !isAvailable}
                      className={`
                        p-2 rounded-lg text-sm font-medium transition-all duration-200 relative
                        ${isSelected ? 'bg-blue-500 text-white shadow-md' : ''}
                        ${!isSelected && isAvailable && !isPast ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200' : ''}
                        ${!isAvailable && !isPast ? 'bg-red-50 text-red-400 cursor-not-allowed' : ''}
                        ${isPast ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : ''}
                      `}
                    >
                      {day}
                      {/* Availability indicator */}
                      {!isPast && (
                        <div className={`absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                          isAvailable ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center space-x-4 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-100 border border-green-200 rounded mr-1"></div>
                <span className="text-gray-600">Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-100 border border-red-200 rounded mr-1"></div>
                <span className="text-gray-600">Unavailable</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
                <span className="text-gray-600">Selected</span>
              </div>
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Available Time Slots</h4>
                <div className="grid grid-cols-2 gap-2">
                  {["10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "5:00 PM", "6:30 PM"].map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-lg text-center transition-all duration-200 text-sm border ${
                        selectedTime === time
                          ? "bg-blue-500 text-white shadow-md border-blue-500"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      <Clock size={14} className="inline mr-2" />
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Session Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
              <div className="flex items-start">
                <CalendarDays className="text-blue-600 mr-3 mt-0.5 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-blue-800 text-sm mb-2">Session Information:</h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Meeting link will be sent via email after payment</li>
                    <li>• Please join 5 minutes before the scheduled time</li>
                    <li>• Session will be recorded for your reference</li>
                    <li>• Reschedule up to 24 hours before the session</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex space-x-3 p-4 border-t border-gray-100 flex-shrink-0">
        <button
          onClick={() => setShowBookingModal(false)}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleBookingSubmit}
          disabled={selectedService?.type !== "Query" ? (!selectedDate || !selectedTime) : (!query || !resumeFile)}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  </div>
)}

{showPaymentModal && (
  <div className="fixed inset-0 flex items-start justify-center z-[110] p-4 pt-20 animate-fadeIn">
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg max-h-[75vh] border border-white/20 flex flex-col hide-scrollbar">
      {/* Header - same as before */}
      <div className="bg-white/90 backdrop-blur-xl p-4 border-b border-gray-100 rounded-t-2xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Complete Payment</h2>
          <button
            onClick={() => {
              setShowPaymentModal(false);
              setShowBookingModal(true);
            }}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 overflow-y-auto hide-scrollbar">
        {/* Order Summary - same as before */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-900 font-medium text-sm">{selectedService?.title}</span>
                <p className="text-xs text-gray-500">{selectedService?.duration}</p>
              </div>
              <span className="font-semibold text-gray-900">₹{selectedService?.price}</span>
            </div>
            
            {selectedDate && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium text-gray-900">
                  {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            )}
            
            {selectedTime && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium text-gray-900">{selectedTime}</span>
              </div>
            )}
            
            <div className="border-t border-gray-300 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Fee:</span>
                <span className="font-semibold">₹{selectedService?.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Platform Fee:</span>
                <span className="font-semibold">₹{Math.round(selectedService?.price * 0.05)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 mt-2 pt-2 border-t border-gray-300">
                <span>Total:</span>
                <span>₹{selectedService?.price + Math.round(selectedService?.price * 0.05)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Payment Methods */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-3">Choose Payment Method</h3>
          <div className="space-y-3">
            {/* Credit/Debit Card */}
            <label className="flex items-center p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3 w-4 h-4"
              />
              <CreditCard className="mr-3 text-blue-500" size={20} />
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">Credit/Debit Card</div>
                <div className="text-xs text-gray-500">Visa, MasterCard, RuPay</div>
              </div>
            </label>

            {/* UPI Payment */}
            <div className="border-2 border-gray-200 rounded-xl p-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === "upi"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3 w-4 h-4"
                />
                <div className="mr-3 text-lg">🟠</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">UPI Payment</div>
                  <div className="text-xs text-gray-500">Choose your preferred UPI app</div>
                </div>
              </label>
              
              {paymentMethod === "upi" && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleUPIPayment('Google Pay')}
                    className="flex flex-col items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mb-1">
                      <span className="text-white text-xs font-bold">G</span>
                    </div>
                    <span className="text-xs text-gray-700">GPay</span>
                  </button>
                  <button
                    onClick={() => handleUPIPayment('PhonePe')}
                    className="flex flex-col items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mb-1">
                      <span className="text-white text-xs font-bold">P</span>
                    </div>
                    <span className="text-xs text-gray-700">PhonePe</span>
                  </button>
                  <button
                    onClick={() => handleUPIPayment('Paytm')}
                    className="flex flex-col items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mb-1">
                      <span className="text-white text-xs font-bold">P</span>
                    </div>
                    <span className="text-xs text-gray-700">Paytm</span>
                  </button>
                </div>
              )}
            </div>

            {/* Digital Wallet */}
            <div className="border-2 border-gray-200 rounded-xl p-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="wallet"
                  checked={paymentMethod === "wallet"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3 w-4 h-4"
                />
                <div className="mr-3 text-lg">🟢</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">Digital Wallet</div>
                  <div className="text-xs text-gray-500">Choose your wallet</div>
                </div>
              </label>
              
              {paymentMethod === "wallet" && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleUPIPayment('Paytm Wallet')}
                    className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-6 h-6 bg-blue-600 rounded mr-2 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">P</span>
                    </div>
                    <span className="text-xs text-gray-700">Paytm</span>
                  </button>
                  <button
                    onClick={() => handleUPIPayment('Mobikwik')}
                    className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-6 h-6 bg-red-500 rounded mr-2 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">M</span>
                    </div>
                    <span className="text-xs text-gray-700">Mobikwik</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Security Badge */}
        <div className="flex items-center justify-center mb-6 p-3 bg-green-50 rounded-xl border border-green-200">
          <Shield className="text-green-600 mr-2" size={20} />
          <span className="text-sm text-green-700 font-medium">256-bit SSL Secured Payment</span>
        </div>
      </div>
      <div className="flex space-x-3 p-4 border-t border-gray-100 flex-shrink-0">
        <button
          onClick={() => {
            setShowPaymentModal(false);
            setShowBookingModal(true);
          }}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handlePayment}
          disabled={isProcessingPayment || !paymentMethod}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessingPayment ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <Shield className="mr-2" size={16} />
              Pay ₹{selectedService?.price + Math.round(selectedService?.price * 0.05)}
            </>
          )}
        </button>
      </div>
    </div>
  </div>
)}
{showSuccessModal && (
  <div className="fixed inset-0 flex items-center justify-center z-[120] p-4 animate-fadeIn">
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md border border-white/20 animate-scaleIn">
      <div className="p-8 text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
              <Check className="text-white" size={32} />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">
          Your booking has been confirmed. Check your email for session details.
        </p>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-6 border border-green-200">
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Service:</span>
              <span className="font-semibold text-gray-900">{selectedService?.title}</span>
            </div>
            {selectedDate && (
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-semibold text-gray-900">
                  {new Date(selectedDate).toLocaleDateString()}
                </span>
              </div>
            )}
            {selectedTime && (
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-semibold text-gray-900">{selectedTime}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-300 pt-2">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="font-bold text-green-600">
                ₹{selectedService?.price + Math.round(selectedService?.price * 0.05)}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setShowSuccessModal(false);
            setShowPaymentModal(false);
            setShowBookingModal(false);
            setSelectedDate('');
            setSelectedTime('');
            setQuery('');
            setResumeFile(null);
          }}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
        >
          Done
        </button>
      </div>
    </div>
  </div>
)}
      {/* Enhanced Footer */}
      <Footer />
    </div>
  )
}

export default MentorProfilePage