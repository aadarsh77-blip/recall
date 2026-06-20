export interface RecallPlugin {
  name: string;
  onNoteCreate?: (note: any) => Promise<void> | void;
  onAppStart?: () => Promise<void> | void;
}

const plugins: RecallPlugin[] = [];

export function registerPlugin(plugin: RecallPlugin) {
  plugins.push(plugin);
  console.log(`[Plugins] Registered: ${plugin.name}`);
}

export async function runHook(hookName: keyof RecallPlugin, ...args: any[]) {
  for (const plugin of plugins) {
    if (typeof plugin[hookName] === 'function') {
      try {
        await (plugin[hookName] as any)(...args);
      } catch (e) {
        console.error(`[Plugins] Plugin ${plugin.name} failed hook ${hookName}:`, e);
      }
    }
  }
}

// ─── Dummy Plugin Example ──────────────────────────────────────────────
registerPlugin({
  name: 'LogNoteCreation',
  onNoteCreate: (note) => {
    console.log(`[Plugin: LogNoteCreation] A new note was created: "${note.title}"`);
  }
});
