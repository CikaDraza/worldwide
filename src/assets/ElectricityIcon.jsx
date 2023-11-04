import React from 'react'

export default function ElectricityIcon({ theme }) {
  
  return (
    <svg width="35" height="35" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_578_326)">
      <circle cx="2" cy="2" r="1.875" stroke={theme === 'dark' ? "white" : "black"} strokeWidth="0.25"/>
      <circle cx="2" cy="2" r="1.875" stroke={theme === 'dark' ? "white" : "black"} strokeWidth="0.25"/>
      <circle cx="2" cy="2" r="1.875" stroke={theme === 'dark' ? "white" : "black"} strokeWidth="0.25"/>
      <path d="M1.91645 2.29999H1.6881C1.45335 2.29999 1.33598 2.29999 1.28683 2.22307C1.23767 2.14614 1.28698 2.03964 1.3856 1.8266L1.84083 0.84333C1.9032 0.708623 1.93437 0.64127 1.96708 0.648472C1.99978 0.655675 1.99978 0.729897 1.99978 0.878342V1.61665C1.99978 1.65594 1.99978 1.67559 2.01198 1.68779C2.02418 1.69999 2.04383 1.69999 2.08312 1.69999H2.31147C2.54622 1.69999 2.66358 1.69999 2.71273 1.7769C2.76188 1.85384 2.71258 1.96034 2.61397 2.17335L2.15873 3.15664C2.09637 3.29135 2.0652 3.3587 2.03248 3.3515C1.99978 3.3443 1.99978 3.27007 1.99978 3.12164V2.38332C1.99978 2.34404 1.99978 2.32439 1.98758 2.31219C1.97538 2.29999 1.95573 2.29999 1.91645 2.29999Z" fill={theme === 'dark' ? "white" : "black"}/>
      </g>
      <defs>
      <clipPath id="clip0_578_326">
      <rect width="4" height="4" fill={theme === 'dark' ? "white" : "black"}/>
      </clipPath>
      </defs>
    </svg>
  )
}
