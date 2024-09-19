import { stateManager } from '@/core/stateManager';
import { Logger } from '@/core/logger';

export class ShapePlugin {
  private shapes: any[] = [];

  init() {
    Logger.log('Shape Plugin initialized', 'info');
    this.shapes = stateManager.getState('shapes') || [];
  }

  enable() {
    Logger.log('Shape Plugin enabled', 'info');
    // Ativar funcionalidade de forma
  }

  disable() {
    Logger.log('Shape Plugin disabled', 'info');
  }

  addShape(shape: any) {
    this.shapes.push(shape);
    stateManager.setState('shapes', this.shapes);
  }

  removeShape(id: string) {
    this.shapes = this.shapes.filter(shape => shape.id !== id);
    stateManager.setState('shapes', this.shapes);
  }
}


export default ShapePlugin;