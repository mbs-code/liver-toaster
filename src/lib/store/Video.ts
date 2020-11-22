import { get } from "dot-prop";
import VideoInterface from "../interface/database/VideoInterface";
import YoutubeVideoInterface from "../interface/youtube/VideoInterface";
import BaseStore from "./BaseStore";

export default class Video extends BaseStore<VideoInterface> {
  constructor() {
    super('./storage/database/videos.db')
  }

  public attachAPIValue(db?: VideoInterface, api?: YoutubeVideoInterface): VideoInterface {
    const base: VideoInterface = {
      videoId: get(api, 'id'),
      title: get(api, 'snippet.title'),
      channelId: get(api, 'snippet.channelId'),
      channelTitle: get(api, 'snippet.channelTitle'),
      scheduledStartTime: get(api, 'liveStreamingDetails.scheduledStartTime'),
      actualStartTime: get(api, 'liveStreamingDetails.actualStartTime'),
      actualEndTime: get(api, 'liveStreamingDetails.actualEndTime'),

      notifyStart: get(db, 'notifyStart') || false,
      notifySchedule: get(db, 'notifySchedule') || false,
      notifyEnd: get(db, 'notifyEnd') || false,
    }
    return base
  }
}
