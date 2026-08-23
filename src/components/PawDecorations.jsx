export const PawIcon = ({ className = 'w-6 h-6', color = 'currentColor' }) => {
  return (
    <svg viewBox="0 0 24 24" fill={color} className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Main pad */}
      <path d="M12 11.5C9.5 11.5 7.5 13.5 7.5 16.5C7.5 19 9.5 21 12 21C14.5 21 16.5 19 16.5 16.5C16.5 13.5 14.5 11.5 12 11.5Z" />
      {/* Toe pads */}
      <circle cx="6.5" cy="10" r="2.2" />
      <circle cx="10" cy="5.8" r="2.2" />
      <circle cx="14" cy="5.8" r="2.2" />
      <circle cx="17.5" cy="10" r="2.2" />
    </svg>
  );
};
