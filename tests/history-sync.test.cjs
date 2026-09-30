const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");

const source = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

assert.match(
  source,
  /if \(!rawSection \|\| normalizeSection\(rawSection\) !== activeSection\) \{\s*window\.history\.replaceState/,
  "initial history entry must canonicalize a missing section so Back restores the URL too",
);
