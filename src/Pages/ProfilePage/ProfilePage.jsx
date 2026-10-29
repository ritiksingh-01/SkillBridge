import React, { useEffect, useState } from 'react';
import { usersAPI, mentorsAPI } from '../../services/api';
import MentorCard from '../../Components/MentorCard';
import Header from '../../Components/Header';
import {
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Camera,
  Mail,
  Phone,
  MapPin,
  Plus
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Design tokens (shared with the dashboard and mentor profile)        */
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

const labelCls = 'block text-sm font-medium text-slate-700 mb-1.5';
const inputCls =
  'w-full rounded-xl bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 transition disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed';

/* ------------------------------------------------------------------ */
/* Data config (unchanged)                                             */
/* ------------------------------------------------------------------ */

const categoriesList = [
  'Technology', 'Business', 'Design', 'Marketing', 'Finance', 'Leadership',
  'Product', 'Engineering', 'Data', 'AI', 'Cloud', 'Security'
];

const allowedUserFields = [
  'firstName', 'lastName', 'email', 'phone', 'gender', 'location',
  'about', 'skills', 'education', 'experience', 'socialLinks',
  'profileImage', 'coverImage', 'preferences'
];

const mentorFields = [
  'organization', 'industry', 'currentRole', 'workExperience', 'headline', 'bio',
  'expertise', 'categories', 'pricing', 'availability'
];

const pick = (source, fields) => {
  const out = {};
  fields.forEach((f) => {
    if (source[f] !== undefined) out[f] = source[f];
  });
  return out;
};

const hasValue = (v) => v !== undefined && v !== null && v !== '';

/* ------------------------------------------------------------------ */
/* Form fields (styled to match the rest of the app)                   */
/* Same props as before: label, name, value, onChange, type, required, */
/* disabled, editMode, placeholder, rows, values, suggestions          */
/* ------------------------------------------------------------------ */

const NotAdded = () => <span className="text-slate-400">Not added</span>;

const RequiredMark = () => (
  <span className="text-rose-500" aria-hidden="true">
    {' '}*
  </span>
);

const TextField = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required,
  disabled,
  editMode,
  placeholder,
  prefix
}) => (
  <div>
    <label htmlFor={name} className={labelCls}>
      {label}
      {required && editMode && !disabled && <RequiredMark />}
    </label>
    {editMode ? (
      <div className="relative">
        {prefix && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-500 pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          min={type === 'number' ? 0 : undefined}
          className={`${inputCls} ${prefix ? 'pl-8' : ''}`}
        />
      </div>
    ) : (
      <p className="py-2.5 text-sm text-slate-900 break-words">
        {hasValue(value) ? (
          <>
            {prefix}
            {value}
          </>
        ) : (
          <NotAdded />
        )}
      </p>
    )}
  </div>
);

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  required,
  editMode,
  rows = 3,
  placeholder
}) => (
  <div>
    <label htmlFor={name} className={labelCls}>
      {label}
      {required && editMode && <RequiredMark />}
    </label>
    {editMode ? (
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        placeholder={placeholder}
        className={`${inputCls} resize-y leading-relaxed`}
      />
    ) : (
      <p className="py-2.5 text-sm text-slate-900 leading-relaxed whitespace-pre-line break-words max-w-prose">
        {hasValue(value) ? value : <NotAdded />}
      </p>
    )}
  </div>
);

