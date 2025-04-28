import { ApiProperty } from '@nestjs/swagger';
import { UserAgentAdapter } from '../adapters/agent/agent.adapter';
import { Device } from '../../modules/users/domain/device.entity';

export class DeviceView {
  @ApiProperty()
  id: string;

  @ApiProperty()
  browserName: string;

  @ApiProperty()
  browserVersion: string;

  @ApiProperty()
  deviceType: string;

  @ApiProperty()
  osName: string;

  @ApiProperty()
  osVersion: string;

  @ApiProperty()
  deviceName: string;

  @ApiProperty({ type: Date })
  lastActiveDate: string;

  @ApiProperty()
  current: boolean;

  @ApiProperty()
  ip: string;

  static builder({
    title,
    iat,
    ip,
    id,
    current,
  }: Device & { current: boolean }): DeviceView {
    const {
      browserName,
      browserVersion,
      osName,
      osVersion,
      deviceName,
      deviceType,
    } = UserAgentAdapter.parseUserAgent(title);

    const instance = new this();
    instance.id = id;
    instance.browserName = browserName;
    instance.browserVersion = browserVersion;
    instance.osName = osName;
    instance.osVersion = osVersion;
    instance.deviceName = deviceName;
    instance.deviceType = deviceType;
    instance.lastActiveDate = new Date(iat * 1000).toISOString();
    instance.current = current;
    instance.ip = ip;

    return instance;
  }
}
