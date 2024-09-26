// header-plugin/index.ts
import React from 'react';

// Tipos importados de um módulo central para facilitar o desenvolvimento
import { PluginProps, PluginType } from '@/core/types';

// Define o componente principal do plugin
const HeaderPlugin: React.FC<PluginProps> = ({ settings }) => {
  // Obtém as configurações do plugin a partir dos props
  const { title, logo, components } = settings;

  // Renderiza o cabeçalho com os componentes definidos na configuração
  return (
    <header className="header-plugin flex items-center justify-between p-2 border-b bg-white">
      <div className="flex items-center space-x-2">
        {logo && (
          <img src={logo} alt="Logo" className="h-8 w-8 rounded-full" />
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <div className="flex items-center space-x-2">
        {/* Renderiza os componentes adicionais conforme definido na configuração */}
        {components && components.map((component: any, index: number) => {
          // Cada componente será uma função que renderiza um botão ou outra funcionalidade
          const Component = componentRegistry[component.name];
          return Component ? <Component key={index} /> : null;
        })}
      </div>
    </header>
  );
};

// Exporta o componente como default para ser usado pelo plugin-manager
export default HeaderPlugin;
