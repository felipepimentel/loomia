// plugins/circle-plugin.ts
import { Plugin } from "@/plugins/plugin-interface"; // Verifique se o caminho está correto

export const circlePlugin: Plugin = {
  name: "circle",
  activate() {
    console.log("Circle tool activated");
  },
  deactivate() {
    console.log("Circle tool deactivated");
  },
  execute(x: number, y: number, radius: number) {
    console.log(`Drawing circle at (${x}, ${y}) with radius ${radius}`);
    // Aqui vai a lógica para desenhar um círculo no canvas
  },
};
