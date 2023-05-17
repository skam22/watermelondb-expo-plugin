# @skam22/watermelondb-expo-plugin

Expo config plugin for WatermelonDB that includes support for JSI

# Usage

#### Add @nozbe/watermelondb and its dependencies:

```
npx expo install @nozbe/watermelondb @babel/plugin-proposal-decorators
```

#### Modify your `babel.config.js` file to include the decorator plugin:

```js
module.exports = function (api) {
	api.cache(true);
	return {
		presets: ['babel-preset-expo'],
		plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]],
	};
};
```

### Add expo dependencies

```
npx expo install @expo/config-plugins expo-build-properties
```

### Add the watermelondb-expo-plugin

```
npx expo install @skam22/watermelondb-expo-plugin
```

#### Modify your `app.json` plugin block to add the following:

```javascript
{
	"expo": {
		...
		"plugins": [
			[
				"expo-build-properties",
				{
					"android": {
						"kotlinVersion": "1.6.10",
						"compileSdkVersion": 33,
						"targetSdkVersion": 33,
						"packagingOptions": {
							"pickFirst": ["**/libc++_shared.so"]
						}
					}
				}
			],
			"@skam22/watermelondb-expo-plugin"
		],
	}
}
```

### Build a client for each platform

```
npx expo run:ios
```

```
npx expo run:android
```

# Contributing

Contributions are very welcome! Current limitations of this plugin:

The modifications to the native files are all accomplished by reading the existing contents of the document, searching for an existing line to anchor around, inserting the modification, and then saving the file.

If the structure/contents/spelling of these default files change in future versions of react native or expo in any way, these plugin modifications will fail.

For example, the Podfile modification inserts

```js
pod 'simdjson', path: '../node_modules/@nozbe/simdjson', modular_headers: true

```

by referencing the line:

```js
flipper_config = FlipperConfiguration.disabled;
```

If the referenced line doesn't exist or is modified in any way, the iOS plugin will fail.

The `@nozbe/watermelondb` android specific installation steps are accomplished similarly.

`android/settings.gradle` references the line:

```js
include ':app'
```

`android/app/build.gradle` references the line:

```js
def isGifEnabled = (findProperty('expo.gif.enabled') ?: "") == "true";
```

`android/app/proguard-rules.pro` references the line

```
# Add any project specific keep options here:
```

`MainApplication.java` references the line:

```js
import java.util.List;
```

and also searches for the line that includes this text, and then inserts the JSIModulePackage Override 3 lines later:

```js
isHermesEnabled();
```

This approach is not future proof and probably not backwards compatible either, though I haven't specifically checked the contents of the default files for older versions of react native or expo.
