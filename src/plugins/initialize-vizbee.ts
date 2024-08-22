import { ConfigPlugin, withMainApplication } from "@expo/config-plugins";

/**
 * Adds Vizbee initialization line to MainApplication's onCreate method.
 * @param config - Expo config object.
 * @param options - Options object containing parameters like language.
 * @returns The modified config object.
 */
const withVizbeeInitialization: ConfigPlugin<{
  language?: "kotlin" | "java";
}> = (config, { language = "kotlin" }) => {
  config = withMainApplication(config, (config) => {
    config.modResults.contents = addVizbeeInitialization(
      config.modResults.contents,
      language
    );
    return config;
  });

  return config;
};

/**
 * Adds the Vizbee initialization line to MainApplication.java or MainApplication.kt.
 * @param mainApplicationContents - Contents of MainApplication file as string.
 * @param language - Language of the file ("kotlin" or "java").
 * @returns Updated contents of MainApplication file.
 */
function addVizbeeInitialization(
  mainApplicationContents: string,
  language: "kotlin" | "java"
): string {
  const VIZBEE_INITIALIZATION_LINE =
    language === "java"
      ? `\n    Vizbee.getInstance().setApplication(this);\n`
      : `\n    Vizbee.getInstance().setApplication(this)\n`;

  // For Java and Kotlin, look for super.onCreate() and insert the initialization line after it
  const superOnCreateMatch =
    language === "java"
      ? mainApplicationContents.match(/super\.onCreate\(.*\);\n/)
      : mainApplicationContents.match(/super\.onCreate\(.*\)\n/);

  const importLines =
    language === "java"
      ? "import tv.vizbee.screen.api.Vizbee;"
      : "import tv.vizbee.screen.api.Vizbee";

  if (superOnCreateMatch?.index) {
    const superOnCreateIndex =
      superOnCreateMatch.index + superOnCreateMatch[0].length;
    mainApplicationContents =
      mainApplicationContents.slice(0, superOnCreateIndex) +
      VIZBEE_INITIALIZATION_LINE +
      "\n" +
      mainApplicationContents.slice(superOnCreateIndex);
  } else {
    throw new Error(
      `Could not find super.onCreate() method call in MainApplication contents.`
    );
  }

  // Add import statements if not already present
  if (!mainApplicationContents.includes(importLines)) {
    const packageDeclarationMatch =
      mainApplicationContents.match(/package\s+[\w.]+;?/);

    if (packageDeclarationMatch) {
      const packageDeclarationIndex =
        packageDeclarationMatch.index! + packageDeclarationMatch[0].length;
      mainApplicationContents =
        mainApplicationContents.slice(0, packageDeclarationIndex) +
        "\n\n" +
        importLines +
        "\n" +
        mainApplicationContents.slice(packageDeclarationIndex);
    }
  }

  return mainApplicationContents;
}

export default withVizbeeInitialization;
