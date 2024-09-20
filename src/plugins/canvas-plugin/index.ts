// plugins/canvas/index.ts
import { Plugin } from "@/core/plugin-interface";
import Canvas from "./canvas";

export const canvasPlugin: Plugin = {
  name: "default-canvas",
  type: "canvas",
  activate() {
    console.log("Canvas plugin activated");
    // Aqui você pode adicionar lógica de inicialização específica para o canvas
  },
  deactivate() {
    console.log("Canvas plugin deactivated");
    // Aqui você pode adicionar lógica de limpeza ou desmontagem para o canvas
  },
  // Podemos adicionar mais métodos ou funcionalidades aqui, se necessário
};
