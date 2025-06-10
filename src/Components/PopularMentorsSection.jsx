import React, { useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Search } from "lucide-react";
import MentorCard from "./MentorCard";
import { useNavigate } from "react-router-dom";

const PopularMentorsSection = ({ title = "Featured Mentors", subtitle = "Connect with industry leaders who are ready to share their expertise and guide your career" }) => {
  // State for pagination and filtering
  const [currentPage, setCurrentPage] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isVisible, setIsVisible] = useState(false);
  const mentorsPerPage = 4;

  const navigate = useNavigate();

  function handleFindMentor(){
    navigate('/findMentorPage')
  }
  
  // Make component visible after mounting (for animation)
  useEffect(() => {
    // Small delay to ensure animation is visible
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Filter options
  const filterOptions = [
    { id: "all", label: "All Mentors" },
    { id: "trending", label: "Trending" },
    { id: "available", label: "Available Now" },
    { id: "topRated", label: "Top Rated" }
  ];

  const featuredMentors = [
    {
      id: 1,
      name: "David Kim",
      role: "Senior Product Manager",
      experience: "Former Amazon, Google",
      rating: 4.9,
      reviews: 24,
      skills: ["Product Strategy", "Leadership", "UX Design"],
      price: 75,
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      availability: "Available this week",
      badge: "Trending"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Engineering Director",
      experience: "Former Microsoft, Meta",
      rating: 4.8,
      reviews: 31,
      skills: ["Software Architecture", "Team Management", "Career Growth"],
      price: 90,
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      availability: "Next available May 15",
      badge: "Top Rated"
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Marketing Executive",
      experience: "Former Spotify, Netflix",
      rating: 4.9,
      reviews: 19,
      skills: ["Growth Strategy", "Brand Building", "Digital Marketing"],
      price: 65,
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      availability: "Available this week"
    },
    {
      id: 4,
      name: "Elena Rodriguez",
      role: "UX Design Lead",
      experience: "Former Apple, Airbnb",
      rating: 5.0,
      reviews: 27,
      skills: ["Product Design", "User  Research", "Design Systems"],
      price: 80,
      image: "https://randomuser.me/api/portraits/women/4.jpg",
      availability: "Limited availability"
    },
    {
      id: 5,
      name: "James Wilson",
      role: "CTO",
      experience: "Former Oracle, IBM",
      rating: 4.7,
      reviews: 32,
      skills: ["Technical Leadership", "System Architecture", "Cloud Strategy"],
      price: 95,
      image: "https://randomuser.me/api/portraits/men/5.jpg",
      availability: "Available next week"
    },
    {
      id: 6,
      name: "Aisha Patel",
      role: "Data Science Director",
      experience: "Former Tesla, Uber",
      rating: 4.9,
      reviews: 18,
      skills: ["AI/ML", "Analytics Strategy", "Big Data"],
      price: 85,
      image: "https://randomuser.me/api/portraits/women/6.jpg",
      availability: "Available this week"
    },
    {
      id: 7,
      name: "Carlos Mendez",
      role: "Entrepreneurship Coach",
      experience: "3x Founder, Y Combinator Alum",
      rating: 5.0,
      reviews: 41,
      skills: ["Startup Strategy", "Fundraising", "Growth Hacking"],
      price: 110,
      image: "https://randomuser.me/api/portraits/men/7.jpg",
      availability: "Limited availability"
    },
    {
      id: 8,
      name: "Lin Wei",
      role: "Finance Director",
      experience: "Former JPMorgan, Goldman Sachs",
      rating: 4.8,
      reviews: 22,
      skills: ["Investment Strategy", "Financial Planning", "Corporate Finance"],
      price: 100,
      image: "https://randomuser.me/api/portraits/women/8.jpg",
      availability: "Available tomorrow"
    }
  ];

  // Filter mentors based on active filter
  const filteredMentors = featuredMentors.filter(mentor => {
    if (activeFilter === "all") return true;
    if (activeFilter === "trending" && mentor.badge === "Trending") return true;
    if (activeFilter === "topRated" && mentor.badge === "Top Rated") return true;
    if (activeFilter === "available" && mentor.availability.toLowerCase().includes("available")) return true;
    return false;
  });
  
  const totalPages = Math.ceil(filteredMentors.length / mentorsPerPage);
  
  // Reset to first page when filter changes
  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(0);
    }
  }, [activeFilter, totalPages, currentPage]);
  
  const displayedMentors = filteredMentors.slice(currentPage * mentorsPerPage, (currentPage + 1) * mentorsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div 
      className="w-full px-6 md:px-16 lg:px-24 py-16 bg-gray-50 transition-opacity duration-1000"
      style={{ 
        opacity: isVisible ? 1 : 0
      }}
    >
      <div className="max-w-7xl mx-auto transition-all duration-1000 transform" style={{ 
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)'
      }}>
        {/* Header section - centered with animations */}
        <div className="mb-12 text-center transition-all duration-700 transform" style={{ 
          opacity: isVisible ? 1 : 0, 
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
        }}>
          <div className="inline-flex items-center px-3 py-1 bg-blue-100 rounded-full mb-4 animate-pulse">
            <span className="text-blue-700 text-sm font-medium">Top Experts</span>
          </div>
          <h2 className="text-4xl font-bold mb-3 transition-all duration-1000" style={{ 
            opacity: isVisible ? 1 : 0, 
            transform: isVisible ? 'translateY(0)' : 'translateY(15px)'
          }}>{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto transition-all duration-1000 delay-300" style={{ 
            opacity: isVisible ? 1 : 0, 
            transform: isVisible ? 'translateY(0)' : 'translateY(10px)'
          }}>{subtitle}</p>
        </div>
        
        {/* Filter tabs - now centered */}
        <div className="flex justify-center mb-10 transition-all duration-700 delay-200" style={{ 
          opacity: isVisible ? 1 : 0, 
          transform: isVisible ? 'translateY(0)' : 'translateY(15px)'
        }}>
          <div className="flex flex-wrap gap-2 justify-center">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setActiveFilter(option.id)}
                className={`px-4 py-2 text-sm rounded-full transition-all ${
                  activeFilter === option.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Mentors grid */}
        <div className="transition-all duration-700 delay-300" style={{ 
          opacity: isVisible ? 1 : 0, 
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
        }}>
          {displayedMentors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedMentors.map((mentor, index) => (
                <div 
                  key={mentor.id}
                  className="transition-all duration-500"
                  style={{ 
                    opacity: isVisible ? 1 : 0, 
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transitionDelay: `${300 + index * 100}ms`
                  }}
                >
                  <MentorCard mentor={mentor} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 bg-gray-100 rounded-xl text-center">
              <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-800">No mentors found</h3>
              <p className="mt-2 text-gray-600">Try adjusting your filter criteria</p>
              <button 
                onClick={() => setActiveFilter('all')} 
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                View all mentors
              </button>
            </div>
          )}
        </div>

        {/* Pagination and View All button - moved below the mentors grid */}
        <div className="mt-12 flex flex-col items-center transition-all duration-700 delay-400" style={{ 
          opacity: isVisible ? 1 : 0, 
          transform: isVisible ? 'translateY(0)' : 'translateY(15px)'
        }}>
          {/* Mobile pagination dots - only show if we have mentors */}
          {displayedMentors.length > 0 && (
          <div className="flex justify-center mb-6 md:hidden">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-2 h-2 mx-1 rounded-full ${
                  index === currentPage ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          )}
          
          {/* Navigation buttons and View All button */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={goToPrevPage} 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentPage === 0 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button 
                onClick={goToNextPage} 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentPage === totalPages - 1 || totalPages === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
                disabled={currentPage === totalPages - 1 || totalPages === 0}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <button className="px-5 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap" onClick={handleFindMentor}>
              <span>View All Mentors</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularMentorsSection;