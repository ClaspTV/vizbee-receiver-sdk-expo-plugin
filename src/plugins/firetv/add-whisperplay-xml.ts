import { ConfigPlugin, withAndroidManifest } from "@expo/config-plugins";
import fs from "fs";
import path from "path";

const withWhisperplay: ConfigPlugin<{ dialId: string }> = (
  config,
  { dialId }
) => {
  // Create whisperplay.xml file
  const createWhisperplayXml = (projectRoot: string) => {
    const resPath = path.join(
      projectRoot,
      "android",
      "app",
      "src",
      "main",
      "res",
      "xml"
    );
    if (!fs.existsSync(resPath)) {
      fs.mkdirSync(resPath, { recursive: true });
    }

    const whisperplayXml = `
<whisperplay>
    <dial>
        <application>
            <dialid>${dialId}</dialid>
            <startAction>android.intent.action.MAIN</startAction>
        </application>
    </dial>
</whisperplay>
    `.trim();

    fs.writeFileSync(path.join(resPath, "whisperplay.xml"), whisperplayXml);
  };

  // Modify AndroidManifest.xml
  config = withAndroidManifest(config, async (config) => {
    const { projectRoot } = config.modRequest;
    createWhisperplayXml(projectRoot);

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

    if (!application["meta-data"]) {
      application["meta-data"] = [];
    }

    // Ensure whisperplay metadata exists
    const hasWhisperplayMetaData = application["meta-data"].some(
      (metaData: any) => metaData["$"]["android:name"] === "whisperplay"
    );

    if (!hasWhisperplayMetaData) {
      application["meta-data"].push({
        $: {
          "android:name": "whisperplay",
          "android:resource": "@xml/whisperplay",
        },
      });
    }

    config.modResults = manifest;
    return config;
  });

  return config;
};

export default withWhisperplay;
