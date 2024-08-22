# Vizbee Receiver SDK Expo Plugin

The Vizbee Receiver SDK Expo plugin allows you to integrate the `react-native-vizbee-receiver-sdk` seamlessly into your Expo managed workflow.

## Installation

### Expo

```bash
npx expo install vizbee-receiver-sdk-expo-plugin
```

### NPM

```bash
npm install vizbee-receiver-sdk-expo-plugin
```

### Yarn

```bash
yarn add vizbee-receiver-sdk-expo-plugin
```

## Configuration

For Expo managed projects, add the following to your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": [
      [
        "vizbee-receiver-sdk-expo-plugin",
        {
          "vizbeeAppId": "your-vizbee-app-id",
          "dialId": "your-dial-id"
        }
      ]
    ]
  }
}
```

## Plugin Options

The plugin supports the following configuration options:

| Option      | Description                                        | Default Value | Mandatory/Optional |
| ----------- | -------------------------------------------------- | ------------- | ------------------ |
| vizbeeAppId | The Vizbee application ID used for initialization. | N/A           | Mandatory          |
| dialId      | The DIAL ID for your application.                  | N/A           | Mandatory          |

## Additional Information

- **Compatibility**: This plugin is supported with Expo 50 and above.
- **Issues**: [Report issues](https://github.com/ClaspTV/vizbee-receiver-sdk-expo-plugin/issues)

For more detailed information about using the Vizbee Receiver SDK in your Expo project, please refer to the official Vizbee documentation.
