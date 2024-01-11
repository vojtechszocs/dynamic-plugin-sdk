import type { PluginManifest } from './plugin';
import type { PluginEntryModule } from './runtime';

export type PluginLoadResult =
  | {
      success: true;
      entryModule: PluginEntryModule;
    }
  | {
      success: false;
      errorMessage: string;
      errorCause?: unknown;
    };

export type PluginLoaderInterface = {
  /**
   * Load plugin manifest from the given URL.
   *
   * This should include validating the manifest object as necessary.
   */
  loadPluginManifest: (manifestURL: string) => Promise<PluginManifest>;

  /**
   * Transform the plugin manifest before loading the associated plugin.
   */
  transformPluginManifest: (manifest: PluginManifest) => PluginManifest;

  /**
   * Load plugin from the given manifest.
   *
   * The resulting Promise never rejects; any plugin load error(s) will be contained
   * within the {@link PluginLoadResult} object.
   */
  loadPlugin: (manifest: PluginManifest) => Promise<PluginLoadResult>;
};
