import type { PluginManifest, LocalPluginManifest, AnyPluginManifest } from '../types/plugin';

export const isLocalPluginManifest = (
  manifest: AnyPluginManifest,
): manifest is LocalPluginManifest => (manifest as LocalPluginManifest).$local === true;

export const isStandardPluginManifest = (manifest: AnyPluginManifest): manifest is PluginManifest =>
  !isLocalPluginManifest(manifest);
