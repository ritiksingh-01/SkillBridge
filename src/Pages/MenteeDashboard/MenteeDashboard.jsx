import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Calendar,
  CheckCircle,
  Clock,
  Video,
  Phone,
  Plus,
  Search,
  MessageSquare,
  AlertCircle,
  Star,
  User
} from 'lucide-react';
import Header from '../../Components/Header';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { sessionsAPI, mentorsAPI, notificationsAPI } from '../../services/api';

/* ------------------------------------------------------------------ */
/* Design tokens                                                       */
/* ------------------------------------------------------------------ */
// Ink   #14213D  deep navy, used for the hero and key numerals
// Brand blue-600 (matches the profile page)
// Sun   #FFB84D  warm accent, used sparingly (hero button, ratings)
// Canvas #F4F6FB cool off-white page background

const INK = '#14213D';
const SUN = '#FFB84D';

const displayFont = {
  fontFamily: "'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif"
};
const bodyFont = {
  fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif"
};

const MENTOR_TINTS = ['#E6ECFF', '#FFF0D9', '#DFF3E8', '#EEE7FF'];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const extractArray = (res, key) => {
  if (!res) return [];
  const body = res.data ?? res;
  if (Array.isArray(body)) return body;
  if (body && Array.isArray(body[key])) return body[key];
  if (body && Array.isArray(body.data)) return body.data;
  return [];
};

const fullName = (u, fallback) =>
  u ? `${u.firstName || ''} ${u.lastName || ''}`.trim() || fallback : fallback;

