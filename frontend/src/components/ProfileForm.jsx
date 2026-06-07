'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client';
import LocationSelect from './LocationSelect';

const RELIGIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Parsi', 'Jewish', 'Other'];
const HOBBIES = ['Reading', 'Travelling', 'Cooking', 'Music', 'Dancing', 'Fitness', 'Photography', 'Painting', 'Sports', 'Movies', 'Gaming', 'Yoga', 'Hiking', 'Writing'];
const LANGUAGES = ['Hindi', 'English', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi'];
const SECTIONS = ['Basic', 'Career', 'Values', 'Preferences', 'Bio'];

// Defined outside component so they are stable references — prevents focus loss on re-render
function Field({ label, children, error }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function TextInput({ label, value, onChange, type = 'text', placeholder, min, max, maxLength, required, error, inputMode }) {
  return (
    <Field label={label} error={error}>
      <input
        type={type}
        className={`input ${error ? 'border-red-400 focus:ring-red-400' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        maxLength={maxLength}
        required={required}
        inputMode={inputMode}
      />
    </Field>
  );
}

function SelectInput({ label, value, onChange, options, error }) {
  return (
    <Field label={label} error={error}>
      <select
        className={`input ${error ? 'border-red-400 focus:ring-red-400' : ''}`}
        value={value}
        onChange={onChange}
      >
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </Field>
  );
}

function validate(form) {
  const errors = {};
  if (!form.firstName.trim()) errors.firstName = 'First name is required';
  else if (!/^[a-zA-Z\s]+$/.test(form.firstName)) errors.firstName = 'Letters only';
  if (!form.lastName.trim()) errors.lastName = 'Last name is required';
  else if (!/^[a-zA-Z\s]+$/.test(form.lastName)) errors.lastName = 'Letters only';
  if (!form.gender) errors.gender = 'Please select a gender';
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email address';
  if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) errors.phone = 'Must be exactly 10 digits';
  if (form.dateOfBirth) {
    const age = Math.floor((Date.now() - new Date(form.dateOfBirth)) / (1000 * 60 * 60 * 24 * 365.25));
    if (age < 18) errors.dateOfBirth = 'Must be at least 18 years old';
    if (age > 80) errors.dateOfBirth = 'Invalid date of birth';
  }
  if (form.height && (Number(form.height) < 120 || Number(form.height) > 220)) errors.height = '120–220 cm only';
  if (form.income && Number(form.income) < 0) errors.income = 'Must be positive';
  if (form.siblings !== '' && (Number(form.siblings) < 0 || Number(form.siblings) > 20)) errors.siblings = '0–20 only';
  return errors;
}

export default function ProfileForm({ initial = {}, onSubmit, submitLabel = 'Save Profile' }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', gender: 'male', dateOfBirth: '',
    email: '', phone: '', country: 'India', state: '', city: '',
    height: '', undergraduateCollege: '', degree: '', educationTier: 'good',
    currentCompany: '', designation: '', income: '',
    maritalStatus: 'never_married', wantKids: 'maybe', haveKids: 'no',
    openToRelocate: 'maybe', openToPets: 'maybe',
    diet: 'non-vegetarian', smoking: 'never', drinking: 'never',
    religion: '', caste: '', manglik: 'dont_know', familyType: 'nuclear', motherTongue: '',
    languagesKnown: [], hobbies: [], siblings: '',
    aboutMe: '', partnerExpectations: '',
    profileType: 'client', status: 'active',
    ...initial,
    income: initial.income || '',
    height: initial.height || '',
    siblings: initial.siblings ?? '',
    dateOfBirth: initial.dateOfBirth ? initial.dateOfBirth.split('T')[0] : '',
    maritalStatus: { single: 'never_married' }[initial.maritalStatus] ?? initial.maritalStatus ?? 'never_married',
    diet: { veg: 'vegetarian', 'non-veg': 'non-vegetarian' }[initial.diet] ?? initial.diet ?? 'non-vegetarian',
    smoking: { no: 'never', yes: 'regularly' }[initial.smoking] ?? initial.smoking ?? 'never',
    drinking: { no: 'never', yes: 'regularly' }[initial.drinking] ?? initial.drinking ?? 'never',
    manglik: { 'doesnt-matter': 'dont_know', 'no-preference': 'dont_know' }[initial.manglik] ?? initial.manglik ?? 'dont_know',
  });
  const [section, setSection] = useState(0);
  const [errors, setErrors] = useState({});
  const [generatingBio, setGeneratingBio] = useState(false);
  const [generatingExp, setGeneratingExp] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: undefined }));
  };

  const toggleArr = (k, v) => setForm(f => ({
    ...f,
    [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v],
  }));

  const generateBio = async () => {
    setGeneratingBio(true);
    try {
      const { data } = await api.post('/ai/generate-bio', {
        ...form,
        age: form.dateOfBirth ? Math.floor((Date.now() - new Date(form.dateOfBirth)) / (1000 * 60 * 60 * 24 * 365.25)) : null,
      });
      set('aboutMe', data.bio);
      toast.success('Bio generated!');
    } catch { toast.error('Failed to generate bio'); }
    finally { setGeneratingBio(false); }
  };

  const generateExpectations = async () => {
    setGeneratingExp(true);
    try {
      const { data } = await api.post('/ai/generate-expectations', {
        ...form,
        age: form.dateOfBirth ? Math.floor((Date.now() - new Date(form.dateOfBirth)) / (1000 * 60 * 60 * 24 * 365.25)) : null,
      });
      set('partnerExpectations', data.expectations);
      toast.success('Expectations generated!');
    } catch { toast.error('Failed to generate expectations'); }
    finally { setGeneratingExp(false); }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      toast.error('Please fix the errors before saving');
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        income: form.income ? Number(form.income) : undefined,
        height: form.height ? Number(form.height) : undefined,
        siblings: form.siblings !== '' ? Number(form.siblings) : undefined,
      });
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Section tabs */}
      <div className="flex gap-1 bg-gray-50 border border-gray-100 rounded-xl p-1 mb-6 overflow-x-auto">
        {SECTIONS.map((s, i) => (
          <button type="button" key={s} onClick={() => setSection(i)}
            className={`flex-1 min-w-fit py-2 px-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${section === i ? 'bg-rose-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Section 0: Basic */}
      {section === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput label="First Name *" value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="Priya" error={errors.firstName} />
          <TextInput label="Last Name *" value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Sharma" error={errors.lastName} />
          <SelectInput label="Gender *" value={form.gender} onChange={e => set('gender', e.target.value)} error={errors.gender}
            options={[['male','Male'],['female','Female'],['other','Other']]} />
          <TextInput label="Date of Birth" type="date" value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} error={errors.dateOfBirth} />
          <TextInput label="Email" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="priya@email.com" error={errors.email} />
          <Field label="Phone (10 digits)" error={errors.phone}>
            <input
              type="tel"
              className={`input ${errors.phone ? 'border-red-400 focus:ring-red-400' : ''}`}
              placeholder="9876543210"
              value={form.phone}
              maxLength={10}
              inputMode="numeric"
              onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
            />
          </Field>
          <LocationSelect
            country={form.country}
            state={form.state}
            city={form.city}
            onChange={({ country, state, city }) => setForm(f => ({ ...f, country, state, city }))}
          />
          <TextInput label="Height (cm)" type="number" value={form.height} onChange={e => set('height', e.target.value)} placeholder="165" min="120" max="220" error={errors.height} />
          <SelectInput label="Marital Status" value={form.maritalStatus} onChange={e => set('maritalStatus', e.target.value)}
            options={[['never_married','Never Married'],['divorced','Divorced'],['widowed','Widowed'],['separated','Separated']]} />
          <TextInput label="Siblings" type="number" value={form.siblings} onChange={e => set('siblings', e.target.value)} placeholder="1" min="0" max="20" error={errors.siblings} />
          <TextInput label="Mother Tongue" value={form.motherTongue} onChange={e => set('motherTongue', e.target.value)} placeholder="Hindi" />
          <div className="md:col-span-2">
            <label className="label">Languages Known</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {LANGUAGES.map(l => (
                <button type="button" key={l} onClick={() => toggleArr('languagesKnown', l)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${form.languagesKnown.includes(l) ? 'bg-rose-600 text-white border-rose-600' : 'bg-white border-gray-200 text-gray-600 hover:border-rose-300'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <SelectInput label="Profile Type" value={form.profileType} onChange={e => set('profileType', e.target.value)}
            options={[['client','Client (Dashboard)'],['pool','Pool (Matching)']]} />
          <SelectInput label="Status" value={form.status} onChange={e => set('status', e.target.value)}
            options={[['active','Active'],['pending','Pending'],['matched','Matched'],['inactive','Inactive']]} />
        </div>
      )}

      {/* Section 1: Career */}
      {section === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput label="Current Company" value={form.currentCompany} onChange={e => set('currentCompany', e.target.value)} placeholder="Google India" />
          <TextInput label="Designation" value={form.designation} onChange={e => set('designation', e.target.value)} placeholder="Software Engineer" />
          <Field label="Annual Income (INR)" error={errors.income}>
            <input type="number" className={`input ${errors.income ? 'border-red-400' : ''}`} placeholder="1500000 (= ₹15L)"
              value={form.income} onChange={e => set('income', e.target.value)} min="0" />
          </Field>
          <TextInput label="Undergraduate College" value={form.undergraduateCollege} onChange={e => set('undergraduateCollege', e.target.value)} placeholder="IIT Bombay" />
          <TextInput label="Degree" value={form.degree} onChange={e => set('degree', e.target.value)} placeholder="B.Tech Computer Science" />
          <SelectInput label="Education Tier" value={form.educationTier} onChange={e => set('educationTier', e.target.value)}
            options={[['premium','Premium (IIT/IIM/NIT)'],['good','Good (Other Tier-1)'],['average','Average']]} />
        </div>
      )}

      {/* Section 2: Values */}
      {section === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectInput label="Religion" value={form.religion} onChange={e => set('religion', e.target.value)}
            options={[['','Select'], ...RELIGIONS.map(r => [r,r])]} />
          <TextInput label="Caste" value={form.caste} onChange={e => set('caste', e.target.value)} placeholder="Brahmin" />
          <SelectInput label="Manglik" value={form.manglik} onChange={e => set('manglik', e.target.value)}
            options={[['dont_know',"Don't Know"],['yes','Yes'],['no','No']]} />
          <SelectInput label="Family Type" value={form.familyType} onChange={e => set('familyType', e.target.value)}
            options={[['nuclear','Nuclear'],['joint','Joint'],['flexible','Flexible']]} />
          <SelectInput label="Diet" value={form.diet} onChange={e => set('diet', e.target.value)}
            options={[['vegetarian','Vegetarian'],['non-vegetarian','Non-Vegetarian'],['vegan','Vegan'],['jain','Jain'],['eggetarian','Eggetarian']]} />
          <SelectInput label="Smoking" value={form.smoking} onChange={e => set('smoking', e.target.value)}
            options={[['never','Never'],['occasionally','Occasionally'],['regularly','Regularly']]} />
          <SelectInput label="Drinking" value={form.drinking} onChange={e => set('drinking', e.target.value)}
            options={[['never','Never'],['occasionally','Occasionally'],['regularly','Regularly']]} />
          <div className="md:col-span-2">
            <label className="label">Hobbies & Interests</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {HOBBIES.map(h => (
                <button type="button" key={h} onClick={() => toggleArr('hobbies', h)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${form.hobbies.includes(h) ? 'bg-rose-600 text-white border-rose-600' : 'bg-white border-gray-200 text-gray-600 hover:border-rose-300'}`}>
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Preferences */}
      {section === 3 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectInput label="Want Kids" value={form.wantKids} onChange={e => set('wantKids', e.target.value)}
            options={[['yes','Yes'],['no','No'],['maybe','Maybe / Open']]} />
          <SelectInput label="Have Kids" value={form.haveKids} onChange={e => set('haveKids', e.target.value)}
            options={[['no','No'],['yes','Yes']]} />
          <SelectInput label="Open to Relocate" value={form.openToRelocate} onChange={e => set('openToRelocate', e.target.value)}
            options={[['yes','Yes'],['no','No'],['maybe','Maybe']]} />
          <SelectInput label="Open to Pets" value={form.openToPets} onChange={e => set('openToPets', e.target.value)}
            options={[['yes','Yes'],['no','No'],['maybe','Maybe']]} />
        </div>
      )}

      {/* Section 4: Bio */}
      {section === 4 && (
        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="label">About Me</label>
              <button type="button" onClick={generateBio} disabled={generatingBio || !form.firstName}
                className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold disabled:opacity-50">
                {generatingBio ? '✨ Generating…' : '✨ Generate with AI'}
              </button>
            </div>
            <textarea rows={5} className="input resize-none" placeholder="Write a bio or let AI generate one…"
              value={form.aboutMe} onChange={e => set('aboutMe', e.target.value)} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="label">Partner Expectations</label>
              <button type="button" onClick={generateExpectations} disabled={generatingExp || !form.firstName}
                className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold disabled:opacity-50">
                {generatingExp ? '✨ Generating…' : '✨ Generate with AI'}
              </button>
            </div>
            <textarea rows={5} className="input resize-none" placeholder="Describe what they're looking for…"
              value={form.partnerExpectations} onChange={e => set('partnerExpectations', e.target.value)} />
          </div>
          <p className="text-xs text-gray-400">💡 Fill in Basic and Career sections first for better AI-generated content.</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <button type="button" onClick={() => setSection(s => Math.max(0, s - 1))}
          disabled={section === 0} className="btn-secondary disabled:opacity-40">← Previous</button>
        {section < SECTIONS.length - 1 ? (
          <button type="button" onClick={() => setSection(s => s + 1)} className="btn-primary">Next →</button>
        ) : (
          <button type="submit" disabled={saving || !form.firstName || !form.lastName}
            className="btn-primary px-8 disabled:opacity-50">
            {saving ? 'Saving…' : submitLabel}
          </button>
        )}
      </div>
    </form>
  );
}
