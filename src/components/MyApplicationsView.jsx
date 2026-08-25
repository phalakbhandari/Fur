import { useState } from 'react';
import { PetImage } from './PetImage';
import { CustomIcon } from './CustomIcon';
import { PawIcon } from './PawDecorations';
import { AnimalMarqueeTape } from './AnimalMarqueeTape';

export const MyApplicationsView = ({
  applications,
  currentUser,
  onSignIn,
  onExplorePets,
  onSelectPetById,
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [activeAppDetail, setActiveAppDetail] = useState(null);

  // Only show applications that belong to the current signed-in user.
  // Legacy applications without a userId are excluded from all signed-in views.
  const userApplications = currentUser
    ? applications.filter((app) => app.userId !== undefined && app.userId === currentUser.id)
    : [];

  const filteredApplications = userApplications.filter((app) => {
    if (selectedStatusFilter === 'All') return true;
    if (selectedStatusFilter === 'Active')
      return app.currentStatus === 'Pending' || app.currentStatus === 'Under Review';
    if (selectedStatusFilter === 'Approved')
      return app.currentStatus === 'Approved' || app.currentStatus === 'Adopted';
    return app.currentStatus === selectedStatusFilter;
  });

  // Render Visual Timeline based on status
  const renderTimeline = (status) => {
    if (status === 'Rejected') {
      return (
        <div className="flex items-center justify-between relative max-w-md w-full pt-4 pb-2">
          {/* Connector line */}
          <div className="absolute top-7 left-6 right-6 h-0.5 bg-red-200 -z-0" />

          {/* Stage 1: Applied */}
          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full bg-moss text-cream flex items-center justify-center text-xs font-semibold shadow-xs">
              ✓
            </div>
            <span className="text-[11px] font-bold text-moss mt-1">Applied</span>
          </div>

          {/* Stage 2: Reviewed */}
          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full bg-moss text-cream flex items-center justify-center text-xs font-semibold shadow-xs">
              ✓
            </div>
            <span className="text-[11px] font-bold text-moss mt-1">Reviewed</span>
          </div>

          {/* Stage 3: Not Approved */}
          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full bg-ink text-cream flex items-center justify-center text-xs font-semibold shadow-xs">
              ×
            </div>
            <span className="text-[11px] font-bold text-brick mt-1">Not Approved</span>
          </div>
        </div>
      );
    }

    // Normal progression stages: Applied -> Under Review -> Approved -> Adopted
    const stages = [
      { key: 'Applied', label: 'Applied' },
      { key: 'Under Review', label: 'Under Review' },
      { key: 'Approved', label: 'Approved' },
      { key: 'Adopted', label: 'Adopted' },
    ];

    const getStageIndex = (s) => {
      switch (s) {
        case 'Pending':
          return 0;
        case 'Under Review':
          return 1;
        case 'Approved':
          return 2;
        case 'Adopted':
          return 3;
        default:
          return 0;
      }
    };

    const currentStageIndex = getStageIndex(status);

    return (
      <div className="flex items-center justify-between relative max-w-lg w-full pt-4 pb-2">
        {/* Connector line */}
        <div className="absolute top-7.5 left-6 right-6 h-1 bg-ochre-wash -z-0" />

        {/* Active progress highlight line */}
        <div
          className="absolute top-7.5 left-6 h-1 bg-moss transition-all duration-500 -z-0"
          style={{ width: `${(currentStageIndex / (stages.length - 1)) * 90}%` }}
        />

        {stages.map((stage, idx) => {
          const isCompleted = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;

          return (
            <div key={stage.key} className="flex flex-col items-center z-10">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  isCompleted
                    ? 'bg-moss text-cream shadow-xs'
                    : isCurrent
                      ? 'bg-ink text-cream ring-4 ring-ochre shadow-md scale-110'
                      : 'bg-paper border border-ochre/25 text-stone-400'
                }`}
              >
                {isCompleted ? '✓' : isCurrent ? '●' : '○'}
              </div>
              <span
                className={`text-[10px] sm:text-[11px] font-semibold mt-1 text-center whitespace-nowrap ${
                  isCurrent
                    ? 'text-ink font-semibold'
                    : isCompleted
                      ? 'text-moss'
                      : 'text-stone-400'
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sage-wash text-moss border border-moss/20">
            APPROVED
          </span>
        );
      case 'Adopted':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-moss text-cream">
            ADOPTED
          </span>
        );
      case 'Under Review':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-linen text-ink-muted border border-ink/20">
            UNDER REVIEW
          </span>
        );
      case 'Pending':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-mist text-ink border border-ink/8">
            APPLICATION SENT
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-brick border border-red-200">
            REJECTED
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-mist text-ink border border-ink/8">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="py-10 lg:py-16 min-h-[calc(100vh-5rem)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SIGN-IN GATE — shown when no user is signed in */}
        {!currentUser ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 px-4">
            <div className="w-20 h-20 rounded-[28px] bg-ochre-wash border border-ink/10 flex items-center justify-center mx-auto shadow-card">
              <CustomIcon name="file" className="w-10 h-10 text-ink" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-ochre-wash text-ink text-xs font-semibold uppercase tracking-wider mb-3 border border-ink/10">
                <PawIcon className="w-3.5 h-3.5 fill-ochre" />
                <span>Sign In Required</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-display text-ink">Your applications</h2>
              <p className="text-sm text-ink-muted font-medium mt-3 max-w-sm mx-auto">
                Please sign in to view your applications and track your adoption status.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                id="applications-signin-btn"
                onClick={onSignIn}
                className="px-7 py-3.5 rounded-xl bg-ink hover:bg-[#111] text-cream font-semibold text-xs border border-ink/10 shadow-card hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <CustomIcon name="user" className="w-4 h-4" white />
                <span>Sign In</span>
              </button>
              <button
                onClick={onExplorePets}
                className="px-7 py-3.5 rounded-xl bg-paper hover:bg-ochre-wash text-ink font-semibold text-xs border border-ink/10 shadow-soft hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <CustomIcon name="discover" className="w-4 h-4" />
                <span>Continue Browsing</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-ochre-wash text-ink text-xs font-semibold uppercase tracking-wider mb-2 border border-ink/10">
                  <CustomIcon name="file" className="w-3.5 h-3.5 text-moss" />
                  <span>Application Status</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display text-ink tracking-normal">
                  YOUR APPLICATIONS
                </h1>

                <p className="text-xs sm:text-sm text-ink-muted font-medium mt-1 max-w-xl">
                  Here's where you can check what's happening with your applications.
                </p>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-2 bg-paper p-1.5 rounded-2xl border border-ink/10 shadow-soft">
                {['All', 'Active', 'Approved'].map((tab) => (
                  <button
                    key={tab}
                    id={`app-filter-tab-${tab.toLowerCase()}`}
                    onClick={() => setSelectedStatusFilter(tab)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      selectedStatusFilter === tab
                        ? 'bg-ink text-cream shadow-soft'
                        : 'text-ink hover:bg-ochre-wash'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Applications List */}
            {filteredApplications.length > 0 ? (
              <div className="space-y-6">
                {filteredApplications.map((app) => (
                  <div
                    key={app.id}
                    id={`app-card-${app.id}`}
                    className="bg-paper rounded-[28px] p-6 sm:p-8 border border-ink/10 shadow-card transition-all space-y-6"
                  >
                    {/* Top Row: Pet Details + Status Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <PetImage
                          src={app.petImage}
                          alt={app.petName}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover object-center border border-ink/10 shadow-soft shrink-0"
                        />

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-2xl sm:text-3xl font-display text-ink">
                              {app.petName}
                            </h3>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-ochre-wash text-ink border border-ink/10">
                              {app.petType}
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm font-bold text-ink-muted mt-0.5">
                            {app.petBreed} · {app.petLocation}
                          </p>

                          <div className="flex items-center gap-3 text-xs text-ink-muted font-bold mt-1">
                            <span>
                              ID: <strong className="text-ink">{app.id}</strong>
                            </span>
                            <span>•</span>
                            <span>
                              Applied: <strong>{app.dateApplied}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="self-start sm:self-center flex items-center gap-2">
                        <span className="text-xs font-bold text-ink-muted">Status:</span>
                        {getStatusBadge(app.currentStatus)}
                      </div>
                    </div>

                    {/* VISUAL TIMELINE COMPONENT */}
                    <div className="bg-paper p-4 sm:p-6 rounded-2xl border border-ink/8 shadow-soft/10">
                      <h4 className="text-xs font-semibold text-ink uppercase tracking-wider mb-2">
                        Application Timeline
                      </h4>
                      {renderTimeline(app.currentStatus)}
                    </div>

                    {/* Shelter Coordinator Note */}
                    {app.timelineNotes?.shelterNote && (
                      <div className="p-3.5 rounded-2xl bg-paper border border-ink/8 flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-ochre-wash border border-ink/10 text-ink shrink-0">
                          <CustomIcon name="message" className="w-4 h-4 text-ink" />
                        </div>
                        <div>
                          <h5 className="text-xs font-semibold text-ink uppercase">Shelter Note</h5>
                          <p className="text-xs text-ink-muted font-medium mt-0.5 leading-relaxed">
                            {app.timelineNotes.shelterNote}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Card Action Footer */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-ink/8">
                      <div className="flex items-center gap-2 text-xs font-semibold text-moss">
                        <CustomIcon name="tick" className="w-4 h-4 text-moss" />
                        <span>Direct Shelter Application · Verified Process</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          id={`app-view-pet-btn-${app.id}`}
                          onClick={() => onSelectPetById(app.petId)}
                          className="px-4 py-2 rounded-xl bg-paper hover:bg-ochre-wash text-ink font-semibold text-xs uppercase tracking-wider border border-ink/10 shadow-soft transition-all cursor-pointer"
                        >
                          View {app.petName}'s Profile
                        </button>

                        <button
                          id={`app-details-btn-${app.id}`}
                          onClick={() => setActiveAppDetail(app)}
                          className="px-4 py-2 rounded-xl bg-ink hover:bg-[#111] text-cream font-semibold text-xs uppercase tracking-wider border border-ink/10 shadow-soft transition-all cursor-pointer"
                        >
                          Application Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty Applications State */
              <div className="bg-paper rounded-[28px] border border-ink/10 shadow-card p-10 text-center max-w-lg mx-auto space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-ochre-wash border border-ink/10 flex items-center justify-center mx-auto text-ink shadow-soft">
                  <PawIcon className="w-8 h-8 fill-ochre" />
                </div>
                <h3 className="text-2xl font-display text-ink">No applications here yet</h3>
                <p className="text-xs sm:text-sm text-ink-muted font-medium">
                  Ready to find a friend? Browse available pets and send in an application to get
                  started.
                </p>
                <button
                  id="empty-app-explore-btn"
                  onClick={onExplorePets}
                  className="px-6 py-3 rounded-xl bg-ink hover:bg-[#111] text-cream font-semibold text-xs border border-ink/10 shadow-card transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <CustomIcon name="discover" className="w-4 h-4" />
                  <span>Browse Pets</span>
                </button>
              </div>
            )}

            {/* Detailed Application Modal */}
            {activeAppDetail && (
              <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in">
                <div className="relative bg-cream rounded-[var(--radius-panel)] max-w-lg w-full p-6 sm:p-8 border border-ink/10 shadow-lift space-y-4 animate-scale-up">
                  <div className="flex items-center justify-between border-b border-ink/8 pb-3">
                    <div>
                      <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
                        Application Details
                      </span>
                      <h3 className="text-xl font-display text-ink">ID: {activeAppDetail.id}</h3>
                    </div>
                    <button
                      onClick={() => setActiveAppDetail(null)}
                      className="p-2 rounded-xl bg-paper hover:bg-ink hover:text-cream text-ink border border-ink/10 shadow-soft cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="bg-paper p-3 rounded-xl border border-ink/8">
                      <span className="font-bold text-ink-muted block text-[10px] uppercase">
                        Pet
                      </span>
                      <span className="text-sm font-display text-ink">
                        {activeAppDetail.petName} ({activeAppDetail.petBreed})
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="bg-paper p-3 rounded-xl border border-ink/8">
                        <span className="font-bold text-ink-muted block text-[10px] uppercase">
                          Applicant
                        </span>
                        <span className="font-bold text-ink">{activeAppDetail.applicantName}</span>
                      </div>
                      <div className="bg-paper p-3 rounded-xl border border-ink/8">
                        <span className="font-bold text-ink-muted block text-[10px] uppercase">
                          Contact
                        </span>
                        <span className="font-bold text-ink">{activeAppDetail.applicantPhone}</span>
                      </div>
                    </div>

                    <div className="bg-paper p-3 rounded-xl border border-ink/8">
                      <span className="font-bold text-ink-muted block text-[10px] uppercase">
                        Home & Experience
                      </span>
                      <span className="font-bold text-ink">
                        {activeAppDetail.housingType} · {activeAppDetail.petExperience}
                      </span>
                    </div>

                    <div className="bg-paper p-3 rounded-xl border border-ink/8">
                      <span className="font-bold text-ink-muted block text-[10px] uppercase">
                        Why this pet
                      </span>
                      <p className="text-ink-muted italic mt-0.5 font-medium">
                        "{activeAppDetail.fitReason}"
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveAppDetail(null)}
                    className="w-full py-3 rounded-xl bg-ink text-cream font-semibold text-xs uppercase tracking-wider border border-ink/10 shadow-card cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Moving Animal Icons Marquee Tape above Footer */}
            <AnimalMarqueeTape className="mt-12 mb-2 sm:mt-16 sm:mb-4" />
          </>
        )}
      </div>
    </div>
  );
};
