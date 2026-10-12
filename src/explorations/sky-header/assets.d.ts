// Vite turns image imports into file URLs.
declare module '*.png' {
  const src: string;
  export default src;
}
