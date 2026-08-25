import { useRef, useState } from 'react';
import { Cross } from './ui/Glyph';
import { CustomIcon } from './CustomIcon';
import { ModalShell } from './ModalShell';
import { PawIcon } from './PawDecorations';
import { processPetPhoto } from '../lib/image';

const ANIMAL_TYPES = ['Dog', 'Cat', 'Rabbit', 'Bird', 'Other'];
const SIZES = ['Small', 'Medium', 'Large'];
const GENDERS = ['Male', 'Female'];
const TRAIT_SUGGESTIONS = [
  'Playful',
  'Calm',
  'Affectionate',
  'Curious',
  'Gentle',
  'Energetic',
  'Loyal',
  'Shy',
  'Independent',
  'Social',
];

const EMPTY = {
  name: '',
  animalType: 'Dog',
  breed: '',
  age: '',
  gender: 'Male',
  size: 'Medium',
  location: '',
  description: '',
  contactEmail: '',
};

const fieldClass =
  'w-full px-3.5 py-2.5 rounded-xl bg-paper border border-ink/12 text-sm text-ink font-bold placeholder:text-ink-faint focus:outline-none focus:border-ink/10 focus:bg-paper transition-colors';

const labelClass = 'block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5';

function validate(form, photo) {
  const errors = {};

  if (!form.name.trim()) errors.name = 'Give the pet a name.';
  else if (form.name.trim().length > 30) errors.name = 'Keep the name under 30 characters.';

  if (!form.breed.trim()) errors.breed = 'Breed or mix, as best you know it.';
  if (!form.age.trim()) errors.age = 'Roughly how old? "8 months" is fine.';
  if (!form.location.trim()) errors.location = 'Where is the pet right now?';

  const description = form.description.trim();
  if (description.length < 40) {
    errors.description = 'Give adopters something to go on — at least 40 characters.';
  } else if (description.length > 600) {
    errors.description = 'Keep it under 600 characters.';
  }

  if (!form.contactEmail.trim()) errors.contactEmail = 'Adopters need a way to reach you.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail.trim())) {
    errors.contactEmail = 'That does not look like a valid email address.';
  }

  if (!photo) errors.photo = 'A photo does most of the work. Please add one.';

  return errors;
}

/**
 * Lets a visitor put a pet of their own up for adoption, which is what turns
 * the app from a catalogue into something two-sided.
 *
 * Listings are held in the browser alongside favourites and applications —
 * there is no server behind this yet, so a listing is visible to the person
 * who created it and nobody else. The form is written so that swapping the
 * submit handler for a real API call is the only change needed.
 */
