import { inject } from '@adonisjs/core'

import { IVideoUserLoggedService } from '#services/interfaces/video-user-logged-service'

@inject()
export default class VideoUserLoggedController {
  constructor(private videoUserLogged: IVideoUserLoggedService) {}

  async getVideosByUserLogged() {
    return await this.videoUserLogged.getVideosByUserLogged()
  }
}
