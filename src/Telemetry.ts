import axios from 'axios';
import { AxiosRequestConfig } from 'axios';

export type TelemetryConfig = Partial<AxiosRequestConfig> & {
  serviceName: string;
};

export class Telemetry {
  constructor(
    public eb_event_id: string,
    private requestConfig: TelemetryConfig
  ) {}

  public async beacon(
    tag: string,
    message: Record<string, any>
  ): Promise<void> {
    try {
      const { serviceName, ...requestConfig } = this.requestConfig;
      await axios({
        ...requestConfig,
        data: {
          tag,
          eb_event_id: this.eb_event_id,
          serviceName,
          message,
        },
      });
    } catch (err) {
      console.log('Error calling telemetry beacon', err);
    }
  }
}
