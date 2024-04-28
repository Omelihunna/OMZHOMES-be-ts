"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var path_1 = require("path");
var child_process_1 = require("child_process");
// Transpile TypeScript files to JavaScript
(0, child_process_1.execSync)('tsc');
// Copy EJS files to the output directory
var sourceDir = (0, path_1.join)(__dirname, 'src', 'views');
var destDir = (0, path_1.join)(__dirname, 'dist/src', 'views');
fs.copySync(sourceDir, destDir);