const avatarFallback = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E2E8F0&color=334155`;

const toTime = (value) => {
  const t = value ? new Date(value).getTime() : NaN;
  return Number.isNaN(t) ? null : t;
};

const formatTime = (value) => {
  const t = toTime(value);
  return t === null
    ? 'Time to be confirmed'
    : new Date(t).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
};

const formatShortDate = (value) => {
  const t = toTime(value);
  return t === null
    ? ''
    : new Date(t).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const relativeWhen = (value) => {
  const t = toTime(value);
  if (t === null) return null;
  const diffMin = Math.round((t - Date.now()) / 60000);
  const abs = Math.abs(diffMin);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  if (abs < 60) return rtf.format(diffMin, 'minute');
  if (abs < 60 * 24) return rtf.format(Math.round(diffMin / 60), 'hour');
  return rtf.format(Math.round(diffMin / 1440), 'day');
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const hashIndex = (str, mod) => {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % mod;
};

const STATUS = {
  confirmed: { label: 'Confirmed', cls: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  pending: { label: 'Pending', cls: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  completed: { label: 'Completed', cls: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
  cancelled: { label: 'Cancelled', cls: 'bg-rose-50 text-rose-700', dot: 'bg-rose-500' }
};

/* ------------------------------------------------------------------ */
/* Building blocks (outside the page so they don't remount)            */
/* ------------------------------------------------------------------ */

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600';

const Avatar = ({ src, name, className = 'w-10 h-10' }) => (
  <img
    src={src || avatarFallback(name)}
    alt=""
    className={`${className} rounded-full object-cover bg-slate-100 shrink-0`}
    onError={(e) => {
      e.currentTarget.onerror = null;
      e.currentTarget.src = avatarFallback(name);
    }}
  />
);

const StatusChip = ({ status = 'pending' }) => {
  const s = STATUS[status] || { label: status, cls: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

const DateBlock = ({ value, large = false }) => {
  const t = toTime(value);
  const d = t === null ? null : new Date(t);
  return (
    <div
      className={`shrink-0 text-center rounded-xl bg-slate-50 ring-1 ring-slate-200 ${
        large ? 'w-16 py-2.5' : 'w-12 py-1.5'
      }`}
    >
      {d ? (
        <>
          <p className={`${large ? 'text-xs' : 'text-[11px]'} text-slate-500 leading-none`}>
            {d.toLocaleDateString('en-IN', { month: 'short' })}
          </p>
          <p
            className={`${large ? 'text-3xl mt-1' : 'text-lg mt-0.5'} font-bold leading-none`}
            style={{ ...displayFont, color: INK }}
          >
            {d.getDate()}
          </p>
        </>
      ) : (
        <Calendar className={`${large ? 'w-6 h-6' : 'w-5 h-5'} mx-auto text-slate-400`} />
      )}
    </div>
  );
};

const Panel = ({ title, subtitle, action, children, className = '' }) => (
  <section
    className={`bg-white rounded-2xl ring-1 ring-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className}`}
  >
    <div className="flex items-center justify-between gap-4 px-5 sm:px-6 pt-5 pb-4">
      <div>
        <h2 className="text-lg font-semibold" style={{ ...displayFont, color: INK }}>
          {title}
        </h2>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
    {children}
  </section>
);

const EmptyState = ({ icon: Icon, title, text, actionLabel, onAction }) => (
  <div className="px-6 pb-10 pt-4 text-center">
    <div className="w-12 h-12 rounded-full bg-slate-50 ring-1 ring-slate-200 flex items-center justify-center mx-auto mb-3">
      <Icon className="w-5 h-5 text-slate-400" />
    </div>
    <p className="font-semibold text-slate-900">{title}</p>
    <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">{text}</p>
    {actionLabel && (
      <button
        onClick={onAction}
        className={`mt-5 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer ${focusRing}`}
      >
        {actionLabel}
      </button>
    )}
  </div>
);

const SessionRow = ({ session, onChat }) => {
  const mentorName = fullName(session.mentor?.user, 'Mentor');
  const isVideo = (session.meetingType || 'video') === 'video';
  const ModeIcon = isVideo ? Video : Phone;

  return (
    <li className="px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 hover:bg-slate-50/60 transition-colors">
      <div className="flex items-center gap-3 sm:flex-1 min-w-0">
        <DateBlock value={session.scheduledAt} />
        <div className="min-w-0">
          <p className="font-semibold text-slate-900 truncate">
            {session.title || 'Mentorship session'}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <Avatar src={session.mentor?.user?.profileImage} name={mentorName} className="w-5 h-5" />
            <p className="text-sm text-slate-500 truncate">{mentorName}</p>
          </div>
        </div>
      </div>

      <div className="sm:w-36 text-sm">
        <p className="text-slate-900 font-medium">{formatTime(session.scheduledAt)}</p>
        <p className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {session.duration || 60} min
          </span>
          <span className="inline-flex items-center gap-1 capitalize">
            <ModeIcon className="w-3.5 h-3.5" />
            {session.meetingType || 'video'}
          </span>
        </p>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4">
        <div className="sm:w-24">
          <StatusChip status={session.status} />
        </div>
        <span className="sm:w-12 text-sm font-semibold text-slate-900 tabular-nums sm:text-right">
          ₹{session.price || 0}
        </span>
        <div className="sm:w-16 flex justify-end">
          {session.status === 'confirmed' && (
            <button
              onClick={onChat}
              className={`px-3 py-1.5 rounded-lg ring-1 ring-slate-300 text-sm font-medium text-slate-700 hover:bg-white hover:ring-slate-400 transition cursor-pointer ${focusRing}`}
            >
              Chat
            </button>
          )}
        </div>
      </div>
    </li>
  );
};

const MentorTile = ({ mentor, onView }) => {
  const name = fullName(mentor.user, 'Mentor');
  const skills = (mentor.skills || mentor.expertise || []).slice(0, 3);
  const rating = typeof mentor.rating === 'number' ? mentor.rating : mentor.rating?.average;
  const reviews = mentor.rating?.count ?? mentor.reviewsCount ?? 0;
  const price = mentor.pricing?.oneOnOneSession || mentor.hourlyRate;
  const tint = MENTOR_TINTS[hashIndex(name, MENTOR_TINTS.length)];

  return (
    <article className="rounded-2xl ring-1 ring-slate-200 bg-white overflow-hidden flex flex-col hover:ring-slate-300 hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.25)] transition">
      <div className="h-16" style={{ backgroundColor: tint }} />
      <div className="px-5 pb-5 -mt-8 flex flex-col flex-1">
        <div className="flex items-end justify-between">
          <Avatar
            src={mentor.user?.profileImage}
            name={name}
            className="w-16 h-16 ring-4 ring-white"
          />
          {rating ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white ring-1 ring-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-800 mb-1">
              <Star className="w-3.5 h-3.5 fill-current" style={{ color: SUN }} />
              {rating.toFixed(1)}
              <span className="font-normal text-slate-500">({reviews})</span>
            </span>
          ) : (
            <span className="rounded-full bg-white ring-1 ring-slate-200 px-2.5 py-1 text-xs text-slate-500 mb-1">
              New mentor
            </span>
          )}
        </div>

        <h3 className="mt-3 font-semibold text-slate-900 truncate" style={displayFont}>
          {name}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 min-h-[2.5rem]">
          {mentor.headline || mentor.currentRole || 'Mentor'}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5 min-h-[1.75rem]">
          {skills.map((skill) => (
            <span key={skill} className="px-2 py-0.5 rounded-md bg-slate-100 text-xs text-slate-700">
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            {price ? (
              <>
                <span className="font-semibold text-slate-900 tabular-nums">₹{price}</span> / session
              </>
            ) : (
              'Pricing on request'
            )}
          </p>
          <button
            onClick={onView}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium text-white hover:opacity-90 transition cursor-pointer ${focusRing}`}
            style={{ backgroundColor: INK }}
          >
            View profile
          </button>
        </div>
      </div>
    </article>
  );
};

