import { useState, useEffect } from "react"
import {
  Search,
  ArrowUpDown,
  Clock,
  Star,
  Tag,
  Briefcase,
  DollarSign,
  X,
  Sliders,
  Check,
  Award,
  Book,
  TrendingUp,
  Zap,
} from "lucide-react"
import MentorCard from "../Components/MentorCard"
import Footer from "../Components/Footer"
import Header from "../Components/Header"
import MentorBanner from "../Banners/MentorBanner"
import MentorProfilePage from "./MentorProfilePage"
const FindMentorsPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    skills: [],
    price: null,
    rating: null,
    availability: null,
    experience: null,
  })
  const [sortBy, setSortBy] = useState("relevance")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Sample mentor data with online images
  const allMentors = [
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
      badge: "Trending",
      category: "Product",
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
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      availability: "Next available May 15",
      badge: "Top Rated",
      category: "Engineering",
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
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      availability: "Available this week",
      category: "Marketing",
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
      image: "https://randomuser.me/api/portraits/women/69.jpg",
      availability: "Limited availability",
      category: "Design",
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
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      availability: "Available next week",
      category: "Engineering",
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
      image: "https://randomuser.me/api/portraits/women/70.jpg",
      availability: "Available this week",
      category: "Data",
    },
    {
      id: 7,
      name: "Laura Smith",
      role: "Product Marketing Manager",
      experience: "Former Google, Facebook",
      rating: 4.6,
      reviews: 22,
      skills: ["Market Research", "Product Launch", "Customer Insights"],
      price: 70,
      image: "https://randomuser.me/api/portraits/women/71.jpg",
      availability: "Available this week",
      category: "Marketing",
    },
    {
      id: 8,
      name: "Robert Brown",
      role: "Software Engineer",
      experience: "Former IBM, Intel",
      rating: 4.5,
      reviews: 15,
      skills: ["Full Stack Development", "DevOps", "Cloud Computing"],
      price: 80,
      image: "https://randomuser.me/api/portraits/men/4.jpg",
      availability: "Available next week",
      category: "Engineering",
    },
    {
      id: 9,
      name: "Nina Patel",
      role: "Data Analyst",
      experience: "Former Deloitte, Accenture",
      rating: 4.8,
      reviews: 20,
      skills: ["Data Visualization", "Statistical Analysis", "Business Intelligence"],
      price: 65,
      image: "https://randomuser.me/api/portraits/women/72.jpg",
      availability: "Available this week",
      category: "Data",
    },
    {
      id: 10,
      name: "Chris Evans",
      role: "Cybersecurity Specialist",
      experience: "Former Cisco, Symantec",
      rating: 4.9,
      reviews: 30,
      skills: ["Network Security", " Risk Management", "Incident Response"],
      price: 100,
      image: "https://randomuser.me/api/portraits/men/5.jpg",
      availability: "Available next week",
      category: "Security",
    },
    {
      id: 11,
      name: "Sophia Lee",
      role: "Cloud Solutions Architect",
      experience: "Former AWS, Google Cloud",
      rating: 4.7,
      reviews: 28,
      skills: ["Cloud Architecture", "Infrastructure as Code", "DevOps"],
      price: 90,
      image: "https://randomuser.me/api/portraits/women/73.jpg",
      availability: "Available this week",
      category: "Cloud",
    },
    {
      id: 12,
      name: "Daniel Kim",
      role: "AI Research Scientist",
      experience: "Former OpenAI, IBM",
      rating: 4.8,
      reviews: 25,
      skills: ["Machine Learning", "Natural Language Processing", "Computer Vision"],
      price: 95,
      image: "https://randomuser.me/api/portraits/men/6.jpg",
      availability: "Limited availability",
      category: "AI",
    },
  ]

  // Trending domains
  const trendingDomains = [
    { name: "CV Review", icon: <Book className="h-5 w-5 text-blue-600" /> },
    { name: "MBA Preparation", icon: <Award className="h-5 w-5 text-purple-600" /> },
    { name: "Case Competition", icon: <TrendingUp className="h-5 w-5 text-red-600" /> },
    { name: "Placement Support", icon: <Briefcase className="h-5 w-5 text-yellow-600" /> },
    { name: "Technical Interview", icon: <Zap className="h-5 w-5 text-green-600" /> },
  ]

  // Filter options
  const filterOptions = {
    categories: ["Product", "Engineering", "Design", "Marketing", "Data", "Finance", "Leadership"],
    skills: [
      "Product Strategy",
      "UX Design",
      "Software Architecture",
      "Team Management",
      "Leadership",
      "Growth Strategy",
      "Brand Building",
      "Digital Marketing",
      "User   Research",
      "Design Systems",
      "Technical Leadership",
      "System Architecture",
      "Cloud Strategy",
      "AI/ML",
      "Analytics",
    ],
    price: [
      { label: "Under $50/hr", value: "under50" },
      { label: "$50-75/hr", value: "50-75" },
      { label: "$75-100/hr", value: "75-100" },
      { label: "$100+/hr", value: "over100" },
    ],
    rating: [
      { label: "4.5+ stars", value: 4.5 },
      { label: "4.0+ stars", value: 4.0 },
      { label: "3.5+ stars", value: 3.5 },
    ],
    availability: [
      { label: "Available today", value: "today" },
      { label: "Available this week", value: "week" },
      { label: "Available this month", value: "month" },
    ],
    experience: [
      { label: "1+ years", value: 1 },
      { label: "3+ years", value: 3 },
      { label: "5+ years", value: 5 },
      { label: "10+ years", value: 10 },
    ],
  }

  // Sort options
  const sortOptions = [
    { label: "Most Relevant", value: "relevance" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Highest Rated", value: "rating" },
    { label: "Most Popular", value: "popular" },
  ]

  const handleFilterToggle = (filterType, value) => {
    setSelectedFilters((prev) => {
      if (!prev) return // Add a null check
      if (filterType === "categories" || filterType === "skills") {
        const currentSelected = [...prev[filterType]]
        if (currentSelected.includes(value)) {
          return {
            ...prev,
            [filterType]: currentSelected.filter((item) => item !== value),
          }
        } else {
          return {
            ...prev,
            [filterType]: [...currentSelected, value],
          }
        }
      } else {
        if (prev[filterType] === value) {
          return {
            ...prev,
            [filterType]: null,
          }
        } else {
          return {
            ...prev,
            [filterType]: value,
          }
        }
      }
    })
  }

  const removeFilter = (filterType, value) => {
    setSelectedFilters((prev) => {
      if (!prev) return // Add a null check
      if (filterType === "categories" || filterType === "skills") {
        return {
          ...prev,
          [filterType]: prev[filterType].filter((item) => item !== value),
        }
      } else {
        return {
          ...prev,
          [filterType]: null,
        }
      }
    })
  }

  const clearAllFilters = () => {
    setSelectedFilters({
      categories: [],
      skills: [],
      price: null,
      rating: null,
      availability: null,
      experience: null,
    })
    setSearchQuery("")
  }

  useEffect(() => {
    const handleClickOutside = () => {
      if (isSortOpen) setIsSortOpen(false)
    }

    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [isSortOpen])

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close filter panel when clicking outside
      if (isFilterOpen && !event.target.closest(".filter-panel")) {
        setIsFilterOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isFilterOpen])

  const filteredMentors = allMentors.filter((mentor) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesName = mentor.name.toLowerCase().includes(query)
      const matchesRole = mentor.role.toLowerCase().includes(query)
      const matchesSkills = mentor.skills.some((skill) => skill.toLowerCase().includes(query))

      if (!(matchesName || matchesRole || matchesSkills)) {
        return false
      }
    }

    if (selectedFilters.categories.length > 0 && !selectedFilters.categories.includes(mentor.category)) {
      return false
    }

    if (selectedFilters.skills.length > 0 && !mentor.skills.some((skill) => selectedFilters.skills.includes(skill))) {
      return false
    }

    if (selectedFilters.price) {
      if (selectedFilters.price === "under50" && mentor.price >= 50) return false
      if (selectedFilters.price === "50-75" && (mentor.price < 50 || mentor.price > 75)) return false
      if (selectedFilters.price === "75-100" && (mentor.price < 75 || mentor.price > 100)) return false
      if (selectedFilters.price === "over100" && mentor.price <= 100) return false
    }

    if (selectedFilters.rating && mentor.rating < selectedFilters.rating) {
      return false
    }

    if (selectedFilters.availability) {
      const availability = mentor.availability.toLowerCase()
      if (selectedFilters.availability === "today" && !availability.includes("today")) return false
      if (selectedFilters.availability === "week" && !availability.includes("week")) return false
      if (selectedFilters.availability === "month" && !availability.includes("month")) return false
    }

    return true
  })

  const sortedMentors = [...filteredMentors].sort((a, b) => {
    switch (sortBy) {
      case "price_asc":
        return a.price - b.price
      case "price_desc":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "popular":
        return b.reviews - a.reviews
      default:
        return 0
    }
  })

  const indexOfLastMentor = currentPage * itemsPerPage
  const indexOfFirstMentor = indexOfLastMentor - itemsPerPage
  const currentMentors = sortedMentors.slice(indexOfFirstMentor, indexOfLastMentor)
  const totalPages = Math.ceil(sortedMentors.length / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({
      top: document.getElementById("results-section").offsetTop - 120,
      behavior: "smooth",
    })
  }

  const activeFilterCount =
    selectedFilters.categories.length +
    selectedFilters.skills.length +
    (selectedFilters.price ? 1 : 0) +
    (selectedFilters.rating ? 1 : 0) +
    (selectedFilters.availability ? 1 : 0) +
    (selectedFilters.experience ? 1 : 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Trending domains section */}
      <div className="bg-gray-50 py-8 px-6 mt-20">
        <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold text-gray-800 whitespace-nowrap mb-5">Trending Domains</h2>
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:flex flex-wrap gap-3">
              {trendingDomains.map((domain, index) => (
                <button
                  key={index}
                  onClick={() => {
                    // Add domain to search query to filter mentors
                    setSearchQuery(domain.name)
                    // Scroll to results
                    document.getElementById("results-section").scrollIntoView({ behavior: "smooth", block: "start" })
                  }}
                  className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50">{domain.icon}</div>
                  <span className="font-medium">{domain.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-gray-50 px-4 md:px-6 pb-12">
        <div className="max-w-6xl mx-auto" id="results-section">
          {/* Search and Filter bar */}
          <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
            <div className="flex flex-col md:flex-row items-stretch">
              {/* Search input */}
              <div className="flex-grow p-4">
                <div className="relative flex items-center">
                  <div className="absolute left-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name, role, skills, or expertise..."
                    className="w-full py-3 pl-12 pr-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-gray-800"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Filter button */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center justify-center gap-2 p-4 md:px-6 md:w-44 md:border-l border-gray-100 transition-colors ${
                  isFilterOpen ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
                }`}
              >
                <Sliders className="w-5 h-5" />
                <span className="font-medium">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort button */}
              <div className="relative border-t md:border-t-0 md:border-l border-gray-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsSortOpen(!isSortOpen)
                  }}
                  className="flex items-center justify-center gap-2 p-4 md:px-6 md:w-44 hover:bg-gray-50 transition-colors w-full"
                >
                  <ArrowUpDown className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">Sort</span>
                </button>

                {/* Sort dropdown menu */}
                {isSortOpen && (
                  <div className="absolute right-0 mt-1 z-20 bg-white rounded-xl shadow-xl py-2 w-64 border border-gray-100">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center justify-between"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSortBy(option.value)
                          setIsSortOpen(false)
                        }}
                      >
                        <span className={sortBy === option.value ? "text-blue-600 font-medium" : ""}>
                          {option.label}
                        </span>
                        {sortBy === option.value && <Check className="w-4 h-4 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Active filters strip */}
            {activeFilterCount > 0 && (
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500 mr-1">Active filters:</span>

                {selectedFilters.categories.map((category) => (
                  <div
                    key={`category-${category}`}
                    className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-100"
                  >
                    <span className="font-medium">{category}</span>
                    <button
                      onClick={() => removeFilter("categories", category)}
                      className="ml-1 hover:bg-blue-100 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {selectedFilters.skills.map((skill) => (
                  <div
                    key={`skill-${skill}`}
                    className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-100"
                  >
                    <span className="font-medium">{skill}</span>
                    <button
                      onClick={() => removeFilter("skills", skill)}
                      className="ml-1 hover:bg-blue-100 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {Object.entries(selectedFilters).map(([filterType, value]) => {
                  if (!value || Array.isArray(value)) return null

                  let label = ""
                  if (filterType === "price") {
                    label = filterOptions.price.find((p) => p.value === value)?.label
                  } else if (filterType === "rating") {
                    label = filterOptions.rating.find((r) => r.value === value)?.label
                  } else if (filterType === "availability") {
                    label = filterOptions.availability.find((a) => a.value === value)?.label
                  } else if (filterType === "experience") {
                    label = filterOptions.experience.find((e) => e.value === value)?.label
                  }

                  if (!label) return null

                  return (
                    <div
                      key={`${filterType}-${value}`}
                      className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-100"
                    >
                      <span className="font-medium">{label}</span>
                      <button
                        onClick={() => removeFilter(filterType, value)}
                        className="ml-1 hover:bg-blue-100 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )
                })}

                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium underline ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Filter panels */}
            {isFilterOpen && (
              <div className="p-6 border-t border-gray-100 filter-panel">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
                  {/* Categories */}
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2 text-gray-800">
                      <Tag className="w-4 h-4 text-blue-600" />
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.categories.map((category) => (
                        <button
                          key={category}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            selectedFilters.categories.includes(category)
                              ? "bg-blue-600 text-white shadow-sm"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                          onClick={() => handleFilterToggle("categories", category)}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2 text-gray-800">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.skills.slice(0, 8).map((skill) => (
                        <button
                          key={skill}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            selectedFilters.skills.includes(skill)
                              ? "bg-blue-600 text-white shadow-sm"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                          onClick={() => handleFilterToggle("skills", skill)}
                        >
                          {skill}
                        </button>
                      ))}
                      {filterOptions.skills.length > 8 && (
                        <button className="text-blue-600 text-sm hover:underline">
                          +{filterOptions.skills.length - 8} more
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2 text-gray-800">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      Price Range
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.price.map((price) => (
                        <button
                          key={price.value}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            selectedFilters.price === price.value
                              ? "bg-blue-600 text-white shadow-sm"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                          onClick={() => handleFilterToggle("price", price.value)}
                        >
                          {price.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2 text-gray-800">
                      <Star className="w-4 h-4 text-blue-600" />
                      Rating
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.rating.map((rating) => (
                        <button
                          key={rating.value}
                          className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition-all ${
                            selectedFilters.rating === rating.value
                              ? "bg-blue-600 text-white shadow-sm"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                          onClick={() => handleFilterToggle("rating", rating.value)}
                        >
                          {rating.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2 text-gray-800">
                      <Clock className="w-4 h-4 text-blue-600" />
                      Availability
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.availability.map((option) => (
                        <button
                          key={option.value}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            selectedFilters.availability === option.value
                              ? "bg-blue-600 text-white shadow-sm"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                          onClick={() => handleFilterToggle("availability", option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2 text-gray-800">
                      <Award className="w-4 h-4 text-blue-600" />
                      Experience
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.experience.map((option) => (
                        <button
                          key={option.value}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            selectedFilters.experience === option.value
                              ? "bg-blue-600 text-white shadow-sm"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                          onClick={() => handleFilterToggle("experience", option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results count and pagination info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{sortedMentors.length} mentors found</h2>
              <p className="text-sm text-gray-500">
                Showing {indexOfFirstMentor + 1}-{Math.min(indexOfLastMentor, sortedMentors.length)} of{" "}
                {sortedMentors.length}
              </p>
            </div>

            {/* Mobile sort option (only visible on small screens) */}
            <div className="sm:hidden mt-4 w-full">
              <select
                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    Sort: {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mentor cards grid */}
          {currentMentors.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="flex flex-col items-center justify-center py-12">
                <Search className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No mentors found </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  We couldn't find any mentors matching your filters. Try adjusting your search criteria or clear all
                  filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentMentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-lg border ${
                    currentPage === 1
                      ? "border-gray-200 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => handlePageChange(number)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                      currentPage === number ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-lg border ${
                    currentPage === totalPages
                      ? "border-gray-200 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Call to action for mentors */}
          <MentorBanner />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default FindMentorsPage
