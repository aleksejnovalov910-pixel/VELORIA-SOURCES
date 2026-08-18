import React from "react";

const Flag = ({ country }: { country: string }) => {
  switch (country) {
    case "de":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="9"
          viewBox="0 0 13 9"
          fill="none"
        >
          <path
            d="M0 1C0 0.447715 0.447715 0 1 0H12C12.5523 0 13 0.447715 13 1V3H0V1Z"
            fill="#262626"
          />
          <rect y="3" width="13" height="3" fill="#FF5656" />
          <path
            d="M0 6H13V8C13 8.55228 12.5523 9 12 9H1C0.447715 9 0 8.55228 0 8V6Z"
            fill="#FFE86F"
          />
        </svg>
      );
    case "krx":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="9"
          viewBox="0 0 13 9"
          fill="none"
        >
          <rect width="13" height="9" fill="white" />
          <circle cx="6.5" cy="4.5" r="2.25" fill="#0033A0" />
          <circle cx="6.5" cy="4.5" r="1.125" fill="#C60C30" />
        </svg>
      );
    case "pl":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="9"
          viewBox="0 0 13 9"
          fill="none"
        >
          <rect width="13" height="4.5" fill="white" />
          <rect y="4.5" width="13" height="4.5" fill="#D22630" />
        </svg>
      );
    case "es":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="9"
          viewBox="0 0 13 9"
          fill="none"
        >
          <rect width="13" height="9" fill="#C60B1E" />
          <rect y="2" width="13" height="5" fill="#FFC400" />
        </svg>
      );
    case "en":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="9"
          viewBox="0 0 13 9"
          fill="none"
        >
          <rect width="13" height="9" fill="white" />
          <rect x="5" width="3" height="9" fill="#C60C30" />
          <rect y="3" width="13" height="3" fill="#C60C30" />
        </svg>
      );
    default:
      return null;
  }
};

export default Flag;