export const ListPetModal = ({ isOpen, onClose, onSubmit, currentUser }) => {
  const [form, setForm] = useState(EMPTY);
  const [traits, setTraits] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [photoError, setPhotoError] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const update = (field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const toggleTrait = (trait) => {
    setTraits((prev) =>
      prev.includes(trait)
        ? prev.filter((t) => t !== trait)
        : prev.length >= 4
          ? prev
          : [...prev, trait],
    );
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhotoError(null);
    try {
      const dataUrl = await processPetPhoto(file);
      setPhoto(dataUrl);
      setErrors((prev) => ({ ...prev, photo: undefined }));
    } catch (error) {
      setPhoto(null);
      setPhotoError(error.message);
    } finally {
      // Allows re-picking the same file after an error.
      event.target.value = '';
    }
  };

  const reset = () => {
    setForm(EMPTY);
    setTraits([]);
    setPhoto(null);
    setPhotoError(null);
    setErrors({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const found = validate(form, photo);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      document.querySelector('[aria-invalid="true"], #list-pet-name')?.focus();
      return;
    }

    setIsSubmitting(true);

    const listing = {
      id: `listing-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: form.name.trim(),
      animalType: form.animalType,
      breed: form.breed.trim(),
      age: form.age.trim(),
      ageCategory: 'Unknown',
      gender: form.gender,
      size: form.size,
      location: form.location.trim(),
      description: form.description.trim(),
      personality: traits.length > 0 ? traits : ['Looking for a home'],
      goodWith: [],
      status: 'AVAILABLE',
      image: photo,
      medicalInfo: {
        vaccinated: false,
        spayedNeutered: false,
        microchipped: false,
        healthNotes: 'Details to be confirmed with the person listing this pet.',
      },
      weight: 'Not recorded',
      activityLevel: 'Not recorded',
      adoptionFee: 'Contact lister',
      shelterName: currentUser?.name ? `Listed by ${currentUser.name}` : 'Community listing',
      contactEmail: form.contactEmail.trim().toLowerCase(),
      listedByUserId: currentUser?.id ?? null,
      isCommunityListing: true,
      dateAdded: new Date().toISOString().slice(0, 10),
    };

    onSubmit(listing);
    setIsSubmitting(false);
    reset();
    onClose();
  };

  const describeCount = form.description.trim().length;

  return (
    <ModalShell onClose={handleClose} labelledBy="list-pet-title">
      <div className="relative bg-cream rounded-[var(--radius-panel)] max-w-2xl w-full overflow-hidden shadow-lift ring-1 ring-ink/10 animate-scale-up my-auto">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close this form"
          className="absolute top-5 right-5 z-30 grid h-10 w-10 place-items-center rounded-full bg-paper text-ink ring-1 ring-ink/10 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-ink hover:text-cream hover:rotate-90 cursor-pointer"
        >
          <Cross className="w-4 h-4" />
        </button>

        <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-ink/8">
          <div className="flex items-center gap-3 pr-10">
            <div className="w-11 h-11 shrink-0 rounded-xl bg-ochre-wash border border-ink/10 flex items-center justify-center shadow-soft">
              <PawIcon className="w-6 h-6 fill-ink" />
            </div>
            <div>
              <h2
                id="list-pet-title"
                className="text-2xl sm:text-3xl font-display text-ink leading-none"
              >
                List a pet
              </h2>
              <p className="text-xs text-ink-muted font-bold mt-1 leading-snug">
                Found a stray, or rehoming your own? Put them in front of people looking.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="p-6 sm:p-8 space-y-5 max-h-[65vh] overflow-y-auto"
        >
          {/* Photo */}
          <div>
            <span className={labelClass}>Photo</span>
            <div className="flex items-start gap-4">
              <div className="w-28 h-28 shrink-0 rounded-2xl border border-dashed border-ink/15 bg-paper overflow-hidden flex items-center justify-center">
                {photo ? (
                  <img
                    src={photo}
                    alt="The pet you are listing"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <CustomIcon name="paw-illustration" className="w-10 h-10 opacity-40" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  className="sr-only"
                  id="list-pet-photo"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-describedby={photoError || errors.photo ? 'list-pet-photo-error' : undefined}
                  className="px-4 py-2.5 rounded-xl bg-ochre-wash hover:bg-ochre text-ink font-semibold text-xs uppercase tracking-wider border border-ink/10 shadow-soft hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  {photo ? 'Choose a different photo' : 'Upload a photo'}
                </button>
                <p className="text-[11px] text-ink-muted font-bold mt-2 leading-relaxed">
                  JPG, PNG, or WebP, up to 8 MB. It gets resized in your browser before it is saved.
                </p>
                {(photoError || errors.photo) && (
                  <p
                    id="list-pet-photo-error"
                    role="alert"
                    className="text-[11px] font-semibold text-brick mt-1.5"
                  >
                    {photoError || errors.photo}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Name + type */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="list-pet-name" className={labelClass}>
                Name
              </label>
              <input
                id="list-pet-name"
                value={form.name}
                onChange={update('name')}
                placeholder="Biscuit"
                aria-invalid={errors.name ? 'true' : undefined}
                aria-describedby={errors.name ? 'list-pet-name-error' : undefined}
                className={fieldClass}
              />
              {errors.name && (
                <p
                  id="list-pet-name-error"
                  role="alert"
                  className="text-[11px] font-semibold text-brick mt-1"
                >
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="list-pet-type" className={labelClass}>
                Species
              </label>
              <select
                id="list-pet-type"
                value={form.animalType}
                onChange={update('animalType')}
                className={fieldClass}
              >
                {ANIMAL_TYPES.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="list-pet-breed" className={labelClass}>
                Breed or mix
              </label>
              <input
                id="list-pet-breed"
                value={form.breed}
                onChange={update('breed')}
                placeholder="Indie / Labrador mix"
                aria-invalid={errors.breed ? 'true' : undefined}
                className={fieldClass}
              />
              {errors.breed && (
                <p role="alert" className="text-[11px] font-semibold text-brick mt-1">
                  {errors.breed}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="list-pet-age" className={labelClass}>
                Age
              </label>
              <input
                id="list-pet-age"
                value={form.age}
                onChange={update('age')}
                placeholder="8 months"
                aria-invalid={errors.age ? 'true' : undefined}
                className={fieldClass}
              />
              {errors.age && (
                <p role="alert" className="text-[11px] font-semibold text-brick mt-1">
                  {errors.age}
                </p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="list-pet-gender" className={labelClass}>
                Sex
              </label>
              <select
                id="list-pet-gender"
                value={form.gender}
                onChange={update('gender')}
                className={fieldClass}
              >
                {GENDERS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="list-pet-size" className={labelClass}>
                Size
              </label>
              <select
                id="list-pet-size"
                value={form.size}
                onChange={update('size')}
                className={fieldClass}
              >
                {SIZES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="list-pet-location" className={labelClass}>
                Area
              </label>
              <input
                id="list-pet-location"
                value={form.location}
                onChange={update('location')}
                placeholder="Indiranagar, Bengaluru"
                aria-invalid={errors.location ? 'true' : undefined}
                className={fieldClass}
              />
              {errors.location && (
                <p role="alert" className="text-[11px] font-semibold text-brick mt-1">
                  {errors.location}
                </p>
              )}
            </div>
          </div>

          {/* Traits */}
          <fieldset>
            <legend className={labelClass}>
              Temperament{' '}
              <span className="text-ink-faint normal-case font-bold">— pick up to four</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {TRAIT_SUGGESTIONS.map((trait) => {
                const active = traits.includes(trait);
                const disabled = !active && traits.length >= 4;
                return (
                  <button
                    key={trait}
                    type="button"
                    onClick={() => toggleTrait(trait)}
                    disabled={disabled}
                    aria-pressed={active}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider border transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed ${
                      active
                        ? 'bg-ink text-cream border-ink/10 shadow-soft'
                        : 'bg-paper text-ink border-ink/12 hover:border-ink/10'
                    }`}
                  >
                    {trait}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Description */}
          <div>
            <label htmlFor="list-pet-description" className={labelClass}>
              Their story
            </label>
            <textarea
              id="list-pet-description"
              value={form.description}
              onChange={update('description')}
              rows={4}
              placeholder="How you found them, what they are like around people, anything an adopter should know."
              aria-invalid={errors.description ? 'true' : undefined}
              className={`${fieldClass} resize-y`}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.description ? (
                <p role="alert" className="text-[11px] font-semibold text-brick">
                  {errors.description}
                </p>
              ) : (
                <span />
              )}
              <span
                className={`text-[11px] font-semibold tabular-nums ${describeCount > 600 ? 'text-brick' : 'text-ink-faint'}`}
              >
                {describeCount} / 600
              </span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <label htmlFor="list-pet-email" className={labelClass}>
              Contact email
            </label>
            <input
              id="list-pet-email"
              type="email"
              value={form.contactEmail}
              onChange={update('contactEmail')}
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={errors.contactEmail ? 'true' : undefined}
              className={fieldClass}
            />
            {errors.contactEmail && (
              <p role="alert" className="text-[11px] font-semibold text-brick mt-1">
                {errors.contactEmail}
              </p>
            )}
          </div>

          <p className="text-[11px] text-ink-muted font-bold leading-relaxed bg-paper border border-ink/8 rounded-xl p-3">
            Listings are saved in this browser only. Nothing is uploaded anywhere, and clearing your
            site data removes them.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-ink hover:bg-[#111] text-cream font-semibold text-sm tracking-wider border border-ink/10 shadow-card hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <PawIcon className="w-4 h-4 fill-cream" />
            <span>{isSubmitting ? 'Publishing…' : 'Publish this listing'}</span>
          </button>
        </form>
      </div>
    </ModalShell>
  );
};
