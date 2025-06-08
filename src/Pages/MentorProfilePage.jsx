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
import Footer from "../Components/Footer"
import Header from "../Components/Header"
import MentorCard from "../Components/MentorCard"

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
    if (selectedService.type === "Query") {
      if (!resumeFile || !query.trim()) {
        alert("Please upload your resume and enter your query.")
        return
      }
    } else {
      if (!selectedDate || !selectedTime) {
        alert("Please select date and time for your session.")
        return
      }
    }
    setShowPaymentModal(true)
  }

  const handlePayment = () => {
    // Simulate payment process
    setTimeout(() => {
      setShowPaymentModal(false)
      setShowBookingModal(false)
      alert("Booking confirmed! You'll receive a confirmation email shortly.")
      // Reset form
      setSelectedService(null)
      setSelectedDate("")
      setSelectedTime("")
      setResumeFile(null)
      setQuery("")
      setBookingStep(1)
    }, 2000)
  }

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
    {
      id: 2,
      name: "John Rodriguez",
      role: "Senior Security Architect",
      company: "Microsoft",
      experience: "8 years",
      rating: 4.8,
      reviews: 124,
      skills: ["Cloud Security", "Zero Trust", "Compliance"],
      price: 120,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      badge: "Top Rated",
      responseTime: "4 hours",
    },
    {
      id: 3,
      name: "Emily Chen",
      role: "Cybersecurity Director",
      company: "Tesla",
      experience: "12 years",
      rating: 4.9,
      reviews: 89,
      skills: ["Threat Intelligence", "Incident Response", "Security Architecture"],
      price: 180,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
      badge: "Expert",
      responseTime: "2 hours",
    },
    {
      id: 4,
      name: "Michael Chang",
      role: "Principal Security Engineer",
      company: "Google",
      experience: "15 years",
      rating: 4.7,
      reviews: 256,
      skills: ["Application Security", "Penetration Testing", "Security Automation"],
      price: 200,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      badge: "Trending",
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
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40" />
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

              <div className="bg-blue-50 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-center text-blue-700 text-sm mb-2">
                  <Clock size={14} className="mr-2" />
                  {mentor.responseTime}
                </div>
                <div className="text-xs text-blue-600">Languages: {mentor.languages?.join(", ")}</div>
              </div>

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
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedService?.type === "Query" ? "Ask Your Query" : "Schedule Session"}
                </h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Service Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{selectedService?.title}</h3>
                    <p className="text-gray-600 text-sm">{selectedService?.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">₹{selectedService?.price}</div>
                    <div className="text-sm text-gray-500">{selectedService?.duration}</div>
                  </div>
                </div>
              </div>

              {selectedService?.type === "Query" ? (
                // Query Form
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Upload Your Resume *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label htmlFor="resume-upload" className="cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        {resumeFile ? (
                          <div className="text-green-600">
                            <Check className="inline mr-2" size={20} />
                            {resumeFile.name} uploaded successfully
                          </div>
                        ) : (
                          <div>
                            <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                            <p className="text-sm text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Your Query *</label>
                    <textarea
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Please describe your question or challenge in detail. The more specific you are, the better guidance you'll receive."
                      className="w-full h-32 p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      maxLength={1000}
                    />
                    <div className="text-right text-sm text-gray-500 mt-2">{query.length}/1000 characters</div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                    <div className="flex items-start">
                      <FileText className="text-yellow-600 mr-3 mt-1" size={20} />
                      <div>
                        <h4 className="font-semibold text-yellow-800 mb-2">What to include in your query:</h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          <li>• Your current role and experience level</li>
                          <li>• Specific challenges you're facing</li>
                          <li>• Your career goals or objectives</li>
                          <li>• Any relevant context or background</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Scheduling Form
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Select Date *</label>
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 14 }, (_, i) => {
                        const date = new Date()
                        date.setDate(date.getDate() + i + 1)
                        const dateStr = date.toISOString().split("T")[0]
                        const dayName = date.toLocaleDateString("en-US", { weekday: "short" })
                        const dayNum = date.getDate()

                        return (
                          <button
                            key={i}
                            onClick={() => setSelectedDate(dateStr)}
                            className={`p-3 rounded-xl text-center transition-all duration-200 ${
                              selectedDate === dateStr
                                ? "bg-blue-500 text-white shadow-lg"
                                : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                            }`}
                          >
                            <div className="text-xs font-medium">{dayName}</div>
                            <div className="text-lg font-bold">{dayNum}</div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {selectedDate && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">Available Time Slots *</label>
                      <div className="grid grid-cols-2 gap-3">
                        {["10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "5:00 PM", "6:30 PM"].map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`p-3 rounded-xl text-center transition-all duration-200 ${
                              selectedTime === time
                                ? "bg-green-500 text-white shadow-lg"
                                : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
                            }`}
                          >
                            <Clock size={16} className="inline mr-2" />
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                    <div className="flex items-start">
                      <CalendarDays className="text-blue-600 mr-3 mt-1" size={20} />
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">Session Details:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• You'll receive a meeting link via email</li>
                          <li>• Please join 5 minutes before the scheduled time</li>
                          <li>• Bring any specific questions or materials</li>
                          <li>• Session will be recorded for your reference</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookingSubmit}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Order Summary */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mb-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">{selectedService?.title}</span>
                  <span className="font-semibold">₹{selectedService?.price}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-semibold">₹{Math.round(selectedService?.price * 0.05)}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900">
                      ₹{selectedService?.price + Math.round(selectedService?.price * 0.05)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <CreditCard className="mr-3 text-blue-500" size={20} />
                    <div>
                      <div className="font-medium text-gray-900">Credit/Debit Card</div>
                      <div className="text-sm text-gray-500">Secure payment with card</div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="w-5 h-5 bg-orange-500 rounded mr-3"></div>
                    <div>
                      <div className="font-medium text-gray-900">UPI</div>
                      <div className="text-sm text-gray-500">Pay with any UPI app</div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="wallet"
                      checked={paymentMethod === "wallet"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="w-5 h-5 bg-green-500 rounded mr-3"></div>
                    <div>
                      <div className="font-medium text-gray-900">Digital Wallet</div>
                      <div className="text-sm text-gray-500">Paytm, PhonePe, etc.</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center mb-6 p-3 bg-green-50 rounded-xl border border-green-200">
                <Shield className="text-green-600 mr-2" size={20} />
                <span className="text-sm text-green-700 font-medium">Your payment is secured with SSL encryption</span>
              </div>

              {/* Payment Form */}
              {paymentMethod === "card" && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePayment}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center"
                >
                  <Shield className="mr-2" size={18} />
                  Pay Now
                </button>
              </div>
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
