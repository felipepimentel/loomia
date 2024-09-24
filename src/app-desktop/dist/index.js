/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./packages/core/src/plugin-manager.ts":
/*!*********************************************!*\
  !*** ./packages/core/src/plugin-manager.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   pluginManager: () => (/* binding */ pluginManager)\n/* harmony export */ });\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var fs_promises__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! fs/promises */ \"fs/promises\");\n/* harmony import */ var fs_promises__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(fs_promises__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nclass PluginManager {\n    plugins = new Map();\n    userConfigPath;\n    constructor() {\n        // Set the path of the configuration file in userData\n        this.userConfigPath = path__WEBPACK_IMPORTED_MODULE_1___default().join(electron__WEBPACK_IMPORTED_MODULE_0__.app.getPath('userData'), 'user-config.json');\n    }\n    // Load user configuration\n    async loadUserConfig() {\n        try {\n            const configData = await fs_promises__WEBPACK_IMPORTED_MODULE_2___default().readFile(this.userConfigPath, 'utf-8');\n            return JSON.parse(configData).plugins;\n        }\n        catch (error) {\n            console.error('Failed to load user configuration, using default settings.', error);\n            return []; // Return an empty default configuration in case of failure\n        }\n    }\n    // Save user configuration\n    async saveUserConfig(config) {\n        try {\n            const configData = JSON.stringify({ plugins: config }, null, 2);\n            await fs_promises__WEBPACK_IMPORTED_MODULE_2___default().writeFile(this.userConfigPath, configData, 'utf-8');\n        }\n        catch (error) {\n            console.error('Failed to save user configuration.', error);\n        }\n    }\n    // Load plugins based on configuration\n    async loadPlugins() {\n        const userConfig = await this.loadUserConfig();\n        for (const pluginConfig of userConfig) {\n            const [pluginName, config] = Object.entries(pluginConfig)[0];\n            if (config.active) {\n                await this.loadPlugin(pluginName, config.pluginSettings);\n            }\n        }\n    }\n    // Load a specific plugin\n    async loadPlugin(pluginName, settings) {\n        try {\n            const { default: PluginClass } = await __webpack_require__(\"./packages/plugins lazy recursive ^\\\\.\\\\/.*$ referencedExports: default\")(`./${pluginName}`);\n            const { default: metadata } = await __webpack_require__(\"./packages/plugins lazy recursive ^\\\\.\\\\/.*\\\\/metadata\\\\.json$ referencedExports: default\")(`./${pluginName}/metadata.json`);\n            const plugin = new PluginClass(metadata);\n            if (plugin.initialize) {\n                await plugin.initialize(settings);\n            }\n            this.plugins.set(pluginName, plugin);\n            console.log(`Plugin ${pluginName} loaded successfully.`);\n        }\n        catch (error) {\n            console.error(`Failed to load plugin: ${pluginName}`, error);\n        }\n    }\n    // Get a specific plugin\n    getPlugin(pluginName) {\n        return this.plugins.get(pluginName);\n    }\n    // Get all loaded plugins\n    getAllPlugins() {\n        return Array.from(this.plugins.values());\n    }\n}\nconst pluginManager = new PluginManager();\n\n\n//# sourceURL=webpack://loomia/./packages/core/src/plugin-manager.ts?");

/***/ }),

