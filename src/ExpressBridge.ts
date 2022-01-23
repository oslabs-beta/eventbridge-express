import { v4 } from 'uuid';
import type { handlerType, errorHandlerType } from './EventPattern';
import type { TelemetryConfig } from './Telemetry';
import { EventPattern } from './EventPattern';
import { Telemetry } from './Telemetry';

type EventType = Record<string, any>;

interface ExpressBridgeOptions {
  alwaysRunHooks?: boolean;
  telemetry?: TelemetryConfig;
}
export class ExpressBridge {
  private comparableCollection: EventPattern<unknown>[] = [];

  private preHandlers: handlerType[] = [];

  private postHandlers: handlerType[] = [];

  private telemetry: Telemetry;

  public constructor(public options: ExpressBridgeOptions) {}

  public use(
    pattern: Record<string, unknown>,
    handlers: handlerType[],
    errorHandler: errorHandlerType
  ): void {
    const patternInstance = new EventPattern<typeof pattern>(
      pattern,
      handlers,
      errorHandler
    );
    this.comparableCollection.push(patternInstance);
  }

  public async process(incomingEvent: EventType): Promise<void> {
    try {
      // if telemetry is defined, set uuid and call beacon
      if (process.env.EB_TELEMETRY && this.options.telemetry) {
        incomingEvent.data.eventId = incomingEvent.data?.eventId || v4();
        this.telemetry = new Telemetry(
          incomingEvent.data.eventId,
          this.options.telemetry
        );
      }
      await this.telemetry?.beacon('EB-PROCESS', {
        sourceEventId: incomingEvent.data?.uuid,
        description: 'Process function called. Generating process ID.',
        data: {
          event: incomingEvent,
        },
      });

      const matchedPatterns = this.comparableCollection.filter(
        (eventPattern: EventPattern<Partial<typeof incomingEvent>>) => {
          return eventPattern.test(incomingEvent);
        }
      );

      if (matchedPatterns.length > 0) {
        await this.telemetry?.beacon('EB-MATCH', {
          sourceEventId: incomingEvent.data?.uuid,
          description: 'Patterns matched for event. Calling assigned handlers.',
          data: {
            matchedPatterns,
          },
        });

        // run pre hook
        const output = await pipeline(incomingEvent, ...this.preHandlers);

        await this.telemetry?.beacon('EB-PRE', {
          sourceEventId: incomingEvent.data?.uuid,
          data: output,
        });

        // run pattern handlers
        for (const pattern of matchedPatterns) {
          try {
            await pipeline(output, ...pattern.getHandlers());
          } catch (err) {
            pattern.getErrorHandler()(err);
          }
        }

        await this.telemetry?.beacon('EB-HANDLERS', {
          sourceEventId: incomingEvent.data?.uuid,
          data: output,
        });

        // run post handlers
        if (this.postHandlers) pipeline(output, ...this.postHandlers);

        await this.telemetry?.beacon('EB-POST', {
          sourceEventId: incomingEvent.data?.uuid,
          data: incomingEvent,
        });
      } else if (
        this.options.alwaysRunHooks &&
        (this.preHandlers || this.postHandlers)
      ) {
        await pipeline(
          incomingEvent,
          ...this.preHandlers,
          ...this.postHandlers
        );
      }
    } catch (err: unknown) {
      console.log('Error occurred processing event: ', err);
      await this.telemetry?.beacon('EB-ERROR', {
        sourceEventId: incomingEvent.data?.uuid,
        data: err,
      });
    }
  }

  public pre(...handlers: handlerType[]): void {
    this.preHandlers.push(...handlers);
  }

  public post(...handlers: handlerType[]): void {
    this.postHandlers.push(...handlers);
  }

  public getTelemetryId() {
    return this.telemetry.eventId;
  }
}

function pipeline(message: EventType, ...functions: handlerType[]): EventType {
  const reduced = functions.reduce(async (acc, func) => {
    return func(await acc);
  }, message);

  return reduced;
}
