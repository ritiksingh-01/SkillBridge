import React, { useState, useEffect } from 'react';
import {
  Bell,
  Check,
  User,
  Calendar,
  BookOpen,
  Award,
  MessageCircle,
  Search,
  Settings,
  Clock,
  AlertCircle,
  Trash2,
  CheckCheck,
  DollarSign,
  X
} from 'lucide-react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import { useSocket } from '../../context/SocketContext';
import { notificationsAPI } from '../../services/api';

/* ------------------------------------------------------------------ */
/* Design tokens (shared with the other pages)                         */
/* ------------------------------------------------------------------ */

const INK = '#14213D';

const displayFont = {
  fontFamily: "'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif"
};
const bodyFont = {
  fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif"
};

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const formatTimeAgo = (timestamp) => {
  const t = new Date(timestamp);
  if (Number.isNaN(t.getTime())) return '';
  const diff = Date.now() - t.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return t.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const isSessionType = (n) => n.type?.startsWith('session') || n.type === 'mentorship_request';
const isMessageType = (n) => n.type === 'message' || n.type === 'message_received';
const isPaymentType = (n) => n.type?.startsWith('payment');

// Harmonized notification types with backend enum (F12)
const getNotificationIcon = (type) => {
  const iconClass = 'w-5 h-5';
  switch (type) {
    case 'mentorship_request':
    case 'session_request':
      return <User className={iconClass} />;
    case 'session_reminder':
    case 'session_confirmed':
    case 'session_status_update':
      return <Calendar className={iconClass} />;
    case 'session_completed':
      return <BookOpen className={iconClass} />;
    case 'message_received':
    case 'message':
      return <MessageCircle className={iconClass} />;
    case 'payment_received':
    case 'payment_success':
      return <DollarSign className={iconClass} />;
    case 'review_received':
    case 'skill_achievement':
      return <Award className={iconClass} />;
    case 'profile_approved':
    case 'system_update':
    case 'system':
      return <Settings className={iconClass} />;
    default:
      return <Bell className={iconClass} />;
  }
};

const tileTone = (priority) => {
  if (priority === 'high') return 'bg-rose-50 text-rose-600';
  if (priority === 'medium') return 'bg-amber-50 text-amber-700';
  return 'bg-slate-100 text-slate-600';
};

const PriorityChip = ({ priority }) => {
  if (priority === 'high') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 ring-1 ring-inset ring-rose-200 px-2 py-0.5 text-xs font-medium text-rose-700">
        <AlertCircle className="w-3 h-3" />
        Urgent
      </span>
    );
  }
  if (priority === 'medium') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 ring-1 ring-inset ring-amber-200 px-2 py-0.5 text-xs font-medium text-amber-700">
        <Clock className="w-3 h-3" />
        Important
      </span>
    );
  }
  return null;
};

const bucketOf = (timestamp) => {
  const t = new Date(timestamp);
  if (Number.isNaN(t.getTime())) return 'Earlier';
  const startToday = new Date();
  startToday.setHours(0, 0, 0, 0);
  const startYesterday = new Date(startToday);
  startYesterday.setDate(startToday.getDate() - 1);
  if (t >= startToday) return 'Today';
  if (t >= startYesterday) return 'Yesterday';
  return 'Earlier';
};