/***/ "./packages/main/src/index.ts":
/*!************************************!*\
  !*** ./packages/main/src/index.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! url */ \"url\");\n/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var fs_promises__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! fs/promises */ \"fs/promises\");\n/* harmony import */ var fs_promises__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(fs_promises__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _core_plugin_manager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @core/plugin-manager */ \"./packages/core/src/plugin-manager.ts\");\n\n\n\n\n\n\nconst __filename = (0,url__WEBPACK_IMPORTED_MODULE_2__.fileURLToPath)(\"file:///home/pimentel/Workspace/loomia/packages/main/src/index.ts\");\nconst __dirname = (0,path__WEBPACK_IMPORTED_MODULE_1__.dirname)(__filename);\n// Function to create the main window\nconst createWindow = () => {\n    const mainWindow = new electron__WEBPACK_IMPORTED_MODULE_0__.BrowserWindow({\n        width: 800,\n        height: 600,\n        webPreferences: {\n            preload: (0,path__WEBPACK_IMPORTED_MODULE_1__.join)(__dirname, 'preload.js'), // Make sure the preload is in the correct path\n            contextIsolation: true,\n            nodeIntegration: false,\n        },\n    });\n    // Load the renderer's HTML file\n    mainWindow.loadFile((0,path__WEBPACK_IMPORTED_MODULE_1__.join)(__dirname, '../../renderer/dist/index.html'));\n};\n// Function to create the default configuration file in userData\nconst createDefaultConfig = async () => {\n    const defaultConfigPath = path__WEBPACK_IMPORTED_MODULE_1___default().join(__dirname, '../../config/user-config.default.json');\n    const userConfigPath = path__WEBPACK_IMPORTED_MODULE_1___default().join(electron__WEBPACK_IMPORTED_MODULE_0__.app.getPath('userData'), 'user-config.json');\n    try {\n        // Check if user-config.json already exists\n        await fs_promises__WEBPACK_IMPORTED_MODULE_3___default().access(userConfigPath);\n        console.log('Configuration file already exists.');\n    }\n    catch {\n        // If it doesn't exist, copy the default file to the userData directory\n        try {\n            await fs_promises__WEBPACK_IMPORTED_MODULE_3___default().copyFile(defaultConfigPath, userConfigPath);\n            console.log('Created default configuration file in userData.');\n        }\n        catch (error) {\n            console.error('Failed to create default configuration file.', error);\n        }\n    }\n};\n// Application initialization\nelectron__WEBPACK_IMPORTED_MODULE_0__.app.on('ready', async () => {\n    await createDefaultConfig(); // Ensure the configuration file exists\n    await _core_plugin_manager__WEBPACK_IMPORTED_MODULE_4__.pluginManager.loadPlugins(); // Load plugins on startup\n    createWindow(); // Create the main window\n});\nelectron__WEBPACK_IMPORTED_MODULE_0__.app.on('window-all-closed', () => {\n    if (process.platform !== 'darwin') {\n        electron__WEBPACK_IMPORTED_MODULE_0__.app.quit();\n    }\n});\nelectron__WEBPACK_IMPORTED_MODULE_0__.app.on('activate', () => {\n    if (electron__WEBPACK_IMPORTED_MODULE_0__.BrowserWindow.getAllWindows().length === 0) {\n        createWindow();\n    }\n});\n\n\n//# sourceURL=webpack://loomia/./packages/main/src/index.ts?");

/***/ }),

