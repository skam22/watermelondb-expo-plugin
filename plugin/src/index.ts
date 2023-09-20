import {
  ConfigPlugin,
  withDangerousMod,
  withPlugins,
  withMainApplication,
} from "@expo/config-plugins";
import { addImports } from "@expo/config-plugins/build/android/codeMod";
import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";
import fs from "fs-extra";
import path from "path";

const readFileAsync = async (path: string) =>
  fs.promises.readFile(path, "utf-8");
const writeFileAsync = async (path: string, content: string) =>
  fs.promises.writeFile(path, content, "utf-8");

const androidPlugin: ConfigPlugin = (c) =>
  withDangerousMod(c, [
    "android",
    async (config) => {
      const { platformProjectRoot } = config.modRequest;
      /**
       * JSI Step 1: make sure you have NDK installed (version 23.1.7779620 has been tested to work)
       */

      /**
       * JSI Step 2: create new project in android/settings.gradle
       */
      const settingsFile = path.join(platformProjectRoot, "settings.gradle");
      const settingsContents = await readFileAsync(settingsFile);
      const projectDir = `new File(["node", "--print", "require.resolve('@nozbe/watermelondb/package.json')"].execute(null, rootDir).text.trim(), "../native/android-jsi")`;

      await writeFileAsync(
        settingsFile,
        mergeContents({
          tag: `@nozbe/watermelondb/jsi-installation`,
          src: settingsContents,
          newSrc: `
		include ':watermelondb-jsi'
		project(':watermelondb-jsi').projectDir = ${projectDir}`,
          offset: 0,
          comment: "//",
          anchor: "include ':app'",
        }).contents,
      );

      /**
       * JSI Step 3: add project created from step 2 as a dependency to the app
       */
      const buildFile = path.join(platformProjectRoot, "app/build.gradle");
      const buildContents = await readFileAsync(buildFile);
      await writeFileAsync(
        buildFile,
        mergeContents({
          tag: `@nozbe/watermelondb/jsi-installation`,
          src: buildContents,
          newSrc: `implementation project(':watermelondb-jsi')`,
          offset: 4,
          comment: "//",
          anchor:
            /def isGifEnabled = \(findProperty\('expo\.gif\.enabled'\) \?: ""\) == "true";/,
        }).contents,
      );

      /**
       * JSI Step 4: add proguard rules
       */
      const proguardFile = path.join(
        platformProjectRoot,
        "app/proguard-rules.pro",
      );
      const proguardContents = await readFileAsync(proguardFile);
      await writeFileAsync(
        proguardFile,
        mergeContents({
          tag: `@nozbe/watermelondb/jsi-installation`,
          src: proguardContents,
          newSrc: `-keep class com.nozbe.watermelondb.** { *; }`,
          offset: 0,
          comment: "#",
          anchor: /# Add any project specific keep options here:/,
        }).contents,
      );

      return config;
    },
  ]);

const modifyAndroidApplication: ConfigPlugin = (config) => {
  return withMainApplication(config, (config) => {
    const src = addImports(
      config.modResults.contents,
      [
        "java.util.Arrays",
        "com.facebook.react.bridge.JSIModuleSpec",
        "com.facebook.react.bridge.JSIModulePackage",
        "com.facebook.react.bridge.ReactApplicationContext",
        "com.facebook.react.bridge.JavaScriptContextHolder",
        "com.nozbe.watermelondb.jsi.WatermelonDBJSIPackage",
      ],
      config.modResults.language === "java",
    );

    const moreLinesToAdd = `
			@Override
			protected JSIModulePackage getJSIModulePackage() {
				return new JSIModulePackage() {
					@Override
					public List<JSIModuleSpec> getJSIModules(
						final ReactApplicationContext reactApplicationContext,
						final JavaScriptContextHolder jsContext
					) {
						List<JSIModuleSpec> modules = Arrays.asList();

						modules.addAll(new WatermelonDBJSIPackage().getJSIModules(reactApplicationContext, jsContext));
						// ⬅️ add more JSI packages here by conventions above

						return modules;
					}
				};
			}`;

    config.modResults.contents = mergeContents({
      src,
      tag: `@nozbe/watermelondb/jsi-package-tag`,
      newSrc: `${moreLinesToAdd}`,
      anchor: /getJSMainModuleName/,
      offset: -2,
      comment: "//",
    }).contents;

    return config;
  });
};

export const withAndroidWatermelon: ConfigPlugin = (config) =>
  withPlugins(config, [androidPlugin, modifyAndroidApplication]);

export default withAndroidWatermelon;
