// plugins/rectangle-plugin.ts
import { Plugin } from "@/plugins/plugin-interface";

export const rectanglePlugin: Plugin = {
  name: "rectangle",
  activate() {
    console.log("Rectangle tool activated");
  },
  deactivate() {
    console.log("Rectangle tool deactivated");
  },
  execute(x: number, y: number, width: number, height: number) {
    console.log(`Drawing rectangle at (${x}, ${y}) with width ${width} and height ${height}`);
    // Aqui vai a lógica para desenhar um retângulo no canvas
  },
};