/***/ "./packages/plugins lazy recursive ^\\.\\/.*$ referencedExports: default":
/*!*************************************************************************************!*\
  !*** ./packages/plugins/ lazy ^\.\/.*$ referencedExports: default namespace object ***!
  \*************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var map = {\n\t\"./bottom-toolbar-plugin\": [\n\t\t\"./packages/plugins/bottom-toolbar-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_bottom-toolbar-plugin_index_ts\"\n\t],\n\t\"./bottom-toolbar-plugin/\": [\n\t\t\"./packages/plugins/bottom-toolbar-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_bottom-toolbar-plugin_index_ts\"\n\t],\n\t\"./bottom-toolbar-plugin/BottomToolbar.tsx\": [\n\t\t\"./packages/plugins/bottom-toolbar-plugin/BottomToolbar.tsx\",\n\t\t7,\n\t\t\"packages_plugins_bottom-toolbar-plugin_BottomToolbar_tsx\"\n\t],\n\t\"./bottom-toolbar-plugin/index\": [\n\t\t\"./packages/plugins/bottom-toolbar-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_bottom-toolbar-plugin_index_ts\"\n\t],\n\t\"./bottom-toolbar-plugin/index.ts\": [\n\t\t\"./packages/plugins/bottom-toolbar-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_bottom-toolbar-plugin_index_ts\"\n\t],\n\t\"./canvas-plugin\": [\n\t\t\"./packages/plugins/canvas-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_canvas-plugin_index_ts\"\n\t],\n\t\"./canvas-plugin/\": [\n\t\t\"./packages/plugins/canvas-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_canvas-plugin_index_ts\"\n\t],\n\t\"./canvas-plugin/canvas.tsx\": [\n\t\t\"./packages/plugins/canvas-plugin/canvas.tsx\",\n\t\t7,\n\t\t\"packages_plugins_canvas-plugin_canvas_tsx\"\n\t],\n\t\"./canvas-plugin/index\": [\n\t\t\"./packages/plugins/canvas-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_canvas-plugin_index_ts\"\n\t],\n\t\"./canvas-plugin/index.ts\": [\n\t\t\"./packages/plugins/canvas-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_canvas-plugin_index_ts\"\n\t],\n\t\"./canvas-plugin/metadata\": [\n\t\t\"./packages/plugins/canvas-plugin/metadata.ts\",\n\t\t9,\n\t\t\"packages_plugins_canvas-plugin_metadata_ts\"\n\t],\n\t\"./canvas-plugin/metadata.ts\": [\n\t\t\"./packages/plugins/canvas-plugin/metadata.ts\",\n\t\t9,\n\t\t\"packages_plugins_canvas-plugin_metadata_ts\"\n\t],\n\t\"./circle-plugin\": [\n\t\t\"./packages/plugins/circle-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_circle-plugin_index_ts\"\n\t],\n\t\"./circle-plugin/\": [\n\t\t\"./packages/plugins/circle-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_circle-plugin_index_ts\"\n\t],\n\t\"./circle-plugin/index\": [\n\t\t\"./packages/plugins/circle-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_circle-plugin_index_ts\"\n\t],\n\t\"./circle-plugin/index.ts\": [\n\t\t\"./packages/plugins/circle-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_circle-plugin_index_ts\"\n\t],\n\t\"./collaboration-plugin\": [\n\t\t\"./packages/plugins/collaboration-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_collaboration-plugin_index_ts\"\n\t],\n\t\"./collaboration-plugin/\": [\n\t\t\"./packages/plugins/collaboration-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_collaboration-plugin_index_ts\"\n\t],\n\t\"./collaboration-plugin/index\": [\n\t\t\"./packages/plugins/collaboration-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_collaboration-plugin_index_ts\"\n\t],\n\t\"./collaboration-plugin/index.ts\": [\n\t\t\"./packages/plugins/collaboration-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_collaboration-plugin_index_ts\"\n\t],\n\t\"./collaboration-plugin/websocketManager\": [\n\t\t\"./packages/plugins/collaboration-plugin/websocketManager.ts\",\n\t\t7,\n\t\t\"packages_plugins_collaboration-plugin_websocketManager_ts\"\n\t],\n\t\"./collaboration-plugin/websocketManager.ts\": [\n\t\t\"./packages/plugins/collaboration-plugin/websocketManager.ts\",\n\t\t7,\n\t\t\"packages_plugins_collaboration-plugin_websocketManager_ts\"\n\t],\n\t\"./connection-plugin\": [\n\t\t\"./packages/plugins/connection-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_connection-plugin_index_ts\"\n\t],\n\t\"./connection-plugin/\": [\n\t\t\"./packages/plugins/connection-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_connection-plugin_index_ts\"\n\t],\n\t\"./connection-plugin/connectionDrawer\": [\n\t\t\"./packages/plugins/connection-plugin/connectionDrawer.ts\",\n\t\t7,\n\t\t\"packages_plugins_connection-plugin_connectionDrawer_ts\"\n\t],\n\t\"./connection-plugin/connectionDrawer.ts\": [\n\t\t\"./packages/plugins/connection-plugin/connectionDrawer.ts\",\n\t\t7,\n\t\t\"packages_plugins_connection-plugin_connectionDrawer_ts\"\n\t],\n\t\"./connection-plugin/connectionManager\": [\n\t\t\"./packages/plugins/connection-plugin/connectionManager.ts\",\n\t\t7,\n\t\t\"packages_plugins_connection-plugin_connectionManager_ts\"\n\t],\n\t\"./connection-plugin/connectionManager.ts\": [\n\t\t\"./packages/plugins/connection-plugin/connectionManager.ts\",\n\t\t7,\n\t\t\"packages_plugins_connection-plugin_connectionManager_ts\"\n\t],\n\t\"./connection-plugin/index\": [\n\t\t\"./packages/plugins/connection-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_connection-plugin_index_ts\"\n\t],\n\t\"./connection-plugin/index.ts\": [\n\t\t\"./packages/plugins/connection-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_connection-plugin_index_ts\"\n\t],\n\t\"./connection-plugin/types\": [\n\t\t\"./packages/plugins/connection-plugin/types.ts\",\n\t\t7,\n\t\t\"packages_plugins_connection-plugin_types_ts\"\n\t],\n\t\"./connection-plugin/types.ts\": [\n\t\t\"./packages/plugins/connection-plugin/types.ts\",\n\t\t7,\n\t\t\"packages_plugins_connection-plugin_types_ts\"\n\t],\n\t\"./header-plugin\": [\n\t\t\"./packages/plugins/header-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_header-plugin_index_ts\"\n\t],\n\t\"./header-plugin/\": [\n\t\t\"./packages/plugins/header-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_header-plugin_index_ts\"\n\t],\n\t\"./header-plugin/Header.tsx\": [\n\t\t\"./packages/plugins/header-plugin/Header.tsx\",\n\t\t7,\n\t\t\"packages_plugins_header-plugin_Header_tsx\"\n\t],\n\t\"./header-plugin/index\": [\n\t\t\"./packages/plugins/header-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_header-plugin_index_ts\"\n\t],\n\t\"./header-plugin/index.ts\": [\n\t\t\"./packages/plugins/header-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_header-plugin_index_ts\"\n\t],\n\t\"./header-plugin/metadata\": [\n\t\t\"./packages/plugins/header-plugin/metadata.ts\",\n\t\t9,\n\t\t\"packages_plugins_header-plugin_metadata_ts\"\n\t],\n\t\"./header-plugin/metadata.ts\": [\n\t\t\"./packages/plugins/header-plugin/metadata.ts\",\n\t\t9,\n\t\t\"packages_plugins_header-plugin_metadata_ts\"\n\t],\n\t\"./left-toolbar-plugin\": [\n\t\t\"./packages/plugins/left-toolbar-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_left-toolbar-plugin_index_ts\"\n\t],\n\t\"./left-toolbar-plugin/\": [\n\t\t\"./packages/plugins/left-toolbar-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_left-toolbar-plugin_index_ts\"\n\t],\n\t\"./left-toolbar-plugin/LeftToolbar.tsx\": [\n\t\t\"./packages/plugins/left-toolbar-plugin/LeftToolbar.tsx\",\n\t\t7,\n\t\t\"packages_plugins_left-toolbar-plugin_LeftToolbar_tsx\"\n\t],\n\t\"./left-toolbar-plugin/index\": [\n\t\t\"./packages/plugins/left-toolbar-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_left-toolbar-plugin_index_ts\"\n\t],\n\t\"./left-toolbar-plugin/index.ts\": [\n\t\t\"./packages/plugins/left-toolbar-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_left-toolbar-plugin_index_ts\"\n\t],\n\t\"./rectangle-plugin\": [\n\t\t\"./packages/plugins/rectangle-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_rectangle-plugin_index_ts\"\n\t],\n\t\"./rectangle-plugin/\": [\n\t\t\"./packages/plugins/rectangle-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_rectangle-plugin_index_ts\"\n\t],\n\t\"./rectangle-plugin/index\": [\n\t\t\"./packages/plugins/rectangle-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_rectangle-plugin_index_ts\"\n\t],\n\t\"./rectangle-plugin/index.ts\": [\n\t\t\"./packages/plugins/rectangle-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_rectangle-plugin_index_ts\"\n\t],\n\t\"./right-sidebar-plugin\": [\n\t\t\"./packages/plugins/right-sidebar-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_right-sidebar-plugin_index_ts\"\n\t],\n\t\"./right-sidebar-plugin/\": [\n\t\t\"./packages/plugins/right-sidebar-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_right-sidebar-plugin_index_ts\"\n\t],\n\t\"./right-sidebar-plugin/RightSidebar.tsx\": [\n\t\t\"./packages/plugins/right-sidebar-plugin/RightSidebar.tsx\",\n\t\t7,\n\t\t\"packages_plugins_right-sidebar-plugin_RightSidebar_tsx\"\n\t],\n\t\"./right-sidebar-plugin/index\": [\n\t\t\"./packages/plugins/right-sidebar-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_right-sidebar-plugin_index_ts\"\n\t],\n\t\"./right-sidebar-plugin/index.ts\": [\n\t\t\"./packages/plugins/right-sidebar-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_right-sidebar-plugin_index_ts\"\n\t],\n\t\"./shape-plugin\": [\n\t\t\"./packages/plugins/shape-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_shape-plugin_index_ts\"\n\t],\n\t\"./shape-plugin/\": [\n\t\t\"./packages/plugins/shape-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_shape-plugin_index_ts\"\n\t],\n\t\"./shape-plugin/index\": [\n\t\t\"./packages/plugins/shape-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_shape-plugin_index_ts\"\n\t],\n\t\"./shape-plugin/index.ts\": [\n\t\t\"./packages/plugins/shape-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_shape-plugin_index_ts\"\n\t],\n\t\"./shape-plugin/shapeConfig\": [\n\t\t\"./packages/plugins/shape-plugin/shapeConfig.ts\",\n\t\t7,\n\t\t\"packages_plugins_shape-plugin_shapeConfig_ts\"\n\t],\n\t\"./shape-plugin/shapeConfig.ts\": [\n\t\t\"./packages/plugins/shape-plugin/shapeConfig.ts\",\n\t\t7,\n\t\t\"packages_plugins_shape-plugin_shapeConfig_ts\"\n\t],\n\t\"./shape-plugin/shapeDrawer\": [\n\t\t\"./packages/plugins/shape-plugin/shapeDrawer.ts\",\n\t\t7,\n\t\t\"packages_plugins_shape-plugin_shapeDrawer_ts\"\n\t],\n\t\"./shape-plugin/shapeDrawer.ts\": [\n\t\t\"./packages/plugins/shape-plugin/shapeDrawer.ts\",\n\t\t7,\n\t\t\"packages_plugins_shape-plugin_shapeDrawer_ts\"\n\t],\n\t\"./toolbar-plugin\": [\n\t\t\"./packages/plugins/toolbar-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_toolbar-plugin_index_ts\"\n\t],\n\t\"./toolbar-plugin/\": [\n\t\t\"./packages/plugins/toolbar-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_toolbar-plugin_index_ts\"\n\t],\n\t\"./toolbar-plugin/index\": [\n\t\t\"./packages/plugins/toolbar-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_toolbar-plugin_index_ts\"\n\t],\n\t\"./toolbar-plugin/index.ts\": [\n\t\t\"./packages/plugins/toolbar-plugin/index.ts\",\n\t\t7,\n\t\t\"packages_plugins_toolbar-plugin_index_ts\"\n\t]\n};\nfunction webpackAsyncContext(req) {\n\tif(!__webpack_require__.o(map, req)) {\n\t\treturn Promise.resolve().then(() => {\n\t\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\t\te.code = 'MODULE_NOT_FOUND';\n\t\t\tthrow e;\n\t\t});\n\t}\n\n\tvar ids = map[req], id = ids[0];\n\treturn __webpack_require__.e(ids[2]).then(() => {\n\t\treturn __webpack_require__.t(id, ids[1] | 16)\n\t});\n}\nwebpackAsyncContext.keys = () => (Object.keys(map));\nwebpackAsyncContext.id = \"./packages/plugins lazy recursive ^\\\\.\\\\/.*$ referencedExports: default\";\nmodule.exports = webpackAsyncContext;\n\n//# sourceURL=webpack://loomia/./packages/plugins/_lazy_^\\.\\/.*$_referencedExports:_default_namespace_object?");

/***/ }),

