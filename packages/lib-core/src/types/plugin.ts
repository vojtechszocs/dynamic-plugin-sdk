import type { AnyObject } from '@monorepo/common';
import type { Extension, LoadedExtension } from './extension';
import type { PluginEntryModule } from './runtime';

/**
 * Registration method used to finalize the plugin's load process.
 *
 * In order to load plugins using the `callback` registration method, the host application
 * must register a global entry callback function to be called by the plugin's entry script.
 *
 * In order to load plugins using the `custom` registration method, the host application must
 * provide a way to retrieve the entry module that was loaded by the plugin's entry script.
 *
 * @see {@link PluginEntryModule}
 */
export type PluginRegistrationMethod = 'callback' | 'custom';

/**
 * Runtime plugin metadata.
 *
 * There can be only one plugin with the given `name` loaded at any time.
 *
 * Any dependencies on other plugins will be resolved as part of the plugin's load process.
 *
 * The `customProperties` object may contain additional information for the host application.
 */
export type PluginRuntimeMetadata = {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  customProperties?: AnyObject;
};

/**
 * Plugin manifest object, generated during the webpack build of the plugin.
 *
 * The `extensions` list contains all extensions contributed by the plugin. Code references
 * within each extension's properties are serialized as JSON objects `{ $codeRef: string }`.
 *
 * The `baseURL` should be used when loading all plugin assets, including the ones listed in
 * `loadScripts`.
 *
 * This is the standard (webpack) representation of a plugin manifest, where we need to load
 * the specified scripts in order to initialize the plugin and access its exposed modules via
 * the plugin's entry module.
 */
export type PluginManifest = PluginRuntimeMetadata & {
  baseURL: string;
  extensions: Extension[];
  loadScripts: string[];
  registrationMethod: PluginRegistrationMethod;
  buildHash?: string;
};

/**
 * Plugin manifest object, created directly in your application.
 *
 * This is the local (manual) representation of a plugin manifest; any code references in
 * the `extensions` list should be represented as `CodeRef` functions. Plugins defined this
 * way will have no entry module.
 */
export type LocalPluginManifest = PluginRuntimeMetadata & {
  extensions: Extension[];
  $local: true;
};

export type AnyPluginManifest = PluginManifest | LocalPluginManifest;

/**
 * Internal entry on a plugin in `pending` state.
 */
export type PendingPlugin = {
  manifest: Readonly<AnyPluginManifest>;
};

/**
 * Internal entry on a plugin in `loaded` state.
 */
export type LoadedPlugin = {
  manifest: Readonly<AnyPluginManifest>;
  loadedExtensions: Readonly<LoadedExtension[]>;
  entryModule?: PluginEntryModule;
  enabled: boolean;
  disableReason?: string;
};

/**
 * Internal entry on a plugin in `failed` state.
 */
export type FailedPlugin = {
  manifest: Readonly<AnyPluginManifest>;
  errorMessage: string;
  errorCause?: unknown;
};
