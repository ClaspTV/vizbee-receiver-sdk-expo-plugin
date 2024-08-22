import {
  ConfigPlugin,
  withDangerousMod,
  AndroidConfig,
} from "@expo/config-plugins";
import fs from "fs";
import path from "path";

const withReceiverOptionsProvider: ConfigPlugin<{
  language?: "java" | "kotlin";
  platform?: "fireTV" | "androidTV" | "both";
}> = (config, { language = "kotlin", platform = "both" }) => {
  const packageName = AndroidConfig.Package.getPackage(config);

  return withDangerousMod(config, [
    "android",
    async (config) => {
      if (!packageName) {
        throw new Error("Unable to find package name");
      }
      const appPath = config.modRequest.projectRoot;
      const packagePath = packageName.replace(/\./g, path.sep);
      const mainSrcPath = path.join(
        appPath,
        "android",
        "app",
        "src",
        platform == "both" ? "androidTV" : "main",
        "java",
        packagePath
      );

      if (!fs.existsSync(mainSrcPath)) {
        fs.mkdirSync(mainSrcPath, { recursive: true });
      }

      const fileName = `AppReceiverOptionsProvider.${language === "kotlin" ? "kt" : "java"}`;
      const filePath = path.join(mainSrcPath, fileName);

      let fileContent = "";
      if (language === "kotlin") {
        fileContent = `
          package ${packageName}

import android.content.Context
import com.google.android.gms.cast.tv.CastReceiverOptions
import com.google.android.gms.cast.tv.ReceiverOptionsProvider
import java.util.*

class AppReceiverOptionsProvider : ReceiverOptionsProvider {
    override fun getOptions(context: Context): CastReceiverOptions {
        return CastReceiverOptions.Builder(context)
                    .setCustomNamespaces(
                        Arrays.asList("urn:x-cast:tv.vizbee.sync")  
                    )
                    .build()
    }
}`;
      } else if (language === "java") {
        fileContent = `
          package ${packageName};

import android.content.Context;
import com.google.android.gms.cast.tv.CastReceiverOptions;
import com.google.android.gms.cast.tv.ReceiverOptionsProvider;
import java.util.Arrays;

public class AppReceiverOptionsProvider implements ReceiverOptionsProvider {
    @Override
        public CastReceiverOptions getOptions(Context context) {
            return new CastReceiverOptions.Builder(context)
                .setCustomNamespaces(
                    Arrays.asList("urn:x-cast:tv.vizbee.sync")
                )
                .build();
        }
}`;
      }

      fs.writeFileSync(filePath, fileContent.trim(), "utf8");

      return config;
    },
  ]);
};

export default withReceiverOptionsProvider;
