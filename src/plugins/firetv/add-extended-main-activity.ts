import {
  ConfigPlugin,
  withDangerousMod,
  AndroidConfig,
} from "@expo/config-plugins";
import { promises as fs } from "fs";
import path from "path";

const withExtendedMainActivity: ConfigPlugin<{
  language?: "java" | "kotlin";
  platform?: "fireTV" | "androidTV" | "both";
}> = (config, { language = "kotlin", platform = "both" }) => {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const packageName = AndroidConfig.Package.getPackage(config);
      if (!packageName) {
        throw new Error(
          "Cannot find package name in Android config. Make sure your project is properly configured."
        );
      }

      const packageNamePath = packageName.replace(/\./g, "/");
      const fileExtension = language === "java" ? "java" : "kt";
      const fileName = `ExtendedMainActivity.${fileExtension}`;
      const directoryPath = path.join(
        projectRoot,
        "android",
        "app",
        "src",
        platform == "both" ? "fireTV" : "main",
        "java",
        packageNamePath
      );
      const filePath = path.join(directoryPath, fileName);

      const classContentJava = `package ${packageName};

public class ExtendedMainActivity extends MainActivity {

}`;
      const classContentKotlin = `package ${packageName}

class ExtendedMainActivity : MainActivity() {

}`;

      const classContent =
        language === "java" ? classContentJava : classContentKotlin;

      await fs.mkdir(directoryPath, { recursive: true });
      await fs.writeFile(filePath, classContent);

      return config;
    },
  ]);
};

export default withExtendedMainActivity;
