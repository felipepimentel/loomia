// core/plugin-interface.ts
export interface Plugin {
  name: string;
  type: 'canvas' | 'tool' | 'utility'; // Define o tipo de plugin (canvas, ferramentas de desenho, etc.)
  activate: () => void;
  deactivate: () => void;
  execute?: (...args: any[]) => void; // Opcional para plugins que têm uma ação principal
}
