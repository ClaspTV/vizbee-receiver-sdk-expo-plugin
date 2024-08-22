import { ConfigPlugin, createRunOncePlugin } from "@expo/config-plugins";
import { VizbeePluginOptions } from "./types";

// // Android Plugins

// Common
import withPluginAddMavenUrl from "./plugins/add-maven-url";
import withPluginAddDependency from "./plugins/add-dependency";
import withPluginUpdateManifestMainActivity from "./plugins/update-manifest-main-activity";
import withPluginMakeMainActivityExtendible from "./plugins/make-main-activity-extendible";
import withPluginInitializeVizbee from "./plugins/initialize-vizbee";

// Fire TV specific
import withPluginDefaultCategory from "./plugins/firetv/add-default-category";
import withPluginAddWhisperplayXml from "./plugins/firetv/add-whisperplay-xml";
import withPluginAddClearTextTraffic from "./plugins/firetv/add-clear-text-traffic";
import withPluginAddExtendedMainActivityFTV from "./plugins/firetv/add-extended-main-activity";

// Android TV specific
import withPluginAddIntentFilters from "./plugins/androidtv/add-intent-filters";
import withPluginAddReceiverOptionsProvider from "./plugins/androidtv/add-receiver-options-provider";
import withPluginAddReceiverOptionsToManifest from "./plugins/androidtv/add-receiver-options-to-manifest";
import withPluginAddExtendedMainActivityATV from "./plugins/androidtv/add-extended-main-activity";

/**
 * Apply Android-specific Vizbee plugins
 * @param config - The Expo config
 * @param props - Plugin options
 * @returns Modified config
 */
const withVizbeeAndroidPlugins: ConfigPlugin<VizbeePluginOptions> = (
  config,
  props
) => {
  config = withPluginAddMavenUrl(config);
  config = withPluginAddDependency(config, {
    platform: props.platform,
  });
  config = withPluginUpdateManifestMainActivity(config);
  config = withPluginMakeMainActivityExtendible(config);
  config = withPluginInitializeVizbee(config, {
    language: props.language,
  });

  if (
    props.platform === "fireTV" ||
    props.platform === "both" ||
    !props.platform
  ) {
    config = withPluginDefaultCategory(config);
    config = withPluginAddWhisperplayXml(config, {
      dialId: props.dialId,
    });
    config = withPluginAddClearTextTraffic(config);
    config = withPluginAddExtendedMainActivityFTV(config, {
      platform: props.platform,
      language: props.language,
    });
  }

  if (
    props.platform === "androidTV" ||
    props.platform === "both" ||
    !props.platform
  ) {
    config = withPluginAddIntentFilters(config);
    config = withPluginAddReceiverOptionsProvider(config, {
      language: props.language,
      platform: props.platform,
    });
    config = withPluginAddReceiverOptionsToManifest(config);
    config = withPluginAddExtendedMainActivityATV(config, {
      platform: props.platform,
      language: props.language,
    });
  }

  return config;
};

/**
 * Apply Vizbee plugins to both iOS and Android
 * @param config - The Expo config
 * @param props - Plugin options
 * @returns Modified config
 */
const withVizbee: ConfigPlugin<VizbeePluginOptions> = (config, props) => {
  config = withVizbeeAndroidPlugins(config, props);
  return config;
};

export default createRunOncePlugin(withVizbee, "withVizbee", "1.0.0");
