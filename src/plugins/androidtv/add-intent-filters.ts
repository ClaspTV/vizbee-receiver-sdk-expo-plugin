import {
  withAndroidManifest,
  ConfigPlugin,
  AndroidConfig,
} from "@expo/config-plugins";
import { ManifestIntentFilter } from "@expo/config-plugins/build/android/Manifest";

const withIntentFilters: ConfigPlugin = (config) => {
  return withAndroidManifest(config, async (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults
    );
    if (!mainApplication["activity"]) {
      throw new Error("MainApplication has no activity");
    }

    const mainActivity = mainApplication["activity"].find(
      (activity: any) => activity["$"]["android:name"] === ".MainActivity"
    );

    if (!mainActivity) {
      throw new Error("MainActivity not found in AndroidManifest.xml");
    }

    // Create the new intent filters
    // Create the new intent filters
    const intentFilters: ManifestIntentFilter[] = [
      {
        action: [
          {
            $: {
              "android:name": "com.google.android.gms.cast.tv.action.LAUNCH",
            },
          },
        ],
        category: [
          { $: { "android:name": "android.intent.category.DEFAULT" } },
        ],
      },
      {
        action: [
          {
            $: { "android:name": "com.google.android.gms.cast.tv.action.LOAD" },
          },
        ],
        category: [
          { $: { "android:name": "android.intent.category.DEFAULT" } },
        ],
      },
    ];

    // Add the new intent filters to the MainActivity
    mainActivity["intent-filter"] = [
      ...(mainActivity["intent-filter"] || []),
      ...intentFilters,
    ];

    return config;
  });
};

export default withIntentFilters;
