// import type { HttpContext } from '@adonisjs/core/http'

import Video from '#models/video'
import { ok } from '../helpers/http.js'

export default class VideoController {
  async findAll() {
    const videos = await Video.all()

    return ok(videos.map((video) => video.serialize()))
  }
}
