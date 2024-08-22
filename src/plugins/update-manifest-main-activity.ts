import { withAndroidManifest, ConfigPlugin } from "@expo/config-plugins";

const modifyMainActivity: ConfigPlugin = (config) => {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;

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

    // Find the main activity entry
    const mainActivity = application.activity?.find(
      (activity: any) => activity["$"]["android:name"] === ".MainActivity"
    );

    if (mainActivity) {
      // Replace MainActivity with ExtendedMainActivity
      mainActivity["$"]["android:name"] = ".ExtendedMainActivity";
    }

    return config;
  });
};

export default modifyMainActivity;
