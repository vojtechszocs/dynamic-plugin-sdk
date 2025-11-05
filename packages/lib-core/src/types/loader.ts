import type { LoadedExtension } from './extension';
import type { PluginManifest, AnyPluginManifest } from './plugin';
import type { PluginEntryModule } from './runtime';

export type PluginLoadResult =
  | {
      success: true;
      loadedExtensions: LoadedExtension[];
      entryModule?: PluginEntryModule;
    }
  | {
      success: false;
      errorMessage: string;
      errorCause?: unknown;
    };

/**
 * Common interface implemented by the `PluginLoader`.
 */
export type PluginLoaderInterface = {
  /**
   * Load a standard plugin manifest from the given URL.
   *
   * The implementation should validate the manifest object as necessary.
   */
  loadPluginManifest: (manifestURL: string) => Promise<PluginManifest>;

  /**
   * Transform the plugin manifest before loading the associated plugin.
   */
  transformPluginManifest: <T extends AnyPluginManifest>(manifest: T) => T;

  /**
   * Load a plugin from the given manifest.
   *
   * The implementation is responsible for decoding any code references in extensions
   * listed in the plugin manifest (except when loading from a local plugin manifest).
   *
   * The resulting Promise never rejects; any plugin load error(s) will be contained
   * within the {@link PluginLoadResult} object.
   */
  loadPlugin: (manifest: AnyPluginManifest) => Promise<PluginLoadResult>;
};
