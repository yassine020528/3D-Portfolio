export default function SpeakerIcon({ enabled }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="white" />
      {enabled ? (
        <path d="M15.54 8.46L16.95 7.05C18.07 8.17 18.79 9.71 18.79 11.42C18.79 13.13 18.07 14.67 16.95 15.79L15.54 14.38C16.32 13.6 16.79 12.56 16.79 11.42C16.79 10.28 16.32 9.24 15.54 8.46Z" fill="white" />
      ) : (
        <path d="M21.59 7.59L19 10.17L16.41 7.59L15 9L17.59 11.58L15 14.17L16.41 15.59L19 13L21.59 15.59L23 14.17L20.41 11.58L23 9L21.59 7.59Z" fill="white" />
      )}
    </svg>
  );
}
