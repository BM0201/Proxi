# @proxi/logger

Logger compartido basado en [Pino](https://getpino.io). Logs estructurados en
producción y legibles (pino-pretty) en desarrollo.

```ts
import { createLogger } from '@proxi/logger';
const log = createLogger('booking');
log.info('Reserva creada');
```
