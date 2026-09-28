import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const target = path.join(__dirname, 'node_modules', 'rollup', 'dist', 'native.js');
if (fs.existsSync(target)) {
    let content = fs.readFileSync(target, 'utf8');
    if (!content.includes("@rollup/wasm-node/dist/native.js")) {
        content = content.replace(
            /const nativeModule = requireWithFriendlyError\(\s*existsSync\(path\.join\(__dirname, localName\)\) \? localName : `@rollup\/rollup-\$\{packageBase\}`\s*\);/,
            `let nativeModule;
try {
\tnativeModule = requireWithFriendlyError(
\t\texistsSync(path.join(__dirname, localName)) ? localName : \`@rollup/rollup-\${packageBase}\`
\t);
} catch (e) {
\ttry {
\t\tnativeModule = require('@rollup/wasm-node/dist/native.js');
\t} catch (_) {
\t\tthrow e;
\t}
}`
        );
        fs.writeFileSync(target, content, 'utf8');
        console.log('Successfully patched rollup for wasm fallback.');
    }
}
