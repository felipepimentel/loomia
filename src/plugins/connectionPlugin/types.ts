// plugins/connectionPlugin/types.ts
export interface Connection {
    id: string;
    source: string;
    target: string;
  }
  
  export interface Plugin {
    name: string;
    initialize: () => void;
    activate: () => void;
    deactivate: () => void;
  }
  