import { useState, useEffect, useRef, useCallback } from "react"
import {
  Search,
  ArrowUpDown,
  Sliders,
  Check,
  X,
  Briefcase,
  Book,
  Award,
  TrendingUp,
  Zap,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react"
import MentorCard from "../../Components/MentorCard"
import Footer from "../../Components/Footer"
import Header from "../../Components/Header"
import MentorBanner from "../../Banners/MentorBanner"
import { mentorsAPI } from "../../services/api"

/* ------------------------------------------------------------------ */
/* Design tokens (shared with the other pages)                         */
/* ------------------------------------------------------------------ */

const INK = "#14213D"

const displayFont = {
  fontFamily: "'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif",
}
const bodyFont = {
  fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
}

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"

/* ------------------------------------------------------------------ */
/* Data config (unchanged)                                             */
/* ------------------------------------------------------------------ */

// Trending domains
const trendingDomains = [
  { name: "CV Review", icon: Book },
  { name: "MBA Preparation", icon: Award },
  { name: "Case Competition", icon: TrendingUp },
  { name: "Placement Support", icon: Briefcase },
  { name: "Technical Interview", icon: Zap },
]

// Realistic filter options matching database prices (F3)
const filterOptions = {
  categories: ["Technology", "Business", "Design", "Marketing", "Data", "Finance", "Leadership", "Product", "Engineering"],
  skills: [
    "Product Strategy",
    "UX Design",
    "Software Architecture",
    "Team Management",
    "Leadership",
    "Growth Strategy",
    "Brand Building",
    "Digital Marketing",
    "User Research",
    "Design Systems",
    "Technical Leadership",
    "System Architecture",
    "Cloud Strategy",
    "AI/ML",
    "Analytics",
  ],
  price: [
    { label: "Under ₹300", value: "under300" },
    { label: "₹300 - ₹500", value: "300-500" },
    { label: "₹500 - ₹1000", value: "500-1000" },
    { label: "₹1000+", value: "over1000" },
  ],
  rating: [
    { label: "4.5+ stars", value: 4.5 },
    { label: "4.0+ stars", value: 4.0 },
    { label: "3.5+ stars", value: 3.5 },
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

const emptyFilters = {
  categories: [],
  skills: [],
  price: null,
  rating: null,
  availability: null,
  experience: null,
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const getSkills = (m) =>
  Array.isArray(m.expertise) ? m.expertise : Array.isArray(m.skills) ? m.skills : []
const getPrice = (m) => m.pricing?.oneOnOneSession ?? m.price ?? 500
const getRating = (m) => {
  const r = m.rating?.average ?? m.rating
  return typeof r === "number" ? r : 0
}
const getReviews = (m) => Number(m.rating?.count ?? m.reviews ?? 0) || 0

// 1 ... 4 5 6 ... 12
const getPageItems = (total, current) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const items = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) items.push("gap-start")
  for (let i = start; i <= end; i += 1) items.push(i)
  if (end < total - 1) items.push("gap-end")
  items.push(total)
  return items
}

/* ------------------------------------------------------------------ */
/* Building blocks (outside the page so they don't remount)            */
/* ------------------------------------------------------------------ */

const FilterChip = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition cursor-pointer ${focusRing} ${
      active
        ? "text-white"
        : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-900"
    }`}
    style={active ? { backgroundColor: INK } : undefined}
  >
    {children}
  </button>
)

const FilterGroup = ({ title, children }) => (
  <div>
    <h3 className="text-sm font-semibold text-slate-900 mb-3">{title}</h3>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
)

const ActiveChip = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-white ring-1 ring-slate-200 pl-3 pr-1.5 py-1 text-sm font-medium text-slate-800">
    {label}
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove filter ${label}`}
      className={`p-0.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer ${focusRing}`}
    >
      <X className="w-3.5 h-3.5" />
    </button>
  </span>
)

