
export const OAuthIcons = ({ provider }: { provider: string; }) => {
  if (provider === 'apple') return (
    <svg xmlns="http://www.w3.org/2000/svg" className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-havevq-MuiSvgIcon-root" viewBox="0 0 24 24" fill="black" width="24" height="24">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  )

  if (provider == 'google') return (
    <svg xmlns="http://www.w3.org/2000/svg" className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-havevq-MuiSvgIcon-root" viewBox="0 0 24 24" fill="black" width="24" height="24">
      <path d="M21.35 11.1H12v2.94h5.42c-.24 1.25-.94 2.31-2 3.03v2.5h3.23c1.89-1.74 2.98-4.3 2.98-7.31 0-.67-.07-1.32-.2-1.94z"/>
      <path d="M12 22c2.7 0 4.96-.9 6.6-2.42l-3.23-2.5c-.9.6-2.06.96-3.37.96-2.59 0-4.78-1.75-5.56-4.1H3.1v2.57C4.72 19.98 8.09 22 12 22z"/>
      <path d="M6.44 13.94A5.99 5.99 0 0 1 6 12c0-.67.11-1.31.3-1.94V7.49H3.1A9.97 9.97 0 0 0 2 12c0 1.56.36 3.04 1.1 4.51l3.34-2.57z"/>
      <path d="M12 6.04c1.47 0 2.8.51 3.84 1.5l2.88-2.88C17.93 2.84 15.67 2 12 2 8.09 2 4.72 4.02 3.1 7.49l3.34 2.57C7.22 7.79 9.41 6.04 12 6.04z"/>
    </svg>
  )

  if (provider === 'facebook') return (
    <svg xmlns="http://www.w3.org/2000/svg" className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-havevq-MuiSvgIcon-root" viewBox="0 0 24 24" fill="black" width="24" height="24">
      <path d="M22 12.07C22 6.52 17.52 2 12 2S2 6.52 2 12.07c0 5.03 3.66 9.2 8.44 9.93v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.77l-.44 2.9h-2.33v7.03C18.34 21.27 22 17.1 22 12.07z"/>
    </svg>
  )
  
  return null;
};
