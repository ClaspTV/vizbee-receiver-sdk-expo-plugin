import {
  ConfigPlugin,
  withDangerousMod,
  AndroidConfig,
} from "@expo/config-plugins";
import fs from "fs";
import path from "path";

const makeMainActivityOpen: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const packageName = AndroidConfig.Package.getPackage(config);
      if (!packageName) {
        throw new Error(
          "Cannot find package name in Android config. Make sure your project is properly configured."
        );
      }

      const packageNamePath = packageName.replace(/\./g, "/");
      const projectRoot = config.modRequest.projectRoot;
      const mainActivityPathKotlin = path.join(
        projectRoot,
        "android/app/src/main/java",
        packageNamePath,
        "MainActivity.kt"
      );
      const mainActivityPathJava = path.join(
        projectRoot,
        "android/app/src/main/java",
        packageNamePath,
        "MainActivity.java"
      );

      if (fs.existsSync(mainActivityPathKotlin)) {
        modifyMainActivityFile(mainActivityPathKotlin, "kotlin");
      } else if (fs.existsSync(mainActivityPathJava)) {
        modifyMainActivityFile(mainActivityPathJava, "java");
      } else {
        throw new Error("MainActivity file not found in Kotlin or Java.");
      }

      return config;
    },
  ]);
};

function modifyMainActivityFile(filePath: string, language: "java" | "kotlin") {
  const fileContent = fs.readFileSync(filePath, { encoding: "utf8" });

  if (language === "kotlin") {
    if (!fileContent.includes("open class MainActivity")) {
      const modifiedContent = fileContent.replace(
        /class MainActivity/,
        "open class MainActivity"
      );
      fs.writeFileSync(filePath, modifiedContent, { encoding: "utf8" });
    }
  } else if (language === "java") {
    if (!fileContent.includes("public class MainActivity")) {
      const modifiedContent = fileContent.replace(
        /class MainActivity/,
        "public class MainActivity"
      );
      fs.writeFileSync(filePath, modifiedContent, { encoding: "utf8" });
    }
  }
}

export default makeMainActivityOpen;
