declare module 'use-image' {
  function useImage(url: string): [HTMLImageElement | undefined, string];
  export default useImage;
}