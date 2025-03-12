export const ENDPOINTS = {
  LOGIN: "login",
  REGISTER: "register",
  GENRES: "genres",
  LANGUAGES: "languages",
  USER: "user",
  FAVORITES: "favorites",
  VIDEOS: "videos",
  USER_LYRICS: "user/my-lyrics",
  VIDEOS_WITH_UUID: (videoUuid: string) => `videos/${videoUuid}`,
  GAME_MODES_WITH_UUID: (videoUuid: string) => `game/${videoUuid}/modes`,
  FAVORITES_WITH_UUID: (videoUuid: string) => `favorites/${videoUuid}`,
} as const