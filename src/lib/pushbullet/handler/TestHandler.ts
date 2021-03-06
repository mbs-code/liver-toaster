import config from '../../../config/config'
import PushInterface from '../../../interface/pushbullet/PushInterface'
import Tweeter from '../../util/Tweeter'
import BaseHandler from './BaseHandler'

export default class TestHandler extends BaseHandler {
  public readonly PUSHBULLET_PACKAGE_NAME = 'com.pushbullet.android'
  public readonly NOTIFY_TITLE = '通知のテスト'

  public async isValid(push: PushInterface): Promise<boolean> {
    if (push.package_name === this.PUSHBULLET_PACKAGE_NAME) {
      // config でテスト通知が off なら対象外
      if (!config.mode.testNotify)  return false

      // タイトルが一致したら対象
      if (push.title === this.NOTIFY_TITLE) {
        return true
      }
    }

    return false
  }

  public async handle(push: PushInterface): Promise<void> {
    this.logger.debug('> test notify')
    await Tweeter.builder().testNotify()
  }
}
