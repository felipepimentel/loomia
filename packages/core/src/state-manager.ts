class StateManager {
    private state: any = {};
  
    constructor() {
      const savedState = localStorage.getItem('appState');
      if (savedState) {
        this.state = JSON.parse(savedState);
      }
    }
  
    setState(key: string, value: any) {
      this.state[key] = value;
      localStorage.setItem('appState', JSON.stringify(this.state));
    }
  
    getState(key: string) {
      return this.state[key];
    }
  }
  
  export const stateManager = new StateManager();
  