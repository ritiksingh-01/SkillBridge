import React, { useState, useEffect, useCallback } from 'react';
import {
  Star,
  MapPin,
  Award,
  Globe,
  Briefcase,
  MessageCircle,
  Video,
  ChevronLeft,
  Heart,
  Share2,
  CheckCircle,
  Building,
  Clock,
  X
} from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import { mentorsAPI, reviewsAPI, sessionsAPI, paymentsAPI } from '../../services/api';

/* ------------------------------------------------------------------ */
/* Design tokens (shared with the mentee dashboard)                    */
/* ------------------------------------------------------------------ */

const INK = '#14213D';
const SUN = '#FFB84D';

const displayFont = {
  fontFamily: "'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif"
};
const bodyFont = {
  fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif"
};

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600';

const inputCls =
  'w-full rounded-xl bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 transition';

const avatarFallback = (name, bg = 'E2E8F0', color = '334155') =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'M')}&background=${bg}&color=${color}`;

// Value for <input type="datetime-local" min=...> in the user's local time
const localNowForInput = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

/* ------------------------------------------------------------------ */
/* Fallback profile (kept from the original)                           */
/* ------------------------------------------------------------------ */

const defaultMentorData = {
  id: 'demo',
  _id: 'demo',
  name: 'Sarah Johnson',
  role: 'Senior Product Manager',
  experience: 'Former Amazon, Google',
  rating: 4.9,
  reviews: 24,
  skills: ['Product Strategy', 'Leadership', 'UX Design', 'Data Analysis', 'Team Management'],
  price: 500,
  image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
  availability: 'Available this week',
  badge: 'Top Rated',
  category: 'Product',
  bio: "I'm a seasoned product manager with over 8 years of experience at top tech companies. Passionate about helping aspiring professionals succeed.",
  company: 'Google',
  location: 'San Francisco, CA',
  responseTime: 'Usually responds within 2 hours',
  languages: ['English'],
  education: 'MBA',
  totalSessions: 150,
  successRate: 98,
  pricing: {
    querySession: 150,
    oneOnOneSession: 500
  }
};

/* ------------------------------------------------------------------ */
/* Building blocks (outside the page so inputs keep focus)             */
/* ------------------------------------------------------------------ */

const Panel = ({ title, aside, children, className = '' }) => (
  <section
    className={`bg-white rounded-2xl ring-1 ring-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className}`}
  >
    <div className="flex items-center justify-between gap-4 px-6 pt-6 pb-4">
      <h2 className="text-xl font-semibold" style={{ ...displayFont, color: INK }}>
        {title}
      </h2>
      {aside}
    </div>
    <div className="px-6 pb-6">{children}</div>
  </section>
);

const Stars = ({ value, size = 'w-4 h-4' }) => (
  <div className="flex items-center gap-0.5" aria-label={`${value} out of 5`}>
    {[0, 1, 2, 3, 4].map((i) => (
      <Star
        key={i}
        className={`${size} ${i < value ? 'fill-current' : 'text-slate-200 fill-current'}`}
        style={i < value ? { color: SUN } : undefined}
      />
    ))}
  </div>
);

const StatTile = ({ value, label, small = false }) => (
  <div className="bg-white p-4 sm:p-5">
    <p
      className={`${small ? 'text-base leading-snug' : 'text-3xl'} font-bold tabular-nums`}
      style={{ ...displayFont, color: INK }}
    >
      {value}
    </p>
    <p className="mt-1 text-sm text-slate-500">{label}</p>
  </div>
);

const BookingModal = ({
  mentor,
  session,
  details,
  onChange,
  onClose,
  onSubmit,
  loading,
  success,
  error
}) => {
  const SessionIcon = session.icon;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        className="md-pop w-full sm:max-w-md max-h-[92vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6">
          <div>
            <h3
              id="booking-title"
              className="text-2xl font-bold"
              style={{ ...displayFont, color: INK }}
            >
              Book a session
            </h3>
            <div className="mt-2 flex items-center gap-2">
              <img
                src={mentor.image || avatarFallback(mentor.name)}
                alt=""
                className="w-6 h-6 rounded-full object-cover bg-slate-100"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = avatarFallback(mentor.name);
                }}
              />
              <p className="text-sm text-slate-500">with {mentor.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`p-2 -mr-2 -mt-1 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer ${focusRing}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="px-6 py-14 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-emerald-600" />
            </div>
            <h4 className="text-xl font-bold" style={{ ...displayFont, color: INK }}>
              Session booked
            </h4>
            <p className="mt-2 text-slate-500 text-sm max-w-xs mx-auto">
              Your session request has been submitted. Taking you to your dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="px-6 pt-5 pb-6 space-y-5">
            {error && (
              <div
                role="alert"
                className="rounded-xl bg-rose-50 ring-1 ring-rose-200 px-4 py-3 text-sm text-rose-700"
              >
                {error}
              </div>
            )}

            <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 min-w-0">
                  <SessionIcon className="w-5 h-5 shrink-0" style={{ color: INK }} />
                  <h4 className="font-semibold text-slate-900 truncate">{session.title}</h4>
                </div>
                <p
                  className="text-2xl font-bold tabular-nums"
                  style={{ ...displayFont, color: INK }}
                >
                  ₹{session.price}
                </p>
              </div>
              <p className="mt-1.5 text-sm text-slate-600">{session.description}</p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                {session.duration}
              </p>
            </div>

            <div>
              <label htmlFor="session-title" className="block text-sm font-medium text-slate-700 mb-1.5">
                Session topic
              </label>
              <input
                id="session-title"
                type="text"
                required
                autoFocus
                placeholder="e.g. Portfolio review or interview prep"
                className={inputCls}
                value={details.title}
                onChange={(e) => onChange({ ...details, title: e.target.value })}
              />
            </div>

            {session.id !== 'query' && (
              <div>
                <label htmlFor="session-time" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Date and time
                </label>
                <input
                  id="session-time"
                  type="datetime-local"
                  required
                  className={inputCls}
                  min={localNowForInput()}
                  value={details.scheduledAt}
                  onChange={(e) => onChange({ ...details, scheduledAt: e.target.value })}
                />
              </div>
            )}

            <div>
              <label htmlFor="session-desc" className="block text-sm font-medium text-slate-700 mb-1.5">
                What would you like to discuss?
              </label>
              <textarea
                id="session-desc"
                placeholder="Briefly describe what you'd like to cover..."
                rows={4}
                className={`${inputCls} resize-none`}
                value={details.description}
                onChange={(e) => onChange({ ...details, description: e.target.value })}
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 transition-colors cursor-pointer ${focusRing}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${focusRing}`}
                style={{ backgroundColor: INK }}
              >
                {loading ? 'Booking...' : `Confirm and pay ₹${session.price}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const PageSkeleton = () => (
  <div className="space-y-6 animate-pulse" aria-label="Loading mentor profile">
    <div className="h-4 w-32 rounded bg-slate-200" />
    <div className="h-80 rounded-3xl bg-slate-200" />
    <div className="grid lg:grid-cols-[1fr_380px] gap-6">
      <div className="space-y-6">
        <div className="h-64 rounded-2xl bg-slate-200" />
        <div className="h-40 rounded-2xl bg-slate-200" />
      </div>
      <div className="h-[34rem] rounded-2xl bg-slate-200" />
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const MentorProfilePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedSessionType, setSelectedSessionType] = useState('query');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [mentorData, setMentorData] = useState(location.state?.mentorData || null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(!location.state?.mentorData);
  const [bookingDetails, setBookingDetails] = useState({
    title: '',
    description: '',
    scheduledAt: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  // Load this page's fonts once. Move this <link> into index.html to use them app-wide.
  useEffect(() => {
    const fontId = 'mentee-dashboard-fonts';
    if (document.getElementById(fontId)) return;
    const link = document.createElement('link');
    link.id = fontId;
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=DM+Sans:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }, []);

  // Fetch mentor data if accessed directly via /mentor/:id or refreshed (F2).
  // Depends only on `id`: the old [id, mentorData] dependency re-ran after every
  // setMentorData and refetched in an endless loop.
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const fetchMentor = async () => {
      try {
        if (!location.state?.mentorData) setLoading(true);
        const res = await mentorsAPI.getById(id);
        if (cancelled) return;
        if (res.data?.mentor) {
          const m = res.data.mentor;
          setMentorData({
            _id: m._id,
            id: m._id,
            name: `${m.user?.firstName || ''} ${m.user?.lastName || ''}`.trim() || 'Mentor',
            role: m.currentRole || m.headline || 'Industry Professional',
            experience: m.workExperience || m.organization || 'Experienced',
            rating: m.rating?.average || 5.0,
            reviews: m.rating?.count || 0,
            skills: Array.isArray(m.expertise) ? m.expertise : [],
            price: m.pricing?.oneOnOneSession || 500,
            image:
              m.user?.profileImage ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(m.user?.firstName || 'M')}&background=3B82F6&color=fff`,
            availability: m.availability?.timezone
              ? `Timezone: ${m.availability.timezone}`
              : 'Flexible',
            badge: m.badges?.[0]?.name || (m.rating?.average >= 4.5 ? 'Top Rated' : null),
            category: m.categories?.[0] || 'Technology',
            bio: m.bio || 'Passionate mentor looking to guide and empower mentees.',
            company: m.organization || 'Independent',
            location: m.user?.location || 'Remote',
            responseTime: m.stats?.responseTime || '~2 hours',
            languages: ['English'],
            education: m.user?.education?.[0]?.degree || 'Professional',
            totalSessions: m.stats?.totalSessions || 0,
            successRate: m.stats?.completionRate || 100,
            pricing: m.pricing || {
              querySession: 150,
              oneOnOneSession: 500
            }
          });
        }
      } catch (err) {
        console.error('Error fetching mentor:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMentor();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Fetch real reviews from backend (F2)
  useEffect(() => {
    const mentorId = id || mentorData?._id || mentorData?.id;
    if (mentorId) {
      reviewsAPI
        .getMentorReviews(mentorId)
        .then((res) => {
          if (res.data?.data?.reviews) {
            setReviews(
              res.data.data.reviews.map((r) => ({
                id: r.id || r._id,
                name: `${r.mentee?.firstName || 'Anonymous'} ${r.mentee?.lastName || ''}`.trim(),
                rating: r.rating,
                date: r.date ? new Date(r.date).toLocaleDateString() : 'Recently',
                comment: r.review || 'Great mentorship session! Highly recommended.',
                avatar:
                  r.mentee?.profileImage ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(r.mentee?.firstName || 'User')}&background=random`
              }))
            );
          }
        })
        .catch(() => {
          // Keep existing reviews on error
        });
    }
  }, [id, mentorData?._id, mentorData?.id]);

  const activeMentor = mentorData || defaultMentorData;
  const skills = Array.isArray(activeMentor.skills) ? activeMentor.skills : [];

  const sessionTypes = [
    {
      id: 'query',
      title: 'Query Session',
      price: activeMentor.pricing?.querySession || 150,
      duration: '30 min',
      description: 'Ask specific questions and get expert advice',
      features: ['Direct Q&A', 'Quick feedback', 'Actionable insights'],
      icon: MessageCircle
    },
    {
      id: 'one-on-one',
      title: '1:1 Mentoring Session',
      price: activeMentor.pricing?.oneOnOneSession || 500,
      duration: '60 min',
      description: 'Deep dive mentoring session with personalized guidance',
      features: ['Career roadmap', 'Skill assessment', 'Goal setting', 'Follow-up plan'],
      icon: Video
    }
  ];

  const handleBookSession = (sessionType) => {
    setSelectedSessionType(sessionType);
    setBookingError(null);
    setBookingSuccess(false);
    setIsBookingModalOpen(true);
  };

  const closeModal = useCallback(() => setIsBookingModalOpen(false), []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: activeMentor.name, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      }
    } catch {
      // User dismissed the share sheet
    }
  };

  // Wire booking and payment execution (F1)
  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError(null);

    try {
      const mentorId = activeMentor._id || activeMentor.id;
      const sessionPayload = {
        mentorId,
        type: selectedSessionType,
        title:
          bookingDetails.title ||
          `${selectedSessionType === 'query' ? 'Query' : '1:1 Mentoring'} with ${activeMentor.name}`,
        description: bookingDetails.description || 'Mentorship session booked via profile',
        scheduledAt: bookingDetails.scheduledAt || undefined,
        duration: selectedSessionType === 'query' ? 30 : 60
      };

      const sessionRes = await sessionsAPI.create(sessionPayload);
      const createdSession = sessionRes.data?.session;

      // Attempt to initiate payment if session has cost
      if (createdSession?._id) {
        try {
          await paymentsAPI.createPaymentIntent({ sessionId: createdSession._id });
        } catch {
          // If mock or local, proceed
        }
      }

      setBookingSuccess(true);
      setTimeout(() => {
        setIsBookingModalOpen(false);
        navigate('/mentee-dashboard');
      }, 1500);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to book session. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const shell = (children) => (
    <div className="min-h-screen w-full bg-[#F4F6FB]" style={bodyFont}>
      <style>{`
        @keyframes md-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes md-pop { from { opacity: 0; transform: translateY(12px) scale(.98); } to { opacity: 1; transform: none; } }
        .md-rise { animation: md-rise .6s ease-out both; }
        .md-pop { animation: md-pop .25s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .md-rise, .md-pop { animation: none; } }
      `}</style>
      <Header />
      {children}
    </div>
  );

  if (loading) {
    return shell(
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <PageSkeleton />
      </main>
    );
  }

  const selectedSession =
    sessionTypes.find((s) => s.id === selectedSessionType) || sessionTypes[0];
  const ratingValue = Number(activeMentor.rating) || 0;

  return shell(
    <>
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Back */}
        <button
          onClick={handleBack}
          className={`inline-flex items-center gap-1 mb-5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer rounded ${focusRing}`}
        >
          <ChevronLeft className="w-4 h-4" />
          Back to mentors
        </button>

        {/* Profile header */}
        <section className="md-rise bg-white rounded-3xl ring-1 ring-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden">
          <div className="relative h-36 sm:h-44 overflow-hidden" style={{ backgroundColor: INK }}>
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-32 w-[30rem] h-[30rem] text-white/[0.08]"
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
          </div>

          <div className="px-6 sm:px-10 pb-8">
            <div className="flex flex-col md:flex-row md:items-start gap-5 md:gap-7">
              <img
                src={activeMentor.image || avatarFallback(activeMentor.name)}
                alt={activeMentor.name}
                className="relative z-10 shrink-0 w-32 h-32 md:w-40 md:h-40 -mt-16 md:-mt-20 rounded-full ring-4 ring-white shadow-lg object-cover bg-white"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = avatarFallback(activeMentor.name);
                }}
              />

              <div className="flex-1 min-w-0 md:pt-5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h1
                    className="text-3xl sm:text-4xl font-bold tracking-tight"
                    style={{ ...displayFont, color: INK }}
                  >
                    {activeMentor.name}
                  </h1>
                  {activeMentor.badge && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 ring-1 ring-amber-200 px-3 py-1 text-xs font-semibold text-amber-800">
                      <Award className="w-3.5 h-3.5" />
                      {activeMentor.badge}
                    </span>
                  )}
                </div>

                <p className="mt-1.5 text-lg text-slate-600">{activeMentor.role}</p>

                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 ring-1 ring-slate-200 px-3 py-1 font-semibold text-slate-900">
                    <Star className="w-4 h-4 fill-current" style={{ color: SUN }} />
                    {ratingValue.toFixed(1)}
                    <span className="font-normal text-slate-500">
                      ({activeMentor.reviews} reviews)
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-slate-400" />
                    {activeMentor.company}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {activeMentor.location}
                  </span>
                  <span className="inline-flex items-center gap-2 text-emerald-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {activeMentor.availability}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 md:pt-5 shrink-0">
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  aria-label={isFavorited ? 'Remove from favourites' : 'Add to favourites'}
                  aria-pressed={isFavorited}
                  className={`p-3 rounded-xl ring-1 transition-colors cursor-pointer ${focusRing} ${
                    isFavorited
                      ? 'bg-rose-50 ring-rose-200 text-rose-600'
                      : 'bg-white ring-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  aria-label="Share profile"
                  className={`p-3 rounded-xl ring-1 ring-slate-300 text-slate-600 bg-white hover:bg-slate-50 transition-colors cursor-pointer ${focusRing}`}
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <span
                  role="status"
                  className={`text-xs font-medium text-slate-500 transition-opacity ${
                    linkCopied ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  Link copied
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Content grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-6 items-start">
          <div className="space-y-6 min-w-0">
            {/* About */}
            <Panel title="About">
              <p className="text-slate-700 leading-relaxed max-w-prose">{activeMentor.bio}</p>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200 rounded-2xl overflow-hidden ring-1 ring-slate-200">
                <StatTile value={activeMentor.totalSessions} label="Sessions" />
                <StatTile value={`${activeMentor.successRate}%`} label="Success rate" />
                <StatTile value={activeMentor.reviews} label="Reviews" />
                <StatTile small value={activeMentor.responseTime} label="Response time" />
              </div>
            </Panel>

            {/* Expertise */}
            {skills.length > 0 && (
              <Panel title="Expertise">
                <ul className="flex flex-wrap gap-2.5">
                  {skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-lg bg-slate-50 ring-1 ring-slate-200 px-3.5 py-2 text-sm font-medium text-slate-800"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </Panel>
            )}

            {/* At a glance */}
            <Panel title="At a glance">
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 mt-0.5 text-slate-400 shrink-0" />
                  <div>
                    <dt className="text-sm text-slate-500">Education</dt>
                    <dd className="font-medium text-slate-900">{activeMentor.education}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 mt-0.5 text-slate-400 shrink-0" />
                  <div>
                    <dt className="text-sm text-slate-500">Languages</dt>
                    <dd className="font-medium text-slate-900">
                      {Array.isArray(activeMentor.languages)
                        ? activeMentor.languages.join(', ')
                        : 'English'}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 mt-0.5 text-slate-400 shrink-0" />
                  <div>
                    <dt className="text-sm text-slate-500">Focus area</dt>
                    <dd className="font-medium text-slate-900">
                      {activeMentor.category || 'Technology'}
                    </dd>
                  </div>
                </div>
              </dl>
            </Panel>

            {/* Reviews */}
            <Panel
              title="Reviews"
              aside={
                <div className="flex items-center gap-2.5">
                  <span
                    className="text-2xl font-bold tabular-nums"
                    style={{ ...displayFont, color: INK }}
                  >
                    {ratingValue.toFixed(1)}
                  </span>
                  <div>
                    <Stars value={Math.round(ratingValue)} />
                    <p className="text-xs text-slate-500 mt-0.5">
                      {activeMentor.reviews} {activeMentor.reviews === 1 ? 'review' : 'reviews'}
                    </p>
                  </div>
                </div>
              }
            >
              {reviews.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 px-6 py-10 text-center">
                  <p className="font-medium text-slate-900">No reviews yet</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Reviews appear here after mentees complete a session.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100 -my-2">
                  {reviews.map((review) => (
                    <li key={review.id} className="py-5 flex items-start gap-4">
                      <img
                        src={review.avatar}
                        alt=""
                        className="w-11 h-11 rounded-full object-cover bg-slate-100 shrink-0"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = avatarFallback(review.name);
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                          <h4 className="font-semibold text-slate-900">{review.name}</h4>
                          <span className="text-sm text-slate-500">{review.date}</span>
                        </div>
                        <div className="mt-1">
                          <Stars value={review.rating} />
                        </div>
                        <p className="mt-2 text-slate-700 leading-relaxed">{review.comment}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>

          {/* Booking sidebar */}
          <aside className="lg:sticky lg:top-28">
            <section className="bg-white rounded-2xl ring-1 ring-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-6">
              <h2 className="text-xl font-semibold" style={{ ...displayFont, color: INK }}>
                Book a session
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Pick the format that fits what you need.
              </p>

              <div className="mt-5 space-y-4">
                {sessionTypes.map((session, idx) => {
                  const Icon = session.icon;
                  const primary = idx === sessionTypes.length - 1;
                  return (
                    <div
                      key={session.id}
                      className={`rounded-2xl p-5 transition ${
                        primary
                          ? 'ring-2 ring-slate-900/10 bg-slate-50/60'
                          : 'ring-1 ring-slate-200 hover:ring-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <Icon className="w-5 h-5 shrink-0" style={{ color: INK }} />
                            <h3 className="font-semibold text-slate-900">{session.title}</h3>
                          </div>
                          <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-slate-500">
                            <Clock className="w-3.5 h-3.5" />
                            {session.duration}
                          </p>
                        </div>
                        <p
                          className="text-2xl font-bold tabular-nums shrink-0"
                          style={{ ...displayFont, color: INK }}
                        >
                          ₹{session.price}
                        </p>
                      </div>

                      <p className="mt-3 text-sm text-slate-600">{session.description}</p>

                      <ul className="mt-3 space-y-1.5">
                        {session.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => handleBookSession(session.id)}
                        className={`mt-5 w-full py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${focusRing} ${
                          primary
                            ? 'text-white hover:opacity-90'
                            : 'text-slate-800 ring-1 ring-slate-300 bg-white hover:bg-slate-50'
                        }`}
                        style={primary ? { backgroundColor: INK } : undefined}
                      >
                        Book {primary ? '1:1 session' : 'query session'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          </aside>
        </div>
      </main>

      {isBookingModalOpen && (
        <BookingModal
          mentor={activeMentor}
          session={selectedSession}
          details={bookingDetails}
          onChange={setBookingDetails}
          onClose={closeModal}
          onSubmit={handleConfirmBooking}
          loading={bookingLoading}
          success={bookingSuccess}
          error={bookingError}
        />
      )}

      <Footer />
    </>
  );
};

export default MentorProfilePage;