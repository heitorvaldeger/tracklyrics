import { inject } from '@adonisjs/core'

import { dispatch } from '#helpers/dispatch'
import { VideoUserLoggedProtocolService } from '#services/_protocols/video/video-user-logged-protocol-service'

@inject()
export default class VideoUserLoggedController {
  constructor(private videoUserLogged: VideoUserLoggedProtocolService) {}

  async getVideosByUserLogged() {
    try {
      const response = await this.videoUserLogged.getVideosByUserLogged()

      return dispatch(response)
    } catch (error) {
      return dispatch({
        isSuccess: false,
        error,
      })
    }
  }
}
