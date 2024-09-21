type HookFunction = (...args: any[]) => Promise<any> | any;

export class PluginHooks {
  private hooks: Map<string, HookFunction[]> = new Map();

  register(hookName: string, fn: HookFunction) {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, []);
    }
    this.hooks.get(hookName)!.push(fn);
  }

  async execute(hookName: string, ...args: any[]): Promise<any[]> {
    const hookFns = this.hooks.get(hookName) || [];
    return Promise.all(hookFns.map(fn => fn(...args)));
  }
}

export const globalHooks = new PluginHooks();