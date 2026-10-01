const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");

const source = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

assert.match(
  source,
  /if \(!rawSection \|\| normalizeSection\(rawSection\) !== activeSection\) \{\s*window\.history\.replaceState/,
  "initial history entry must canonicalize a missing section so Back restores the URL too",
);

assert.match(
  source,
  /const selectSection = \(section\) => \{\s*syncSectionSurfaces\(section\);\s*setActiveSection\(section\);\s*\}/,
  "user selection must synchronize the title and URL before scheduling the React state update",
);

assert.match(
  source,
  /onClick=\{\(\) => selectSection\(s\.id\)\}/,
  "click navigation must use the synchronous shared selection path",
);

assert.doesNotMatch(
  source,
  /useEffect\(\(\) => \{\s*document\.title = `\$\{activeSectionTitle\} — \$\{productTitle\}`/,
  "the document title must not lag behind selection in a post-render effect",
);
