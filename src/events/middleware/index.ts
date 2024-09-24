// /events/middleware/index.ts
import { eventBus } from '../EventBus';
import { loggingMiddleware } from './loggingMiddleware';
import { validationMiddleware } from './validationMiddleware';

eventBus.use(loggingMiddleware);
eventBus.use(validationMiddleware);
