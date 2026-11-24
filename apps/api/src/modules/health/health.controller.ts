import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';
import { Public } from '../../common/decorators/public.decorator';

@Controller()
export class HealthController {
  constructor(@InjectConnection() private connection: Connection) {}

  /** Liveness: the process is up. Used by the load balancer. */
  @Public()
  @Get('health')
  health() {
    return { status: 'ok' };
  }

  /** Readiness: the database is reachable. */
  @Public()
  @Get('ready')
  ready() {
    const connected = this.connection.readyState === 1;
    return { status: connected ? 'ready' : 'not_ready', database: connected ? 'up' : 'down' };
  }
}
