// header-plugin/types.ts

export interface HeaderPluginSettings {
  title: string;
  logo: string;
  components: Array<{
    name: string;
    position: 'left' | 'right';
  }>;
}
