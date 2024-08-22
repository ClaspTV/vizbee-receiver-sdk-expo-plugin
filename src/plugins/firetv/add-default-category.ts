import { ConfigPlugin, withAndroidManifest } from "@expo/config-plugins";

const withDefaultCategory: ConfigPlugin = (config) => {
  return withAndroidManifest(config, async (config) => {
    const manifest = config.modResults;

    // Helper function to find the main activity
    const findMainActivity = (manifest: any) => {
      if (!Array.isArray(manifest.manifest.application)) {
        throw new Error(
          "configureAndroidManifest: No application array in manifest?"
        );
      }

      const application = manifest.manifest.application.find(
        (item: any) => item.$ && item.$["android:name"]
      );
      if (!application) {
        throw new Error("configureAndroidManifest: No application element?");
      }

      for (const activity of application.activity) {
        if (activity["intent-filter"]) {
          for (const intentFilter of activity["intent-filter"]) {
            if (
              intentFilter.action &&
              intentFilter.action.some(
                (action: any) =>
                  action.$["android:name"] === "android.intent.action.MAIN"
              )
            ) {
              return activity;
            }
          }
        }
      }
      return null;
    };

    // Find the main activity
    const mainActivity = findMainActivity(manifest);

    if (mainActivity) {
      const intentFilters = mainActivity["intent-filter"];
      intentFilters.forEach((intentFilter: any) => {
        const categories = intentFilter.category || [];
        const hasDefaultCategory = categories.some(
          (category: any) =>
            category["$"]["android:name"] === "android.intent.category.DEFAULT"
        );

        if (!hasDefaultCategory) {
          // Add DEFAULT category if not already present
          categories.push({
            $: { "android:name": "android.intent.category.DEFAULT" },
          });
        }

        intentFilter.category = categories;
      });

      mainActivity["intent-filter"] = intentFilters;
    }

    config.modResults = manifest;
    return config;
  });
};

export default withDefaultCategory;
