import UAParser from 'ua-parser-js';

export abstract class UserAgentAdapter {
  static parseUserAgent(userAgent: string) {
    const parser = new UAParser();
    parser.setUA(userAgent);
    const result = parser.getResult();

    return {
      browserName: result.browser.name,
      browserVersion: result.browser.version,
      deviceType: result.device.type || 'Desktop',
      osName: result.os.name,
      osVersion: result.os.version,
      deviceName: result.device.vendor
        ? `${result.device.vendor} ${result.device.model}`
        : 'Unknown Device',
    };
  }
}
