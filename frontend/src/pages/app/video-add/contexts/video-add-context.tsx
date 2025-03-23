import { createContext, PropsWithChildren, useContext, useState } from "react";

interface VideoAddContextValues {
  youtubeURL: string;
  updateYoutubeURL: (url: string) => void;
}

export const VideoAddContext = createContext({} as VideoAddContextValues);

export const VideoAddProvider = ({ children }: PropsWithChildren) => {
  const [youtubeURL, setYoutubeURL] = useState("");

  const updateYoutubeURL = (url: string) => {
    setYoutubeURL(url);
  };

  return (
    <VideoAddContext.Provider
      value={{
        youtubeURL,
        updateYoutubeURL,
      }}
    >
      {children}
    </VideoAddContext.Provider>
  );
};

export const useVideoAdd = () => {
  const context = useContext(VideoAddContext);
  if (!context) {
    throw new Error("VideoAddContext must have in a provider");
  }

  return context;
};