const CardsSkeleton = () => (
  <div
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse"
    aria-label="Loading mentors"
  >
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="h-72 rounded-2xl bg-slate-200" />
    ))}
  </div>
)

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const FindMentorsPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState(emptyFilters)
  const [sortBy, setSortBy] = useState("relevance")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [showAllSkills, setShowAllSkills] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const sortRef = useRef(null)

  // Load this page's fonts once. Move this <link> into index.html to use them app-wide.
  useEffect(() => {
    const fontId = "mentee-dashboard-fonts"
    if (document.getElementById(fontId)) return
    const link = document.createElement("link")
    link.id = fontId
    link.rel = "stylesheet"
    link.href =
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=DM+Sans:wght@400;500;600&display=swap"
    document.head.appendChild(link)
  }, [])

  const loadMentors = useCallback(() => {
    setLoading(true)
    setError(null)
    // Request up to 100 mentors so local pagination and filtering works smoothly (F3)
    mentorsAPI
      .getAll({ limit: 100 })
      .then((res) => {
        if (res.data && Array.isArray(res.data.mentors)) {
          setMentors(res.data.mentors)
        } else {
          setMentors([])
        }
      })
      .catch(() => {
        setError("Failed to load mentors")
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadMentors()
  }, [loadMentors])

  // Go back to page 1 whenever the result set changes, otherwise you can land on an empty page
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedFilters, sortBy])

  const handleFilterToggle = (filterType, value) => {
    setSelectedFilters((prev) => {
      if (!prev) return prev
      if (filterType === "categories" || filterType === "skills") {
        const currentSelected = [...prev[filterType]]
        if (currentSelected.includes(value)) {
          return {
            ...prev,
            [filterType]: currentSelected.filter((item) => item !== value),
          }
        }
        return {
          ...prev,
          [filterType]: [...currentSelected, value],
        }
      }
      if (prev[filterType] === value) {
        return {
          ...prev,
          [filterType]: null,
        }
      }
      return {
        ...prev,
        [filterType]: value,
      }
    })
  }

  const removeFilter = (filterType, value) => {
    setSelectedFilters((prev) => {
      if (!prev) return prev
      if (filterType === "categories" || filterType === "skills") {
        return {
          ...prev,
          [filterType]: prev[filterType].filter((item) => item !== value),
        }
      }
      return {
        ...prev,
        [filterType]: null,
      }
    })
  }

  const clearAllFilters = () => {
    setSelectedFilters(emptyFilters)
    setSearchQuery("")
  }

  // Close the sort menu on outside click or Escape.
  // (The filter panel is a normal toggle now. The old outside-click handler
  // closed it on mousedown and the Filters button reopened it on click,
  // so it could never be closed with the button.)
  useEffect(() => {
    if (!isSortOpen) return undefined
    const onDown = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setIsSortOpen(false)
    }
    const onKey = (e) => {
      if (e.key === "Escape") setIsSortOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [isSortOpen])

  const filteredMentors = mentors.filter((mentor) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const firstName = mentor.user?.firstName || ""
      const lastName = mentor.user?.lastName || ""
      const matchesName = (firstName + " " + lastName).toLowerCase().includes(query)
      const matchesRole = (mentor.currentRole || mentor.headline || "").toLowerCase().includes(query)
      const matchesSkills = getSkills(mentor).some((skill) =>
        String(skill).toLowerCase().includes(query)
      )
      if (!(matchesName || matchesRole || matchesSkills)) {
        return false
      }
    }
    if (
      selectedFilters.categories.length > 0 &&
      !selectedFilters.categories.some((cat) => (mentor.categories || []).includes(cat))
    ) {
      return false
    }
    if (
      selectedFilters.skills.length > 0 &&
      !getSkills(mentor).some((skill) => selectedFilters.skills.includes(skill))
    ) {
      return false
    }
    if (selectedFilters.price) {
      const price = getPrice(mentor)
      if (selectedFilters.price === "under300" && price >= 300) return false
      if (selectedFilters.price === "300-500" && (price < 300 || price > 500)) return false
      if (selectedFilters.price === "500-1000" && (price < 500 || price > 1000)) return false
      if (selectedFilters.price === "over1000" && price <= 1000) return false
    }
    if (selectedFilters.rating) {
      if (getRating(mentor) < selectedFilters.rating) return false
    }
    return true
  })

  const sortedMentors = [...filteredMentors].sort((a, b) => {
    switch (sortBy) {
      case "price_asc":
        return getPrice(a) - getPrice(b)
      case "price_desc":
        return getPrice(b) - getPrice(a)
      case "rating":
        return getRating(b) - getRating(a)
      case "popular":
        return getReviews(b) - getReviews(a) // Fixed NaN bug (F3)
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
    const target = document.getElementById("results-section")
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 120,
        behavior: "smooth",
      })
    }
  }

  const activeFilterCount =
    selectedFilters.categories.length +
    selectedFilters.skills.length +
    (selectedFilters.price ? 1 : 0) +
    (selectedFilters.rating ? 1 : 0) +
    (selectedFilters.availability ? 1 : 0) +
    (selectedFilters.experience ? 1 : 0)

  const priceLabel = filterOptions.price.find((p) => p.value === selectedFilters.price)?.label
  const ratingLabel = filterOptions.rating.find((r) => r.value === selectedFilters.rating)?.label
  const currentSortLabel = sortOptions.find((o) => o.value === sortBy)?.label
  const visibleSkills = showAllSkills ? filterOptions.skills : filterOptions.skills.slice(0, 8)

  const goToResults = () => {
    const el = document.getElementById("results-section")
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="min-h-screen w-full bg-[#F4F6FB]" style={bodyFont}>
      <style>{`
        @keyframes md-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .md-rise { animation: md-rise .6s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .md-rise { animation: none; } }
      `}</style>

      <Header />

      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Hero with search and trending domains */}
        <section
          className="md-rise relative overflow-hidden rounded-3xl text-white"
          style={{ backgroundColor: INK }}
        >
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -right-28 -top-28 w-[34rem] h-[34rem] text-white/[0.08]"
            viewBox="0 0 400 400"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="200" cy="200" r="50" />
            <circle cx="200" cy="200" r="90" />
            <circle cx="200" cy="200" r="130" />
            <circle cx="200" cy="200" r="170" />
            <circle cx="200" cy="200" r="198" />
          </svg>

          <div className="relative p-6 sm:p-10 lg:p-12">
            <h1
              className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05] max-w-xl"
              style={displayFont}
            >
              Find a mentor who has been where you want to go
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-xl">
              Search by name, role or skill, then book a session that fits your schedule.
            </p>

            <div className="mt-7 max-w-2xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                aria-label="Search mentors"
                placeholder="Search by name, role, skills, or expertise"
                className="w-full rounded-2xl bg-white py-4 pl-12 pr-12 text-base text-slate-900 placeholder:text-slate-400 shadow-[0_16px_32px_-16px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-4 focus:ring-blue-500/40"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer ${focusRing}`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <span className="text-sm text-slate-300 mr-1">Trending</span>
              {trendingDomains.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    setSearchQuery(name)
                    goToResults()
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/20 hover:bg-white/15 px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <Icon className="w-4 h-4 text-slate-300" />
                  {name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Results */}
        <div id="results-section" className="mt-10">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
            <div>
              <h2
                className="text-2xl font-bold tracking-tight"
                style={{ ...displayFont, color: INK }}
              >
                {loading
                  ? "Loading mentors"
                  : `${sortedMentors.length} ${sortedMentors.length === 1 ? "mentor" : "mentors"}`}
              </h2>
              {!loading && !error && (
                <p className="text-sm text-slate-500 mt-0.5">
                  Showing {sortedMentors.length > 0 ? indexOfFirstMentor + 1 : 0} to{" "}
                  {Math.min(indexOfLastMentor, sortedMentors.length)} of {sortedMentors.length}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                aria-expanded={isFilterOpen}
                aria-controls="filter-panel"
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ring-1 transition-colors cursor-pointer ${focusRing} ${
                  isFilterOpen
                    ? "bg-slate-100 ring-slate-300 text-slate-900"
                    : "bg-white ring-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Sliders className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span
                    className="text-white text-xs rounded-full min-w-[1.25rem] h-5 px-1 flex items-center justify-center tabular-nums"
                    style={{ backgroundColor: INK }}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="relative" ref={sortRef}>
                <button
                  type="button"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  aria-haspopup="listbox"
                  aria-expanded={isSortOpen}
                  className={`inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 transition-colors cursor-pointer ${focusRing}`}
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span className="hidden sm:inline text-slate-500 font-medium">Sort:</span>
                  {currentSortLabel}
                </button>

                {isSortOpen && (
                  <div
                    role="listbox"
                    className="absolute right-0 mt-2 z-30 w-64 rounded-2xl bg-white py-2 ring-1 ring-slate-200 shadow-[0_16px_32px_-12px_rgba(15,23,42,0.3)]"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={sortBy === option.value}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                        onClick={() => {
                          setSortBy(option.value)
                          setIsSortOpen(false)
                        }}
                      >
                        <span
                          className={
                            sortBy === option.value
                              ? "font-semibold text-slate-900"
                              : "text-slate-600"
                          }
                        >
                          {option.label}
                        </span>
                        {sortBy === option.value && <Check className="w-4 h-4 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Filter panel */}
          {isFilterOpen && (
            <section
              id="filter-panel"
              className="mb-5 rounded-2xl bg-white ring-1 ring-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
            >
              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-8">
                <FilterGroup title="Categories">
                  {filterOptions.categories.map((category) => (
                    <FilterChip
                      key={category}
                      active={selectedFilters.categories.includes(category)}
                      onClick={() => handleFilterToggle("categories", category)}
                    >
                      {category}
                    </FilterChip>
                  ))}
                </FilterGroup>

                <div>
                  <FilterGroup title="Skills">
                    {visibleSkills.map((skill) => (
                      <FilterChip
                        key={skill}
                        active={selectedFilters.skills.includes(skill)}
                        onClick={() => handleFilterToggle("skills", skill)}
                      >
                        {skill}
                      </FilterChip>
                    ))}
                  </FilterGroup>
                  <button
                    type="button"
                    onClick={() => setShowAllSkills(!showAllSkills)}
                    className={`mt-3 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer rounded ${focusRing}`}
                  >
                    {showAllSkills ? "Show fewer skills" : `Show all ${filterOptions.skills.length} skills`}
                  </button>
                </div>

                <FilterGroup title="Price per session">
                  {filterOptions.price.map((price) => (
                    <FilterChip
                      key={price.value}
                      active={selectedFilters.price === price.value}
                      onClick={() => handleFilterToggle("price", price.value)}
                    >
                      {price.label}
                    </FilterChip>
                  ))}
                </FilterGroup>

                <FilterGroup title="Rating">
                  {filterOptions.rating.map((rating) => (
                    <FilterChip
                      key={rating.value}
                      active={selectedFilters.rating === rating.value}
                      onClick={() => handleFilterToggle("rating", rating.value)}
                    >
                      {rating.label}
                    </FilterChip>
                  ))}
                </FilterGroup>
              </div>

              <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={clearAllFilters}
                  disabled={activeFilterCount === 0 && !searchQuery}
                  className={`text-sm font-medium text-slate-600 hover:text-slate-900 hover:underline cursor-pointer disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed rounded ${focusRing}`}
                >
                  Clear all
                </button>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition cursor-pointer ${focusRing}`}
                  style={{ backgroundColor: INK }}
                >
                  Show {sortedMentors.length} {sortedMentors.length === 1 ? "mentor" : "mentors"}
                </button>
              </div>
            </section>
          )}

          {/* Active filters */}
          {activeFilterCount > 0 && (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {selectedFilters.categories.map((category) => (
                <ActiveChip
                  key={`category-${category}`}
                  label={category}
                  onRemove={() => removeFilter("categories", category)}
                />
              ))}
              {selectedFilters.skills.map((skill) => (
                <ActiveChip
                  key={`skill-${skill}`}
                  label={skill}
                  onRemove={() => removeFilter("skills", skill)}
                />
              ))}
              {selectedFilters.price && priceLabel && (
                <ActiveChip label={priceLabel} onRemove={() => removeFilter("price")} />
              )}
              {selectedFilters.rating && ratingLabel && (
                <ActiveChip label={ratingLabel} onRemove={() => removeFilter("rating")} />
              )}
              <button
                type="button"
                onClick={clearAllFilters}
                className={`ml-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer rounded ${focusRing}`}
              >
                Clear all
              </button>
            </div>
          )}

          {/* Mentor cards grid with key={mentor._id || mentor.id} (F3) */}
          {loading ? (
            <CardsSkeleton />
          ) : error ? (
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/70 px-6 py-16 text-center">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold" style={{ ...displayFont, color: INK }}>
                Couldn't load mentors
              </h3>
              <p className="text-sm text-slate-500 mt-1">{error}. Check your connection and try again.</p>
              <button
                type="button"
                onClick={loadMentors}
                className={`mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition cursor-pointer ${focusRing}`}
                style={{ backgroundColor: INK }}
              >
                Try again
              </button>
            </div>
          ) : currentMentors.length === 0 ? (
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/70 px-6 py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-slate-50 ring-1 ring-slate-200 flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold" style={{ ...displayFont, color: INK }}>
                No mentors found
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                We couldn't find any mentors matching your search. Try different keywords or remove some filters.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className={`mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition cursor-pointer ${focusRing}`}
                style={{ backgroundColor: INK }}
              >
                Clear search and filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentMentors.map((mentor) => (
                <MentorCard key={mentor._id || mentor.id} mentor={mentor} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-12 flex justify-center">
              <ul className="flex items-center gap-1.5">
                <li>
                  <button
                    type="button"
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className={`inline-flex items-center gap-1 h-10 pl-2.5 pr-3.5 rounded-xl text-sm font-medium ring-1 ring-slate-300 bg-white transition-colors ${focusRing} ${
                      currentPage === 1
                        ? "text-slate-300 cursor-not-allowed"
                        : "text-slate-700 hover:bg-slate-50 cursor-pointer"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>
                </li>

                {getPageItems(totalPages, currentPage).map((item) =>
                  typeof item === "string" ? (
                    <li key={item} className="w-8 text-center text-slate-400" aria-hidden="true">
                      ...
                    </li>
                  ) : (
                    <li key={item}>
                      <button
                        type="button"
                        onClick={() => handlePageChange(item)}
                        aria-label={`Page ${item}`}
                        aria-current={currentPage === item ? "page" : undefined}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium tabular-nums transition cursor-pointer ${focusRing} ${
                          currentPage === item
                            ? "text-white"
                            : "text-slate-700 hover:bg-white hover:ring-1 hover:ring-slate-200"
                        }`}
                        style={currentPage === item ? { backgroundColor: INK } : undefined}
                      >
                        {item}
                      </button>
                    </li>
                  )
                )}

                <li>
                  <button
                    type="button"
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className={`inline-flex items-center gap-1 h-10 pl-3.5 pr-2.5 rounded-xl text-sm font-medium ring-1 ring-slate-300 bg-white transition-colors ${focusRing} ${
                      currentPage === totalPages
                        ? "text-slate-300 cursor-not-allowed"
                        : "text-slate-700 hover:bg-slate-50 cursor-pointer"
                    }`}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </li>
              </ul>
            </nav>
          )}

          {/* Call to action for mentors */}
          <div className="mt-16">
            <MentorBanner />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default FindMentorsPage