const CompletionRing = ({ completed, total }) => {
  const r = 30;
  const c = 2 * Math.PI * r;
  const pct = total > 0 ? completed / total : 0;
  return (
    <div className="relative w-[84px] h-[84px] shrink-0">
      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#E2E8F0" strokeWidth="8" />
        <circle
          className="md-ring"
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="#2563EB"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ '--c': c }}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-lg font-bold"
        style={{ ...displayFont, color: INK }}
      >
        {Math.round(pct * 100)}%
      </span>
    </div>
  );
};

const Skeleton = () => (
  <div className="space-y-6 animate-pulse" aria-label="Loading dashboard">
    <div className="h-72 rounded-3xl bg-slate-200" />
    <div className="grid sm:grid-cols-3 gap-4">
      <div className="h-32 rounded-2xl bg-slate-200" />
      <div className="h-32 rounded-2xl bg-slate-200" />
      <div className="h-32 rounded-2xl bg-slate-200" />
    </div>
    <div className="grid lg:grid-cols-[1fr_340px] gap-6">
      <div className="h-96 rounded-2xl bg-slate-200" />
      <div className="h-96 rounded-2xl bg-slate-200" />
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const MenteeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [recommendedMentors, setRecommendedMentors] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load this page's fonts once. Move this <link> into index.html to use them app-wide.
  useEffect(() => {
    const id = 'mentee-dashboard-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=DM+Sans:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [sessionsRes, mentorsRes, notifsRes] = await Promise.allSettled([
        sessionsAPI.getAll({ limit: 10 }),
        mentorsAPI.getAll({ limit: 6 }),
        notificationsAPI.getAll({ limit: 6 })
      ]);

      setSessions(
        sessionsRes.status === 'fulfilled' ? extractArray(sessionsRes.value, 'sessions') : []
      );
      setRecommendedMentors(
        mentorsRes.status === 'fulfilled' ? extractArray(mentorsRes.value, 'mentors') : []
      );
      setNotifications(
        notifsRes.status === 'fulfilled'
          ? extractArray(notifsRes.value, 'notifications')
          : []
      );
    } catch (err) {
      console.error('Error fetching mentee dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const stats = useMemo(
    () => ({
      total: sessions.length,
      completed: sessions.filter((s) => s?.status === 'completed').length,
      upcoming: sessions.filter((s) => s?.status === 'confirmed').length,
      pending: sessions.filter((s) => s?.status === 'pending').length
    }),
    [sessions]
  );

  // Upcoming first (soonest at the top), then past (latest first)
  const orderedSessions = useMemo(() => {
    const now = Date.now();
    const valid = sessions.filter(Boolean);
    const upcoming = valid
      .filter((s) => (toTime(s.scheduledAt) ?? -1) >= now)
      .sort((a, b) => toTime(a.scheduledAt) - toTime(b.scheduledAt));
    const rest = valid
      .filter((s) => (toTime(s.scheduledAt) ?? -1) < now)
      .sort((a, b) => (toTime(b.scheduledAt) ?? 0) - (toTime(a.scheduledAt) ?? 0));
    return [...upcoming, ...rest];
  }, [sessions]);

  const nextSession = useMemo(() => {
    const now = Date.now();
    return (
      orderedSessions.find(
        (s) => s.status === 'confirmed' && (toTime(s.scheduledAt) ?? -1) >= now
      ) || null
    );
  }, [orderedSessions]);

  // Next 7 days, with how many sessions fall on each
  const weekDays = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const count = sessions.filter(
        (s) =>
          s &&
          s.status !== 'cancelled' &&
          toTime(s.scheduledAt) !== null &&
          new Date(toTime(s.scheduledAt)).toDateString() === date.toDateString()
      ).length;
      return { date, count, isToday: i === 0 };
    });
  }, [sessions]);

  const weekTotal = weekDays.reduce((sum, d) => sum + d.count, 0);
  const firstName = user?.firstName || 'there';

  const shell = (children) => (
    <div className="min-h-screen w-full bg-[#F4F6FB]" style={bodyFont}>
      <style>{`
        @keyframes md-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes md-ring { from { stroke-dashoffset: var(--c); } }
        .md-rise { animation: md-rise .6s ease-out both; }
        .md-rise-2 { animation: md-rise .6s .12s ease-out both; }
        .md-ring { animation: md-ring 1s .3s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .md-rise, .md-rise-2, .md-ring { animation: none; } }
      `}</style>
      <Header />
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">{children}</main>
    </div>
  );

  if (loading) return shell(<Skeleton />);

  if (error) {
    return shell(
      <div className="bg-white rounded-2xl ring-1 ring-slate-200 px-6 py-16 text-center">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-semibold" style={{ ...displayFont, color: INK }}>
          Couldn't load your dashboard
        </h2>
        <p className="text-sm text-slate-500 mt-1">{error}</p>
        <button
          onClick={fetchDashboardData}
          className={`mt-5 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer ${focusRing}`}
        >
          Try again
        </button>
      </div>
    );
  }

  const nextMentorName = nextSession ? fullName(nextSession.mentor?.user, 'your mentor') : '';
  const nextIsVideo = (nextSession?.meetingType || 'video') === 'video';
  const NextModeIcon = nextIsVideo ? Video : Phone;
  const rel = nextSession ? relativeWhen(nextSession.scheduledAt) : null;

  return shell(
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden rounded-3xl text-white"
        style={{ backgroundColor: INK }}
      >
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 -top-28 w-[36rem] h-[36rem] text-white/[0.08]"
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

        <div className="relative grid lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-12 items-center p-6 sm:p-10">
          <div className="md-rise">
            <h1
              className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]"
              style={displayFont}
            >
              {greeting()},
              <br />
              {firstName}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-md">
              {stats.upcoming > 0
                ? `You have ${stats.upcoming} upcoming ${stats.upcoming === 1 ? 'session' : 'sessions'}. Keep the momentum going.`
                : 'Nothing is booked yet. Pick a mentor and set up your first conversation.'}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/findMentorPage')}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold hover:brightness-95 transition cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${''}`}
                style={{ backgroundColor: SUN, color: INK }}
              >
                <Plus className="w-4 h-4" />
                Book a session
              </button>
              <button
                onClick={() => navigate('/message')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-white/10 ring-1 ring-white/25 hover:bg-white/15 transition cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <MessageSquare className="w-4 h-4" />
                Messages
              </button>
            </div>
          </div>

          {/* Next session ticket */}
          <div className="md-rise-2">
            {nextSession ? (
              <div className="rounded-2xl bg-white text-slate-900 p-5 sm:p-6 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.6)]">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">Next session</p>
                  {rel && (
                    <span className="rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1">
                      {rel}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <DateBlock value={nextSession.scheduledAt} large />
                  <div className="min-w-0">
                    <p
                      className="text-lg font-semibold leading-snug truncate"
                      style={{ ...displayFont, color: INK }}
                    >
                      {nextSession.title || 'Mentorship session'}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Avatar
                        src={nextSession.mentor?.user?.profileImage}
                        name={nextMentorName}
                        className="w-6 h-6"
                      />
                      <span className="text-sm text-slate-600 truncate">{nextMentorName}</span>
                    </div>
                  </div>
                </div>

                {/* Perforated divider */}
                <div className="relative my-5 border-t border-dashed border-slate-300">
                  <span
                    className="absolute -left-8 -top-3 w-6 h-6 rounded-full"
                    style={{ backgroundColor: INK }}
                  />
                  <span
                    className="absolute -right-8 -top-3 w-6 h-6 rounded-full"
                    style={{ backgroundColor: INK }}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {formatTime(nextSession.scheduledAt)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {nextSession.duration || 60} min
                  </span>
                  <span className="inline-flex items-center gap-1.5 capitalize">
                    <NextModeIcon className="w-4 h-4 text-slate-400" />
                    {nextSession.meetingType || 'video'}
                  </span>
                </div>

                <button
                  onClick={() => navigate('/message')}
                  className={`mt-5 w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer ${focusRing}`}
                >
                  Message {nextMentorName.split(' ')[0] || 'mentor'}
                </button>
              </div>
            ) : (
              <div className="rounded-2xl bg-white/[0.07] ring-1 ring-white/15 p-6 sm:p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                  <Calendar className="w-5 h-5 text-slate-200" />
                </div>
                <p className="mt-4 text-lg font-semibold" style={displayFont}>
                  No session scheduled
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Your next confirmed session will show up here.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl ring-1 ring-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <p className="text-sm text-slate-500">Total sessions</p>
            <Calendar className="w-4 h-4 text-slate-300" />
          </div>
          <p
            className="mt-3 text-4xl font-bold tabular-nums"
            style={{ ...displayFont, color: INK }}
          >
            {stats.total}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {stats.pending > 0
              ? `${stats.pending} awaiting confirmation`
              : 'All requests are up to date'}
          </p>
        </div>

        <div className="bg-white rounded-2xl ring-1 ring-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <p className="text-sm text-slate-500">Upcoming</p>
            <Clock className="w-4 h-4 text-slate-300" />
          </div>
          <p
            className="mt-3 text-4xl font-bold tabular-nums"
            style={{ ...displayFont, color: INK }}
          >
            {stats.upcoming}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {nextSession
              ? `Next on ${formatShortDate(nextSession.scheduledAt)}`
              : 'Nothing scheduled'}
          </p>
        </div>

        <div className="bg-white rounded-2xl ring-1 ring-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-5 sm:p-6 flex items-center gap-5">
          <CompletionRing completed={stats.completed} total={stats.total} />
          <div>
            <p className="text-sm text-slate-500">Completed</p>
            <p
              className="mt-1 text-2xl font-bold tabular-nums"
              style={{ ...displayFont, color: INK }}
            >
              {stats.completed}
              <span className="text-base font-medium text-slate-400"> of {stats.total}</span>
            </p>
            <p className="mt-0.5 text-sm text-slate-500 inline-flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
              sessions finished
            </p>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
        <div className="space-y-6 min-w-0">
          <Panel
            title="Your sessions"
            subtitle={
              orderedSessions.length > 5
                ? `Showing 5 of ${orderedSessions.length}`
                : undefined
            }
          >
            {orderedSessions.length > 0 ? (
              <ul className="divide-y divide-slate-100 border-t border-slate-100">
                {orderedSessions.slice(0, 5).map((session) => (
                  <SessionRow
                    key={session._id || session.id}
                    session={session}
                    onChat={() => navigate('/message')}
                  />
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={Calendar}
                title="No sessions yet"
                text="Book your first session and it will show up here."
                actionLabel="Find a mentor"
                onAction={() => navigate('/findMentorPage')}
              />
            )}
          </Panel>

          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <div>
                <h2 className="text-lg font-semibold" style={{ ...displayFont, color: INK }}>
                  Recommended mentors
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">People worth talking to next.</p>
              </div>
              <button
                onClick={() => navigate('/findMentorPage')}
                className={`inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer rounded ${focusRing}`}
              >
                <Search className="w-4 h-4" />
                Browse all
              </button>
            </div>

            {recommendedMentors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendedMentors.slice(0, 4).map((mentor) => {
                  const id = mentor._id || mentor.id;
                  return (
                    <MentorTile
                      key={id}
                      mentor={mentor}
                      onView={() => navigate(`/mentor/${id}`)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl ring-1 ring-slate-200/70">
                <EmptyState
                  icon={User}
                  title="No mentors to show yet"
                  text="Recommendations will appear here once mentors are available."
                />
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <Panel
            title="This week"
            subtitle={
              weekTotal > 0
                ? `${weekTotal} ${weekTotal === 1 ? 'session' : 'sessions'} in the next 7 days`
                : 'No sessions in the next 7 days'
            }
          >
            <div className="px-5 sm:px-6 pb-6 grid grid-cols-7 gap-1.5">
              {weekDays.map(({ date, count, isToday }) => (
                <div
                  key={date.toISOString()}
                  className={`rounded-xl py-2.5 text-center ${
                    isToday ? 'text-white' : 'bg-slate-50 text-slate-700'
                  }`}
                  style={isToday ? { backgroundColor: INK } : undefined}
                >
                  <p className={`text-[11px] ${isToday ? 'text-slate-300' : 'text-slate-500'}`}>
                    {date.toLocaleDateString('en-IN', { weekday: 'short' })}
                  </p>
                  <p className="mt-1 text-base font-bold leading-none" style={displayFont}>
                    {date.getDate()}
                  </p>
                  <span
                    className={`mt-2 mx-auto block w-1.5 h-1.5 rounded-full ${
                      count > 0 ? (isToday ? 'bg-amber-300' : 'bg-blue-600') : 'bg-transparent'
                    }`}
                  />
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Recent activity">
            {notifications.length > 0 ? (
              <ol className="mx-5 sm:mx-6 mb-6 ml-6 sm:ml-7 border-l border-slate-200 space-y-5">
                {notifications.slice(0, 5).map((n) => (
                  <li key={n._id || n.id} className="relative pl-5">
                    <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-white ring-2 ring-blue-600" />
                    <p className="text-sm text-slate-900 line-clamp-2">{n.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{formatShortDate(n.createdAt)}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="px-6 pb-8 text-sm text-slate-500">Nothing new right now.</p>
            )}
          </Panel>
        </aside>
      </div>
    </>
  );
};

export default MenteeDashboard;