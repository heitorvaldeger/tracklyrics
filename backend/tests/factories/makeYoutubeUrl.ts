export const makeYoutubeUrl = () => {
  const baseURL = 'https://www.youtube.com/watch?v='
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let videoID = ''

  for (let i = 0; i < 11; i++) {
    videoID += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return baseURL + videoID
}
