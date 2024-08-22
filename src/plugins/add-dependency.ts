import { ConfigPlugin, withAppBuildGradle } from "@expo/config-plugins";

const VIZBEE_SDK_DEPENDENCIES = {
  fireTV: "implementation 'tv.vizbee:firetv-receiver-sdk:4.2.3'",
  androidTV: "implementation 'tv.vizbee:androidtv-receiver-sdk:4.1.6'",
  both: {
    android: `flavorDimensions "default"
    productFlavors {
        androidTV {
            dimension "default"
        }
        fireTV {
            dimension "default"
        }
    }`,
    dependencies: `
    // Vizbee - Android TV
    androidTVImplementation "tv.vizbee:androidtv-receiver-sdk:4.1.6"
    
    // Vizbee - Fire TV
    fireTVImplementation "tv.vizbee:firetv-receiver-sdk:4.2.3"
    `,
  },
};

const withAddDependency: ConfigPlugin<{
  platform?: "fireTV" | "androidTV" | "both";
}> = (config, { platform = "both" }) => {
  return withAppBuildGradle(config, (config) => {
    let buildGradle = config.modResults.contents;

    // Add or merge productFlavors for 'both' option
    if (platform === "both") {
      if (!buildGradle.includes("flavorDimensions")) {
        buildGradle = buildGradle.replace(
          "android {",
          `android {
    ${VIZBEE_SDK_DEPENDENCIES.both.android}
            `
        );
      } else {
        // Merge the productFlavors block if it already exists
        buildGradle = buildGradle.replace(
          /flavorDimensions.*?productFlavors\s*\{[\s\S]*?\}/,
          VIZBEE_SDK_DEPENDENCIES.both.android
        );
      }

      // Add or merge dependencies
      if (!buildGradle.includes("androidTVImplementation")) {
        buildGradle = buildGradle.replace(
          "dependencies {",
          `dependencies {
        ${VIZBEE_SDK_DEPENDENCIES.both.dependencies}
            `
        );
      }
    } else {
      // Add specific dependencies for fireTV or androidTV
      const dependency = VIZBEE_SDK_DEPENDENCIES[platform];
      if (!buildGradle.includes(dependency)) {
        buildGradle = buildGradle.replace(
          "dependencies {",
          `dependencies {
    ${dependency}
            `
        );
      }
    }

    config.modResults.contents = buildGradle;

    return config;
  });
};

export default withAddDependency;
