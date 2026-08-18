import React from "react";

const Donate = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="58"
    height="36"
    viewBox="0 0 58 36"
    fill="none"
  >
    <g filter="url(#filter0_i_27_6)">
      <path
        d="M0.359864 36V30.1513L12.441 17.8487C14.5488 15.7311 16.0911 13.6639 16.0911 11.5966C16.0911 9.37815 14.6516 7.86555 12.2354 7.86555C9.71634 7.86555 7.91701 9.47899 6.94024 11.6975L0 7.71428C2.31341 2.47059 7.14588 0 12.1326 0C18.5587 0 24.3165 4.13445 24.3165 11.2437C24.3165 15.479 22.0031 19.1092 18.7129 22.3361L12.7495 28.2353H24.8306V36H0.359864Z"
        fill="url(#paint0_linear_27_6)"
      />
      <path
        d="M58 36H48.6435L42.5772 25.8151L36.511 36H27.1545L37.899 17.8992L26.8909 0H36.3818L42.5772 10.0336L48.5091 0H58L47.2555 17.8992L58 36Z"
        fill="url(#paint1_linear_27_6)"
      />
    </g>
    <defs>
      <filter
        id="filter0_i_27_6"
        x="0"
        y="0"
        width="58"
        height="37"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="1" />
        <feGaussianBlur stdDeviation="0.5" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0"
        />
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_27_6" />
      </filter>
      <linearGradient
        id="paint0_linear_27_6"
        x1="29"
        y1="0"
        x2="29"
        y2="36"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="white" stop-opacity="0.5" />
        <stop offset="1" stop-color="white" stop-opacity="0" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_27_6"
        x1="29"
        y1="0"
        x2="29"
        y2="36"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="white" stop-opacity="0.5" />
        <stop offset="1" stop-color="white" stop-opacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

export default Donate;
