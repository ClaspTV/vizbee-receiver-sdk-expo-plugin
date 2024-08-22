import {
  ConfigPlugin,
  withAndroidManifest,
  AndroidConfig,
} from "@expo/config-plugins";

const withAddReceiverOptionsToManifest: ConfigPlugin = (config) => {
  const packageName = AndroidConfig.Package.getPackage(config);

  if (!packageName) {
    throw new Error("Unable to find package name");
  }
  config = withAndroidManifest(config, async (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults
    );

    mainApplication["meta-data"] = mainApplication["meta-data"] || [];
    mainApplication["meta-data"].push({
      $: {
        "android:name":
          "com.google.android.gms.cast.tv.RECEIVER_OPTIONS_PROVIDER_CLASS_NAME",
        "android:value": `${packageName}.AppReceiverOptionsProvider`,
      },
    });

    return config;
  });

  return config;
};

export default withAddReceiverOptionsToManifest;
