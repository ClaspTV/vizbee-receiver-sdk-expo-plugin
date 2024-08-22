import {
  ConfigPlugin,
  withDangerousMod,
  AndroidConfig,
} from "@expo/config-plugins";
import fs from "fs";
import path from "path";

const createExtendedMainActivity: ConfigPlugin<{
  language?: "java" | "kotlin";
  platform?: "fireTV" | "androidTV" | "both";
}> = (config, { language = "kotlin", platform = "both" }) => {
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
      const targetDir = path.join(
        projectRoot,
        "android",
        "app",
        "src",
        platform == "both" ? "androidTV" : "main",
        "java",
        packageNamePath
      );

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const classContent =
        language === "kotlin"
          ? getKotlinClassContent(packageName)
          : getJavaClassContent(packageName);
      const fileName = `ExtendedMainActivity.${language === "kotlin" ? "kt" : "java"}`;
      const filePath = path.join(targetDir, fileName);

      fs.writeFileSync(filePath, classContent, { encoding: "utf8" });

      return config;
    },
  ]);
};

function getKotlinClassContent(packageName: string): string {
  return `package ${packageName}

import android.util.Log
import android.content.Intent
import com.google.android.gms.cast.tv.CastReceiverContext

class ExtendedMainActivity : MainActivity() {
    
  override fun onStart() {
      super.onStart()
      
      handleLoadIntent(intent)
  }

  override fun onNewIntent(intent: Intent) {
      super.onNewIntent(intent)

      handleLoadIntent(intent)
  }

  private fun handleLoadIntent(intent: Intent) {
       Log.d("PlatformSplashActivity", intent.toString() + "\\n" + CastReceiverContext.getInstance()?.mediaManager.toString())
       CastReceiverContext.getInstance()?.mediaManager?.let { mediaManager ->
            // Pass the intent to the SDK.
            if (mediaManager.onNewIntent(intent)) {
                Log.d("PlatformSplashActivity", "The intent is already handled by the SDK")
            }
        }
  }
}
`;
}

function getJavaClassContent(packageName: string): string {
  return `package ${packageName};

import android.util.Log;
import android.content.Intent;
import com.google.android.gms.cast.tv.CastReceiverContext;

public class ExtendedMainActivity extends MainActivity {
    
  @Override
  protected void onStart() {
      super.onStart();
      
      handleLoadIntent(getIntent());
  }

  @Override
  protected void onNewIntent(Intent intent) {
      super.onNewIntent(intent);

      handleLoadIntent(intent);
  }

  private void handleLoadIntent(Intent intent) {
       Log.d("PlatformSplashActivity", intent.toString() + "\\n" + CastReceiverContext.getInstance().getMediaManager().toString());
       CastReceiverContext.getInstance().getMediaManager().ifPresent(mediaManager -> {
            // Pass the intent to the SDK.
            if (mediaManager.onNewIntent(intent)) {
                Log.d("PlatformSplashActivity", "The intent is already handled by the SDK");
            }
        });
  }
}
`;
}

export default createExtendedMainActivity;