const IconButton = ({ label, onClick, hover, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    className={`p-2 rounded-lg text-slate-400 hover:bg-slate-100 ${hover} transition-colors cursor-pointer ${focusRing}`}
  >
    {children}
  </button>
);

const ListSkeleton = () => (
  <div className="divide-y divide-slate-100 animate-pulse" aria-label="Loading notifications">
    {[0, 1, 2, 3, 4].map((i) => (
      <div key={i} className="flex items-start gap-4 px-5 py-4">
        <div className="w-4 h-4 mt-1 rounded bg-slate-200" />
        <div className="w-10 h-10 rounded-xl bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 rounded bg-slate-200" />
          <div className="h-3 w-2/3 rounded bg-slate-100" />
        </div>
      </div>
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const NotificationPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const { socket } = useSocket();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState([]);

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

  // Fetch user ID with both id and _id support (F5)
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem('user');
      if (rawUser) {
        const u = JSON.parse(rawUser);
        setUserId(u._id || u.id);
        return;
      }
    } catch {
      // Ignore
    }
    setLoading(false);
  }, []);

  // Fetch notifications from backend
  useEffect(() => {
    if (!userId) return;
    notificationsAPI
      .getAll()
      .then((res) => {
        if (res.data && Array.isArray(res.data.notifications)) {
          setNotifications(
            res.data.notifications.map((notif) => ({
              ...notif,
              id: notif._id || notif.id,
              timestamp: new Date(notif.createdAt)
            }))
          );
        }
      })
      .catch(() => {
        // If network error, keep empty
      })
      .finally(() => setLoading(false));
  }, [userId]);

  // Listen for real-time notifications
  useEffect(() => {
    if (!socket || !userId) return;

    const handleNewNotification = (notif) => {
      setNotifications((prev) => [
        {
          ...notif,
          id: notif._id || notif.id || Date.now(),
          timestamp: new Date(notif.createdAt || Date.now())
        },
        ...prev
      ]);
    };

    socket.on('new-notification', handleNewNotification);

    return () => {
      socket.off('new-notification', handleNewNotification);
    };
  }, [socket, userId]);

  const toggleNotificationSelection = (id) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((notifId) => notifId !== id) : [...prev, id]
    );
  };

  const markAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
    } catch {
      // Local optimistic update
    }
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id || notif._id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAsUnread = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id || notif._id === id ? { ...notif, isRead: false } : notif
      )
    );
  };

  const deleteNotification = async (id) => {
    try {
      await notificationsAPI.delete(id);
    } catch {
      // Local optimistic update
    }
    setNotifications((prev) => prev.filter((notif) => notif.id !== id && notif._id !== id));
    setSelectedNotifications((prev) => prev.filter((notifId) => notifId !== id));
  };

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
    } catch {
      // Optimistic update
    }
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
  };

  const bulkMarkAsRead = async () => {
    // Ignore individual failures
    await Promise.allSettled(selectedNotifications.map((id) => notificationsAPI.markAsRead(id)));
    setNotifications((prev) =>
      prev.map((notif) =>
        selectedNotifications.includes(notif.id) || selectedNotifications.includes(notif._id)
          ? { ...notif, isRead: true }
          : notif
      )
    );
    setSelectedNotifications([]);
  };

  const bulkDelete = async () => {
    await Promise.allSettled(selectedNotifications.map((id) => notificationsAPI.delete(id)));
    setNotifications((prev) =>
      prev.filter(
        (notif) =>
          !selectedNotifications.includes(notif.id) && !selectedNotifications.includes(notif._id)
      )
    );
    setSelectedNotifications([]);
  };

  // Harmonized filters (F12)
  const filteredNotifications = notifications
    .filter((notif) => {
      let matchesFilter = true;
      if (activeFilter === 'unread') {
        matchesFilter = !notif.isRead;
      } else if (activeFilter === 'urgent') {
        matchesFilter = notif.priority === 'high';
      } else if (activeFilter === 'sessions') {
        matchesFilter = isSessionType(notif);
      } else if (activeFilter === 'messages') {
        matchesFilter = isMessageType(notif);
      } else if (activeFilter === 'payments') {
        matchesFilter = isPaymentType(notif);
      } else if (activeFilter === 'system') {
        matchesFilter = notif.type?.startsWith('system') || notif.type === 'profile_approved';
      }

      const title = notif.title || '';
      const msg = notif.message || '';
      const matchesSearch =
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => (b.timestamp?.getTime?.() || 0) - (a.timestamp?.getTime?.() || 0));

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filterOptions = [
    { value: 'all', label: 'All', count: notifications.length, icon: Bell },
    { value: 'unread', label: 'Unread', count: unreadCount, icon: AlertCircle },
    { value: 'sessions', label: 'Sessions', count: notifications.filter(isSessionType).length, icon: Calendar },
    { value: 'messages', label: 'Messages', count: notifications.filter(isMessageType).length, icon: MessageCircle },
    { value: 'payments', label: 'Payments', count: notifications.filter(isPaymentType).length, icon: DollarSign }
  ];

  // Group by day for scanning
  const grouped = ['Today', 'Yesterday', 'Earlier']
    .map((label) => [
      label,
      filteredNotifications.filter((n) => bucketOf(n.timestamp) === label)
    ])
    .filter(([, items]) => items.length > 0);

  const visibleIds = filteredNotifications.map((n) => n._id || n.id);
  const allSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedNotifications.includes(id));

  const toggleSelectAll = () => {
    setSelectedNotifications((prev) =>
      allSelected
        ? prev.filter((id) => !visibleIds.includes(id))
        : Array.from(new Set([...prev, ...visibleIds]))
    );
  };

  const compact = viewMode === 'compact';

  return (
    <div className="min-h-screen w-full bg-[#F4F6FB] flex flex-col" style={bodyFont}>
      <style>{`
        @keyframes md-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .md-rise { animation: md-rise .6s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .md-rise { animation: none; } }
      `}</style>

      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        {/* Page header */}
        <div className="md-rise flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h1
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              style={{ ...displayFont, color: INK }}
            >
              Notifications
            </h1>
            <p className="mt-1.5 text-slate-500">
              {loading
                ? 'Loading your notifications...'
                : unreadCount > 0
                ? `You have ${unreadCount} unread ${unreadCount === 1 ? 'notification' : 'notifications'}.`
                : "You're all caught up."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              role="group"
              aria-label="List density"
              className="inline-flex rounded-xl bg-white ring-1 ring-slate-200 p-1"
            >
              {[
                { mode: 'list', label: 'Detailed' },
                { mode: 'compact', label: 'Compact' }
              ].map(({ mode, label }) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  aria-pressed={viewMode === mode}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${focusRing} ${
                    viewMode === mode
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${focusRing}`}
              style={{ backgroundColor: INK }}
            >
              <Check className="w-4 h-4" />
              Mark all read
            </button>
          </div>
        </div>

        {/* Search and filters */}
        <div className="sticky top-20 z-30 mb-4">
          <div className="rounded-2xl bg-white/95 backdrop-blur ring-1 ring-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-3 sm:p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                aria-label="Search notifications"
                placeholder="Search notifications"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl bg-slate-50 pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 ring-1 ring-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer ${focusRing}`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-0.5">
              {filterOptions.map((option) => {
                const Icon = option.icon;
                const isActive = activeFilter === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setActiveFilter(option.value)}
                    aria-pressed={isActive}
                    className={`shrink-0 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium transition cursor-pointer ${focusRing} ${
                      isActive
                        ? 'text-white'
                        : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                    style={isActive ? { backgroundColor: INK } : undefined}
                  >
                    <Icon className="w-4 h-4" />
                    {option.label}
                    {option.count > 0 && (
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-xs font-semibold tabular-nums ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {option.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* List */}
        <section className="rounded-2xl bg-white ring-1 ring-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden">
          {loading ? (
            <ListSkeleton />
          ) : filteredNotifications.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="w-14 h-14 rounded-full bg-slate-50 ring-1 ring-slate-200 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold" style={{ ...displayFont, color: INK }}>
                No notifications found
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                {searchTerm
                  ? 'Try a different search term or switch filters.'
                  : 'You have no notifications in this category.'}
              </p>
              {(searchTerm || activeFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setActiveFilter('all');
                  }}
                  className={`mt-5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 transition-colors cursor-pointer ${focusRing}`}
                >
                  Clear search and filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Selection row */}
              <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-slate-100 min-h-[3.25rem]">
                <label className="inline-flex items-center gap-3 text-sm text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 accent-blue-600 cursor-pointer"
                  />
                  {selectedNotifications.length > 0
                    ? `${selectedNotifications.length} selected`
                    : 'Select all'}
                </label>

                {selectedNotifications.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={bulkMarkAsRead}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 transition-colors cursor-pointer ${focusRing}`}
                    >
                      <CheckCheck className="w-4 h-4" />
                      Mark read
                    </button>
                    <button
                      type="button"
                      onClick={bulkDelete}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-rose-700 ring-1 ring-rose-200 hover:bg-rose-50 transition-colors cursor-pointer ${focusRing}`}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {grouped.map(([label, items]) => (
                <div key={label}>
                  <h2 className="px-5 py-2 bg-slate-50/80 text-xs font-medium text-slate-500 border-b border-slate-100">
                    {label}
                  </h2>
                  <ul className="divide-y divide-slate-100">
                    {items.map((notification) => {
                      const notifId = notification._id || notification.id;
                      const selected = selectedNotifications.includes(notifId);
                      const unread = !notification.isRead;
                      return (
                        <li
                          key={notifId}
                          className={`group relative flex items-start gap-3 sm:gap-4 pl-6 pr-4 sm:pr-5 transition-colors ${
                            compact ? 'py-3' : 'py-4'
                          } ${selected ? 'bg-blue-50/60' : 'hover:bg-slate-50/70'}`}
                        >
                          {unread && (
                            <span
                              className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-600"
                              aria-label="Unread"
                            />
                          )}

                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleNotificationSelection(notifId)}
                            aria-label={`Select ${notification.title || 'notification'}`}
                            className="w-4 h-4 mt-2.5 rounded border-slate-300 accent-blue-600 cursor-pointer shrink-0"
                          />

                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tileTone(
                              notification.priority
                            )} ${unread ? '' : 'opacity-70'}`}
                          >
                            {getNotificationIcon(notification.type)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                              <h3
                                className={`text-sm ${
                                  unread
                                    ? 'font-semibold text-slate-900'
                                    : 'font-medium text-slate-600'
                                }`}
                              >
                                {notification.title}
                              </h3>
                              <PriorityChip priority={notification.priority} />
                            </div>

                            {!compact && notification.message && (
                              <p
                                className={`mt-1 text-sm leading-relaxed ${
                                  unread ? 'text-slate-700' : 'text-slate-500'
                                }`}
                              >
                                {notification.message}
                              </p>
                            )}

                            <p
                              className="mt-1.5 text-xs text-slate-400"
                              title={
                                notification.timestamp && !Number.isNaN(notification.timestamp.getTime())
                                  ? notification.timestamp.toLocaleString('en-IN')
                                  : undefined
                              }
                            >
                              {formatTimeAgo(notification.timestamp)}
                            </p>
                          </div>

                          {/* Always visible on touch, revealed on hover/focus on desktop */}
                          <div className="flex items-center gap-0.5 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity">
                            {notification.isRead ? (
                              <IconButton
                                label="Mark as unread"
                                onClick={() => markAsUnread(notifId)}
                                hover="hover:text-blue-600"
                              >
                                <Bell className="w-4 h-4" />
                              </IconButton>
                            ) : (
                              <IconButton
                                label="Mark as read"
                                onClick={() => markAsRead(notifId)}
                                hover="hover:text-emerald-600"
                              >
                                <Check className="w-4 h-4" />
                              </IconButton>
                            )}
                            <IconButton
                              label="Delete"
                              onClick={() => deleteNotification(notifId)}
                              hover="hover:text-rose-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </IconButton>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NotificationPage;