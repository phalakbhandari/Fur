import { useState } from 'react';
import { Cross } from './ui/Glyph';
import { PetImage } from './PetImage';
import { ModalShell } from './ModalShell';
import { celebrate } from '../lib/celebrate';
import { CustomIcon } from './CustomIcon';
import { PawIcon } from './PawDecorations';

export const AdoptionFormModal = ({
  pet,
  isOpen,
  onClose,
  onSubmitSuccess,
  onGoToApplications,
  currentUser,
}) => {
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [housingType, setHousingType] = useState('Apartment');
  const [hasOtherPets, setHasOtherPets] = useState(false);
  const [petExperience, setPetExperience] = useState('Experienced');
  const [fitReason, setFitReason] = useState('');

  // UI state
  const [errorMessage, setErrorMessage] = useState(null);
  const [submittedApp, setSubmittedApp] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !pet) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!fullName.trim() || !email.trim() || !phone.trim() || !fitReason.trim()) {
      setErrorMessage('Looks like you missed something. Please complete the required fields.');
      return;
    }

    // Basic email check
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Generate Unique Application ID
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const generatedId = `FUR-2026-${randomNum}`;
      const now = new Date();
      const dateString = now.toISOString().split('T')[0];

      const newApplication = {
        id: generatedId,
        petId: pet.id,
        petName: pet.name,
        petBreed: pet.breed,
        petImage: pet.image,
        petType: pet.animalType,
        petLocation: pet.location,
        applicantName: fullName.trim(),
        applicantEmail: email.trim(),
        applicantPhone: phone.trim(),
        applicantAddress: address.trim() || pet.location,
        housingType,
        hasOtherPets,
        petExperience,
        fitReason: fitReason.trim(),
        dateApplied: dateString,
        currentStatus: 'Pending',
        // Link application to the signed-in user; undefined for legacy/unsigned submissions
        userId: currentUser ? currentUser.id : undefined,
        timelineNotes: {
          appliedAt: `${dateString} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          shelterNote: `Application successfully logged for ${pet.name}. Shelter coordinator is assigned to review your profile.`,
        },
      };

      celebrate({ particleCount: 100, spread: 70 });

      setIsSubmitting(false);
      setSubmittedApp(newApplication);
      onSubmitSuccess(newApplication);
    }, 600);
  };

  const handleResetModal = () => {
    setSubmittedApp(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <ModalShell onClose={onClose} labelledBy="adoption-form-title">
      <div
        id="adoption-form-modal-card"
        className="relative bg-cream rounded-[var(--radius-panel)] max-w-2xl w-full overflow-hidden shadow-lift ring-1 ring-ink/10 my-8 animate-scale-up"
      >
        {/* Close Button */}
        <button
          id="adoption-form-close-btn"
          onClick={handleResetModal}
          className="absolute top-5 right-5 z-30 grid h-10 w-10 place-items-center rounded-full bg-paper text-ink ring-1 ring-ink/10 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-ink hover:text-cream hover:rotate-90 cursor-pointer"
          title="Close"
        >
          <Cross className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-ink/8">
          <h2 id="adoption-form-title" className="text-2xl sm:text-3xl font-display text-ink">
            LET'S GET TO KNOW YOU
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted font-medium mt-0.5">
            A few details help the shelter understand whether this pet is a good fit for your home.
          </p>

          {/* Quick Pet Mini Header Card */}
          <div className="mt-3 flex items-center gap-3 bg-paper p-2.5 rounded-xl border border-ink/12">
            <PetImage
              src={pet.image}
              alt={pet.name}
              className="w-12 h-12 rounded-lg object-cover object-center border border-ink/10 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-display text-ink text-base truncate">{pet.name}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-paper text-ink-muted border border-ink/8">
                  {pet.age} · {pet.gender}
                </span>
              </div>
              <p className="text-xs font-semibold text-ink-muted truncate">
                {pet.location} · {pet.shelterName}
              </p>
            </div>
          </div>
        </div>

        {/* SUCCESS VIEW */}
        {submittedApp ? (
          <div className="p-7 sm:p-9 text-center space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-sage-wash text-moss border border-moss/40 flex items-center justify-center mx-auto shadow-soft">
              <CustomIcon name="circle-tick" className="w-10 h-10" />
            </div>

            <div>
              <span className="px-2.5 py-0.5 rounded-md bg-paper border border-ink/12 text-ink-muted text-[11px] font-semibold uppercase">
                Reference ID: {submittedApp.id}
              </span>
              <h3 className="text-2xl sm:text-3xl font-display text-ink mt-2">
                APPLICATION SENT! 🐾
              </h3>
              <p className="text-sm font-semibold text-moss mt-1">
                We've got it. You can check your application status anytime from My Applications.
              </p>
              <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto mt-2 leading-relaxed font-medium">
                Thank you, <strong>{submittedApp.applicantName}</strong>! The shelter looking after{' '}
                {submittedApp.petName} has received your application. You can follow updates and
                next steps in My Applications.
              </p>
            </div>

            {/* Quick Status Preview */}
            <div className="bg-paper p-4 rounded-xl border border-ink/12 max-w-md mx-auto text-left text-xs space-y-1.5 font-bold">
              <div className="flex justify-between">
                <span className="text-ink-muted">Applicant:</span>
                <span className="text-ink">{submittedApp.applicantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Pet:</span>
                <span className="text-ink">
                  {submittedApp.petName} ({submittedApp.petBreed})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Date:</span>
                <span className="text-ink">{submittedApp.dateApplied}</span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-ink/8">
                <span className="text-ink-muted">Status:</span>
                <span className="text-moss font-semibold">● Application Received</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <button
                id="modal-success-view-applications-btn"
                onClick={() => {
                  handleResetModal();
                  onGoToApplications();
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-moss hover:bg-[#355c3b] text-cream font-semibold text-xs uppercase tracking-wider border border-ink/10 shadow-soft flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Check status</span>
                <CustomIcon name="right-arrow" className="w-4 h-4" />
              </button>

              <button
                id="modal-success-browse-more-btn"
                onClick={handleResetModal}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-paper hover:bg-ochre-wash text-ink font-semibold text-xs border border-ink/10 shadow-soft cursor-pointer"
              >
                BROWSE MORE PETS
              </button>
            </div>
          </div>
        ) : (
          /* APPLICATION INPUT FORM */
          <form
            onSubmit={handleSubmit}
            className="p-5 sm:p-7 space-y-4 max-h-[60vh] overflow-y-auto"
          >
            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-brick text-brick text-xs font-semibold flex items-center gap-2">
                <CustomIcon name="exclamation" className="w-4 h-4 shrink-0 text-brick" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Section: YOUR DETAILS */}
            <div className="space-y-3">
              <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider block border-b border-ink/8 pb-1">
                YOUR DETAILS
              </span>

              {/* Field: Full Name */}
              <div>
                <label
                  htmlFor="app-input-fullname"
                  className="text-xs font-semibold text-ink uppercase tracking-wider mb-1 flex items-center gap-1.5"
                >
                  <CustomIcon name="user" className="w-3.5 h-3.5 text-ink-muted" />
                  Full Name <span className="text-brick">*</span>
                </label>
                <input
                  id="app-input-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Maya Deshmukh"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-paper border border-ink/12 text-xs sm:text-sm text-ink font-bold placeholder:text-ink-faint focus:outline-none focus:border-ink/10 focus:bg-paper"
                />
              </div>

              {/* Field: Contact Number & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="app-input-email"
                    className="text-xs font-semibold text-ink uppercase tracking-wider mb-1 flex items-center gap-1.5"
                  >
                    <CustomIcon name="mail" className="w-3.5 h-3.5 text-ink-muted" />
                    Email Address <span className="text-brick">*</span>
                  </label>
                  <input
                    id="app-input-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. maya@example.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-paper border border-ink/12 text-xs sm:text-sm text-ink font-bold placeholder:text-ink-faint focus:outline-none focus:border-ink/10 focus:bg-paper"
                  />
                </div>

                <div>
                  <label
                    htmlFor="app-input-phone"
                    className="text-xs font-semibold text-ink uppercase tracking-wider mb-1 flex items-center gap-1.5"
                  >
                    <CustomIcon name="phone" className="w-3.5 h-3.5 text-ink-muted" />
                    Contact Number <span className="text-brick">*</span>
                  </label>
                  <input
                    id="app-input-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98200 12345"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-paper border border-ink/12 text-xs sm:text-sm text-ink font-bold placeholder:text-ink-faint focus:outline-none focus:border-ink/10 focus:bg-paper"
                  />
                </div>
              </div>
            </div>

            {/* Address — recorded on the application, so worth asking for. */}
            <div>
              <label
                htmlFor="app-input-address"
                className="text-xs font-semibold text-ink uppercase tracking-wider mb-1 flex items-center gap-1.5"
              >
                <CustomIcon name="location" className="w-3.5 h-3.5 text-ink-muted" />
                Where you live
              </label>
              <input
                id="app-input-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Jayanagar 4th Block, Bengaluru"
                autoComplete="street-address"
                className="w-full px-3.5 py-2.5 rounded-xl bg-paper border border-ink/12 text-xs sm:text-sm text-ink font-bold placeholder:text-ink-faint focus:outline-none focus:border-ink/10 focus:bg-paper"
              />
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-paper border border-ink/8">
              <input
                id="app-checkbox-other-pets"
                type="checkbox"
                checked={hasOtherPets}
                onChange={(e) => setHasOtherPets(e.target.checked)}
                className="mt-0.5 w-4 h-4 shrink-0 accent-ink cursor-pointer"
              />
              <label
                htmlFor="app-checkbox-other-pets"
                className="text-xs font-bold text-ink leading-relaxed cursor-pointer"
              >
                I already have other pets at home.
                <span className="block font-medium text-ink-muted mt-0.5">
                  Shelters use this to judge whether an animal will settle in, not to rule you out.
                </span>
              </label>
            </div>

            {/* Section: YOUR HOME & YOUR EXPERIENCE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label
                  htmlFor="app-select-housing"
                  className="text-xs font-semibold text-ink uppercase tracking-wider mb-1 flex items-center gap-1.5"
                >
                  <CustomIcon name="home" className="w-3.5 h-3.5 text-ink-muted" />
                  YOUR HOME
                </label>
                <select
                  id="app-select-housing"
                  value={housingType}
                  onChange={(e) => setHousingType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-paper border border-ink/12 text-xs font-semibold text-ink focus:outline-none focus:border-ink/10 focus:bg-paper"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="House with Yard">House with Yard</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Farm / Acreage">Farm / Acreage</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="app-select-experience"
                  className="text-xs font-semibold text-ink uppercase tracking-wider mb-1 flex items-center gap-1.5"
                >
                  <CustomIcon name="sparkle" className="w-3.5 h-3.5 text-ink-muted" />
                  YOUR EXPERIENCE
                </label>
                <select
                  id="app-select-experience"
                  value={petExperience}
                  onChange={(e) => setPetExperience(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-paper border border-ink/12 text-xs font-semibold text-ink focus:outline-none focus:border-ink/10 focus:bg-paper"
                >
                  <option value="Experienced">Experienced pet parent</option>
                  <option value="First-time owner">First-time pet owner</option>
                  <option value="Lifelong pet parent">Lifelong pet parent</option>
                </select>
              </div>
            </div>

            {/* Section: WHY THIS PET? */}
            <div className="pt-2">
              <label
                htmlFor="app-textarea-fit-reason"
                className="text-xs font-semibold text-ink uppercase tracking-wider mb-1 flex items-center gap-1.5"
              >
                <CustomIcon name="message" className="w-3.5 h-3.5 text-ink-muted" />
                WHY THIS PET? <span className="text-brick">*</span>
              </label>
              <p className="text-[11px] text-ink-muted font-medium mb-1.5">
                Tell us a little about why you think you'd be a good fit for each other.
              </p>
              <textarea
                id="app-textarea-fit-reason"
                value={fitReason}
                onChange={(e) => setFitReason(e.target.value)}
                placeholder={`Tell us a little about your routine, your home, and why ${pet.name} would be happy with you...`}
                rows={3}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-paper border border-ink/12 text-xs sm:text-sm text-ink font-bold placeholder:text-ink-faint focus:outline-none focus:border-ink/10 focus:bg-paper resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                id="app-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-ink hover:bg-[#111] text-cream font-semibold text-sm tracking-wider border border-ink/10 shadow-card hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Sending application...</span>
                ) : (
                  <>
                    <PawIcon className="w-4 h-4 fill-cream" />
                    <span>Send application</span>
                  </>
                )}
              </button>

              <p className="text-center text-[10px] font-bold text-ink-muted mt-2">
                Your application goes directly to the shelter team.
              </p>
            </div>
          </form>
        )}
      </div>
    </ModalShell>
  );
};