/***/ "./packages/plugins lazy recursive ^\\.\\/.*\\/metadata\\.json$ referencedExports: default":
/*!*****************************************************************************************************!*\
  !*** ./packages/plugins/ lazy ^\.\/.*\/metadata\.json$ referencedExports: default namespace object ***!
  \*****************************************************************************************************/
/***/ ((module) => {

eval("function webpackEmptyAsyncContext(req) {\n\t// Here Promise.resolve().then() is used instead of new Promise() to prevent\n\t// uncaught exception popping up in devtools\n\treturn Promise.resolve().then(() => {\n\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\te.code = 'MODULE_NOT_FOUND';\n\t\tthrow e;\n\t});\n}\nwebpackEmptyAsyncContext.keys = () => ([]);\nwebpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;\nwebpackEmptyAsyncContext.id = \"./packages/plugins lazy recursive ^\\\\.\\\\/.*\\\\/metadata\\\\.json$ referencedExports: default\";\nmodule.exports = webpackEmptyAsyncContext;\n\n//# sourceURL=webpack://loomia/./packages/plugins/_lazy_^\\.\\/.*\\/metadata\\.json$_referencedExports:_default_namespace_object?");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("electron");

/***/ }),

/***/ "fs/promises":
/*!******************************!*\
  !*** external "fs/promises" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("fs/promises");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".index.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = {
/******/ 			"main": 1
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		var installChunk = (chunk) => {
/******/ 			var moreModules = chunk.modules, chunkIds = chunk.ids, runtime = chunk.runtime;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			for(var i = 0; i < chunkIds.length; i++)
/******/ 				installedChunks[chunkIds[i]] = 1;
/******/ 		
/******/ 		};
/******/ 		
/******/ 		// require() chunk loading for javascript
/******/ 		__webpack_require__.f.require = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					installChunk(require("./" + __webpack_require__.u(chunkId)));
/******/ 				} else installedChunks[chunkId] = 1;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./packages/main/src/index.ts");
/******/ 	
/******/ })()
;