const Chip = ({ children, onRemove }) => (
  <li className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 ring-1 ring-slate-200 pl-3 pr-2 py-1.5 text-sm font-medium text-slate-800">
    {children}
    {onRemove && (
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${children}`}
        className={`p-0.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer ${focusRing}`}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    )}
  </li>
);

const ArrayField = ({ label, name, values, onChange, editMode, suggestions = [], placeholder }) => {
  const [draft, setDraft] = useState('');
  const list = Array.isArray(values) ? values : [];

  const add = (raw) => {
    const v = raw.trim();
    if (!v) return;
    if (list.some((x) => String(x).toLowerCase() === v.toLowerCase())) {
      setDraft('');
      return;
    }
    onChange([...list, v]);
    setDraft('');
  };

  const remove = (index) => onChange(list.filter((_, i) => i !== index));

  const remaining = suggestions.filter(
    (s) => !list.some((x) => String(x).toLowerCase() === s.toLowerCase())
  );

  return (
    <div>
      <label htmlFor={name} className={labelCls}>
        {label}
      </label>

      {list.length > 0 ? (
        <ul className="flex flex-wrap gap-2 mb-3">
          {list.map((item, i) => (
            <Chip key={`${item}-${i}`} onRemove={editMode ? () => remove(i) : undefined}>
              {item}
            </Chip>
          ))}
        </ul>
      ) : (
        !editMode && <p className="py-2.5 text-sm"><NotAdded /></p>
      )}

      {editMode && (
        <>
          <div className="flex gap-2">
            <input
              id={name}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault(); // don't submit the form
                  add(draft);
                }
              }}
              placeholder={placeholder}
              className={inputCls}
            />
            <button
              type="button"
              onClick={() => add(draft)}
              disabled={!draft.trim()}
              className={`shrink-0 inline-flex items-center gap-1.5 px-4 rounded-xl text-sm font-semibold text-slate-700 ring-1 ring-slate-300 bg-white hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${focusRing}`}
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          {remaining.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-slate-500 mb-2">Suggestions</p>
              <div className="flex flex-wrap gap-2">
                {remaining.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => add(s)}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer ${focusRing}`}
                  >
                    <Plus className="w-3 h-3" />
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Layout pieces                                                       */
/* ------------------------------------------------------------------ */

// Title and description on the left, fields on the right
const Section = ({ title, description, children }) => (
  <section className="grid grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)] gap-x-10 gap-y-5 py-8">
    <div>
      <h3 className="text-lg font-semibold" style={{ ...displayFont, color: INK }}>
        {title}
      </h3>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
    <div>{children}</div>
  </section>
);

const Banner = ({ tone, icon: Icon, role, children }) => {
  const styles =
    tone === 'success'
      ? 'bg-emerald-50 ring-emerald-200 text-emerald-800'
      : 'bg-rose-50 ring-rose-200 text-rose-800';
  return (
    <div role={role} className={`rounded-xl ring-1 px-4 py-3 flex items-center gap-3 text-sm ${styles}`}>
      <Icon className="w-5 h-5 shrink-0" />
      <span>{children}</span>
    </div>
  );
};

const PageShell = ({ children }) => (
  <div className="min-h-screen w-full bg-[#F4F6FB]" style={bodyFont}>
    <style>{`
      @keyframes md-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
      @keyframes md-bar { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
      .md-rise { animation: md-rise .6s ease-out both; }
      .md-bar { animation: md-bar .25s ease-out both; }
      @media (prefers-reduced-motion: reduce) { .md-rise, .md-bar { animation: none; } }
    `}</style>
    <Header />
    {children}
  </div>
);

const Skeleton = () => (
  <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-16 space-y-6 animate-pulse" aria-label="Loading profile">
    <div className="h-72 rounded-3xl bg-slate-200" />
    <div className="h-[28rem] rounded-2xl bg-slate-200" />
  </div>
);

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [coverIsPortrait, setCoverIsPortrait] = useState(false);

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userRes = await usersAPI.getProfile();
        const userData = userRes.data.user;
        setUser(userData);
        setFormData(userData);
        setProfileImagePreview(userData.profileImage || null);
        setCoverImagePreview(userData.coverImage || null);

        // Fetch mentor profile directly from backend instead of client-filtering first 12 mentors (F10)
        if (userData.role === 'mentor') {
          try {
            const mentorRes = await mentorsAPI.getMe();
            if (mentorRes.data?.mentor) {
              setMentor(mentorRes.data.mentor);
              setFormData((prev) => ({ ...prev, ...mentorRes.data.mentor }));
            }
          } catch {
            // Mentor profile not yet created or pending
          }
        }
      } catch {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...(prev[parent] || {}), [child]: value }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'profile') {
        setProfileImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, profileImage: reader.result }));
      } else if (type === 'cover') {
        setCoverImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, coverImage: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleArrayChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Discard unsaved edits and restore the last saved values
  const handleCancel = () => {
    setFormData({ ...user, ...(mentor || {}) });
    setProfileImagePreview(user?.profileImage || null);
    setCoverImagePreview(user?.coverImage || null);
    setError(null);
    setEditMode(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      // Filter payload before sending to users API (F10)
      const userPayload = pick(formData, allowedUserFields);
      await usersAPI.updateProfile(userPayload);

      // Filter mentor fields before sending to mentors API
      let mentorPayload = null;
      if (user?.role === 'mentor' && mentor) {
        mentorPayload = pick(formData, mentorFields);

        // Number inputs return strings; send real numbers to the API
        if (mentorPayload.pricing) {
          const pricing = { ...mentorPayload.pricing };
          ['oneOnOneSession', 'querySession'].forEach((key) => {
            if (pricing[key] !== undefined && pricing[key] !== '') {
              pricing[key] = Number(pricing[key]);
            }
          });
          mentorPayload.pricing = pricing;
        }

        await mentorsAPI.updateProfile(mentor._id, mentorPayload);
      }

      // Keep the "saved" snapshot in sync so Cancel restores the right values
      setUser((prev) => ({ ...prev, ...userPayload }));
      if (mentorPayload) setMentor((prev) => ({ ...prev, ...mentorPayload }));

      setSuccess('Profile updated successfully!');
      setEditMode(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSuccess(null), 5000);
    } catch {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageShell>
        <Skeleton />
      </PageShell>
    );
  }

  if (error && !user) {
    return (
      <PageShell>
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-16">
          <div className="bg-white rounded-2xl ring-1 ring-slate-200/70 px-6 py-16 text-center">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-3" />
            <h2 className="text-lg font-semibold" style={{ ...displayFont, color: INK }}>
              Couldn't load your profile
            </h2>
            <p className="text-sm text-slate-500 mt-1">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className={`mt-5 px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition cursor-pointer ${focusRing}`}
              style={{ backgroundColor: INK }}
            >
              Try again
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  if (!user) return null;

  const isMentor = user.role === 'mentor' && mentor;
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'User')}&background=E2E8F0&color=334155`;

  return (
    <PageShell>
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-16 space-y-6">
        {/* Profile header */}
        <section className="md-rise bg-white rounded-3xl ring-1 ring-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden">
          {/* Cover */}
          <div
            className="relative h-40 sm:h-52 overflow-hidden"
            style={{ backgroundColor: INK }}
          >
            {coverImagePreview ? (
              <>
                {/* Portrait photos get a blurred backdrop so nothing is awkwardly cropped */}
                {coverIsPortrait && (
                  <img
                    src={coverImagePreview}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-70"
                  />
                )}
                <img
                  src={coverImagePreview}
                  alt="Cover"
                  onLoad={(e) =>
                    setCoverIsPortrait(e.target.naturalHeight > e.target.naturalWidth)
                  }
                  className={`absolute inset-0 w-full h-full ${
                    coverIsPortrait ? 'object-contain' : 'object-cover object-center'
                  }`}
                />
              </>
            ) : (
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
            )}
            {editMode && (
              <label
                className={`absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 bg-white/95 hover:bg-white text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer shadow transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-white`}
              >
                <Camera className="w-3.5 h-3.5" />
                Change cover
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => handleImageChange(e, 'cover')}
                />
              </label>
            )}
          </div>

          {/* Avatar + identity */}
          <div className="px-6 sm:px-10 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-start gap-5 sm:gap-7">
              <div className="relative z-10 shrink-0 self-start -mt-16 sm:-mt-20">
                <img
                  src={profileImagePreview || avatarFallback}
                  alt="Profile"
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full ring-4 ring-white shadow-lg object-cover bg-white"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = avatarFallback;
                  }}
                />
                {editMode && (
                  <label
                    className="absolute bottom-1.5 right-1.5 p-2.5 rounded-full text-white cursor-pointer shadow ring-2 ring-white hover:opacity-90 transition focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-600"
                    style={{ backgroundColor: INK }}
                    aria-label="Change profile photo"
                  >
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => handleImageChange(e, 'profile')}
                    />
                  </label>
                )}
              </div>

              <div className="flex-1 min-w-0 sm:pt-5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h1
                    className="text-3xl sm:text-4xl font-bold tracking-tight"
                    style={{ ...displayFont, color: INK }}
                  >
                    {fullName}
                  </h1>
                  <span className="inline-flex items-center rounded-full bg-blue-50 ring-1 ring-inset ring-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 capitalize">
                    {user.role}
                  </span>
                </div>

                {isMentor && (formData.headline || formData.currentRole) && (
                  <p className="mt-1.5 text-lg text-slate-600">
                    {formData.headline || formData.currentRole}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                  {formData.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {formData.location}
                    </span>
                  )}
                  {formData.email && (
                    <span className="inline-flex items-center gap-1.5 break-all">
                      <Mail className="w-4 h-4 text-slate-400" />
                      {formData.email}
                    </span>
                  )}
                  {formData.phone && (
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-slate-400" />
                      {formData.phone}
                    </span>
                  )}
                </div>

                {editMode && (
                  <p className="mt-4 text-xs text-slate-500">
                    Tip: a wide image, about 1500 × 500, works best for the cover.
                  </p>
                )}
              </div>

              <div className="shrink-0 sm:pt-5">
                <button
                  type="button"
                  onClick={editMode ? handleCancel : () => setEditMode(true)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${focusRing} ${
                    editMode
                      ? 'text-slate-700 ring-1 ring-slate-300 bg-white hover:bg-slate-50'
                      : 'text-white hover:opacity-90'
                  }`}
                  style={editMode ? undefined : { backgroundColor: INK }}
                >
                  {editMode ? (
                    <>
                      <X className="w-4 h-4" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4" />
                      Edit profile
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Mentor card preview */}
        {isMentor && (
          <section className="pt-2">
            <h2 className="text-xl font-semibold" style={{ ...displayFont, color: INK }}>
              Your mentor card
            </h2>
            <p className="text-sm text-slate-500 mt-1 mb-4">
              This is how learners see you in the mentor list. It updates as you edit.
            </p>
            <div className="max-w-sm mx-auto sm:mx-0">
              <MentorCard
                mentor={{
                  _id: mentor._id,
                  id: mentor._id,
                  name: fullName,
                  image: profileImagePreview || user.profileImage,
                  rating: mentor.rating?.average || 5.0,
                  reviews: mentor.rating?.count || 0,
                  skills: formData.expertise || [],
                  availability: formData.availability?.timezone || 'Flexible',
                  price: formData.pricing?.oneOnOneSession || 500,
                  role: formData.headline || formData.currentRole || 'Mentor',
                  experience: formData.workExperience || 'Experienced'
                }}
              />
            </div>
          </section>
        )}

        {/* Details form */}
        <div className="bg-white rounded-2xl ring-1 ring-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="px-6 sm:px-10 py-6 border-b border-slate-100">
            <h2 className="text-2xl font-bold" style={{ ...displayFont, color: INK }}>
              Profile details
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {editMode
                ? 'Make your changes, then save them.'
                : 'Select "Edit profile" to update your information.'}
            </p>
          </div>

          {(success || error) && (
            <div className="px-6 sm:px-10 pt-6 space-y-3">
              {success && (
                <Banner tone="success" icon={CheckCircle} role="status">
                  {success}
                </Banner>
              )}
              {error && (
                <Banner tone="error" icon={AlertCircle} role="alert">
                  {error}
                </Banner>
              )}
            </div>
          )}

          <form id="profile-form" onSubmit={handleSave}>
            <div className="px-6 sm:px-10 divide-y divide-slate-100">
              <Section
                title="Basic information"
                description="Your name and how people can reach you."
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName || ''}
                    onChange={handleChange}
                    required
                    editMode={editMode}
                  />
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName || ''}
                    onChange={handleChange}
                    required
                    editMode={editMode}
                  />
                  <TextField
                    label="Email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    type="email"
                    required
                    disabled
                    editMode={editMode}
                  />
                  <TextField
                    label="Phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    type="tel"
                    editMode={editMode}
                    placeholder="+91 9876543210"
                  />
                  <div className="md:col-span-2">
                    <TextField
                      label="Location"
                      name="location"
                      value={formData.location || ''}
                      onChange={handleChange}
                      editMode={editMode}
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <TextAreaField
                      label="About"
                      name="about"
                      value={formData.about || ''}
                      onChange={handleChange}
                      editMode={editMode}
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              </Section>

              {isMentor && (
                <>
                  <Section
                    title="Mentor details"
                    description="What learners see on your public profile."
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                      <TextField
                        label="Organization"
                        name="organization"
                        value={formData.organization || ''}
                        onChange={handleChange}
                        required
                        editMode={editMode}
                        placeholder="Google, Microsoft, etc."
                      />
                      <TextField
                        label="Industry"
                        name="industry"
                        value={formData.industry || ''}
                        onChange={handleChange}
                        required
                        editMode={editMode}
                        placeholder="Technology, Finance, etc."
                      />
                      <TextField
                        label="Current Role"
                        name="currentRole"
                        value={formData.currentRole || ''}
                        onChange={handleChange}
                        required
                        editMode={editMode}
                        placeholder="Senior Software Engineer"
                      />
                      <TextField
                        label="Work Experience"
                        name="workExperience"
                        value={formData.workExperience || ''}
                        onChange={handleChange}
                        required
                        editMode={editMode}
                        placeholder="5+ years"
                      />
                      <div className="md:col-span-2">
                        <TextField
                          label="Professional Headline"
                          name="headline"
                          value={formData.headline || ''}
                          onChange={handleChange}
                          required
                          editMode={editMode}
                          placeholder="e.g. Lead Engineer mentoring in full-stack development"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <TextAreaField
                          label="Mentor Bio"
                          name="bio"
                          value={formData.bio || ''}
                          onChange={handleChange}
                          required
                          editMode={editMode}
                          rows={4}
                          placeholder="Describe your mentorship philosophy and experience..."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <ArrayField
                          label="Expertise & Skills"
                          name="expertise"
                          values={formData.expertise || []}
                          onChange={(vals) => handleArrayChange('expertise', vals)}
                          editMode={editMode}
                          placeholder="Add a skill (e.g. React, Docker)"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <ArrayField
                          label="Categories"
                          name="categories"
                          values={formData.categories || []}
                          onChange={(vals) => handleArrayChange('categories', vals)}
                          editMode={editMode}
                          suggestions={categoriesList}
                          placeholder="Add category"
                        />
                      </div>
                    </div>
                  </Section>

                  <Section
                    title="Session pricing"
                    description="What learners pay for each session."
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                      <TextField
                        label="1:1 Session Price"
                        name="pricing.oneOnOneSession"
                        value={formData.pricing?.oneOnOneSession ?? ''}
                        onChange={handleChange}
                        type="number"
                        prefix="₹"
                        editMode={editMode}
                      />
                      <TextField
                        label="Query Session Price"
                        name="pricing.querySession"
                        value={formData.pricing?.querySession ?? ''}
                        onChange={handleChange}
                        type="number"
                        prefix="₹"
                        editMode={editMode}
                      />
                    </div>
                  </Section>
                </>
              )}
            </div>
          </form>
        </div>

        {/* Floating action bar while editing */}
        {editMode && (
          <div className="md-bar sticky bottom-4 z-20">
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl bg-white/95 backdrop-blur ring-1 ring-slate-200 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.35)] px-5 py-3">
              <p className="text-sm text-slate-600">
                You're editing your profile. Changes aren't saved until you select Save.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 ring-1 ring-slate-300 bg-white hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50 ${focusRing}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="profile-form"
                  disabled={saving}
                  className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${focusRing}`}
                  style={{ backgroundColor: INK }}
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </PageShell>
  );
};

export default ProfilePage;