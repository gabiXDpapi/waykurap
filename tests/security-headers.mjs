import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const source = ts.transpileModule(readFileSync(new URL('../next.config.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const exports = {};
runInNewContext(source, { exports });
const rules = await exports.default.headers();
assert.equal(rules.length, 1);
assert.equal(rules[0].source, '/:path*');
const headers = Object.fromEntries(rules[0].headers.map(({ key, value }) => [key, value]));
assert.equal(headers['Permissions-Policy'], 'camera=(self), microphone=(), geolocation=()');
assert.equal(headers['X-Frame-Options'], 'DENY');
assert.equal(headers['X-Content-Type-Options'], 'nosniff');
assert.equal(headers['Referrer-Policy'], 'strict-origin-when-cross-origin');
for (const directive of ["frame-ancestors 'none'", "object-src 'none'", "base-uri 'self'", "form-action 'self'"]) {
  assert.ok(headers['Content-Security-Policy'].split('; ').includes(directive));
}
console.log('Security header checks passed.');
