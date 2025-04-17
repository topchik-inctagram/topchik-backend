import { ApiProperty } from '@nestjs/swagger';
import { DeviceType } from '../../features/users/devices/repos/device.repo';
import { UserAgentAdapter } from '../adapters/agent/agent.adapter';

export class DeviceViewModel {
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

  constructor({ title, iat, ip, id }: DeviceType, current: boolean) {
    const {
      browserName,
      browserVersion,
      osName,
      osVersion,
      deviceName,
      deviceType,
    } = UserAgentAdapter.parseUserAgent(title);

    this.id = id;
    this.browserName = browserName;
    this.browserVersion = browserVersion;
    this.osName = osName;
    this.osVersion = osVersion;
    this.deviceName = deviceName;
    this.deviceType = deviceType;
    this.lastActiveDate = new Date(iat * 1000).toISOString();
    this.current = current;
    this.ip = ip;
  }
}
