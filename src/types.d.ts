export interface VizbeePluginOptions {
  vizbeeAppId: string;
  dialId: string;
  platform?: "fireTV" | "androidTV" | "both";
  language?: "kotlin";
}
