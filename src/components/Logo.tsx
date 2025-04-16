// src/components/Logo.tsx
const Logo = () => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="20"
        cy="20"
        r="18"
        stroke="#646cff"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20C28 24.4183 24.4183 28 20 28"
        stroke="#535bf2"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="20" cy="20" r="4" fill="#646cff" />
      <path
        d="M20 28L20 36"
        stroke="#535bf2"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M15 32L25 32"
        stroke="#535bf2"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Logo;
