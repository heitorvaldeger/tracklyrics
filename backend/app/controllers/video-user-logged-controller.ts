import { inject } from '@adonisjs/core'

import { VideoUserLoggedProtocolService } from '#services/_protocols/video/video-user-logged-protocol-service'

@inject()
export default class VideoUserLoggedController {
  constructor(private videoUserLogged: VideoUserLoggedProtocolService) {}

  async getVideosByUserLogged() {
    return await this.videoUserLogged.getVideosByUserLogged()
  }
}
