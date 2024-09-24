// /events/canvas/CanvasEvents.ts
import { eventBus } from '../EventBus';
import { Event } from '../EventTypes';

// Definir eventos de canvas
const CanvasEvents = {
  CANVAS_CREATED: 'canvas:canvasCreated',
  CANVAS_UPDATED: 'canvas:canvasUpdated',
  CANVAS_DELETED: 'canvas:canvasDeleted'
} as const;

// Ouvinte de evento de criação de canvas
eventBus.on(CanvasEvents.CANVAS_CREATED, (payload) => {
  console.log('Canvas created:', payload);
});

// Emissor de evento de criação de canvas
export const emitCanvasCreated = (canvasId: string) => {
  const event: Event = { type: CanvasEvents.CANVAS_CREATED, payload: { canvasId } };
  eventBus.emit(event.type, event.payload);
};

export default CanvasEvents;
