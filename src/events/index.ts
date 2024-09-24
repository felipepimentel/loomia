// /events/index.ts
import { eventBus } from './EventBus';
import './middleware';
import './global';
import './plugins';
import './canvas';

// Inicialização de todos os middlewares e eventos
export default eventBus;
