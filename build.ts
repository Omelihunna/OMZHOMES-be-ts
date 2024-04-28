import * as fs from 'fs-extra';
import { join } from 'path';
import { execSync } from 'child_process';

// Transpile TypeScript files to JavaScript
execSync('tsc');

// Copy EJS files to the output directory
const sourceDir = join(__dirname, 'src', 'views');
const destDir = join(__dirname, 'dist/src', 'views');
fs.copySync(sourceDir, destDir);
