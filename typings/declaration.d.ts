declare module '*.module.css';
declare module '*.svg';
declare module '*.webp';

declare module '*.mp3' {
  const src: string;
  export default src;
}
