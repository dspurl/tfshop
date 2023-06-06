#!/usr/bin/env node

'use strict';

const destr = require('destr');
const nanoid = require('nanoid');
const rc9 = require('rc9');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
const createRequire = require('create-require');
const os = require('os');
const gitUrlParse = require('git-url-parse');
const parseGitConfig = require('parse-git-config');
const isDocker = require('is-docker');
const ci = require('ci-info');
const fs$1 = require('fs-extra');
const crypto = require('crypto');
const consola = require('consola');
const c = require('chalk');
const inquirer = require('inquirer');
const stdEnv = require('std-env');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

const destr__default = /*#__PURE__*/_interopDefaultLegacy(destr);
const fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch);
const path__default = /*#__PURE__*/_interopDefaultLegacy(path);
const createRequire__default = /*#__PURE__*/_interopDefaultLegacy(createRequire);
const os__default = /*#__PURE__*/_interopDefaultLegacy(os);
const gitUrlParse__default = /*#__PURE__*/_interopDefaultLegacy(gitUrlParse);
const parseGitConfig__default = /*#__PURE__*/_interopDefaultLegacy(parseGitConfig);
const isDocker__default = /*#__PURE__*/_interopDefaultLegacy(isDocker);
const ci__default = /*#__PURE__*/_interopDefaultLegacy(ci);
const fs__default = /*#__PURE__*/_interopDefaultLegacy(fs$1);
const consola__default = /*#__PURE__*/_interopDefaultLegacy(consola);
const c__default = /*#__PURE__*/_interopDefaultLegacy(c);
const inquirer__default = /*#__PURE__*/_interopDefaultLegacy(inquirer);
const stdEnv__default = /*#__PURE__*/_interopDefaultLegacy(stdEnv);

var name = "@nuxt/telemetry";
var version = "1.3.6";

function updateUserNuxtRc(key, val) {
  rc9.updateUser({[key]: val}, ".nuxtrc");
}

const consentVersion = 1;

async function postEvent(endpoint, body) {
  const res = await fetch__default['default'](endpoint, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      "user-agent": "Nuxt Telemetry " + version
    },
    timeout: 4e3
  });
  if (!res.ok) {
    throw new Error(res.statusText);
  }
}

const build = function({nuxt}, payload) {
  const duration = {build: payload.duration.build};
  let isSuccess = true;
  for (const [name, stat] of Object.entries(payload.stats)) {
    duration[name] = stat.duration;
    if (!stat.success) {
      isSuccess = false;
    }
  }
  return {
    name: "build",
    isSuccess,
    isDev: nuxt.options.dev || false,
    duration
  };
};

const command = function({nuxt}) {
  let command2 = "unknown";
  const flagMap = {
    dev: "dev",
    _generate: "generate",
    _export: "export",
    _build: "build",
    _serve: "serve",
    _start: "start"
  };
  for (const flag in flagMap) {
    if (nuxt.options[flag]) {
      command2 = flagMap[flag];
      break;
    }
  }
  return {
    name: "command",
    command: command2
  };
};

const generate = function generate2({nuxt}, payload) {
  return {
    name: "generate",
    isExport: !!nuxt.options._export,
    routesCount: payload.routesCount,
    duration: {
      generate: payload.duration.generate
    }
  };
};

const dependency = function({nuxt: {options}}) {
  const events = [];
  const projectDeps = getDependencies(options.rootDir);
  const modules = normalizeModules(options.modules);
  const buildModules = normalizeModules(options.buildModules);
  const relatedDeps = [...modules, ...buildModules];
  for (const dep of projectDeps) {
    if (!relatedDeps.includes(dep.name)) {
      continue;
    }
    events.push({
      name: "dependency",
      packageName: dep.name,
      version: dep.version,
      isDevDependency: dep.dev,
      isModule: modules.includes(dep.name),
      isBuildModule: buildModules.includes(dep.name)
    });
  }
  return events;
};
function normalizeModules(modules) {
  return modules.map((m) => {
    if (typeof m === "string") {
      return m;
    }
    if (Array.isArray(m) && typeof m[0] === "string") {
      return m[0];
    }
    return null;
  }).filter(Boolean);
}
function getDependencies(rootDir) {
  const pkgPath = path.join(rootDir, "package.json");
  if (!fs.existsSync(pkgPath)) {
    return [];
  }
  const _require = createRequire__default['default'](rootDir);
  const pkg = _require(pkgPath);
  const mapDeps = (depsObj, dev = false) => {
    const _deps = [];
    for (const name in depsObj) {
      try {
        const pkg2 = _require(path.join(name, "package.json"));
        _deps.push({name, version: pkg2.version, dev});
      } catch (_e) {
        _deps.push({name, version: depsObj[name], dev});
      }
    }
    return _deps;
  };
  const deps = [];
  if (pkg.dependencies) {
    deps.push(...mapDeps(pkg.dependencies));
  }
  if (pkg.devDependencies) {
    deps.push(...mapDeps(pkg.dependencies, true));
  }
  return deps;
}

const project = function(context) {
  const {options} = context.nuxt;
  return {
    name: "project",
    type: context.git && context.git.url ? "git" : "local",
    isSSR: options.mode === "universal" || options.ssr === true,
    target: options._generate ? "static" : "server",
    packageManager: context.packageManager
  };
};

const session = function({seed}) {
  return {
    name: "session",
    id: seed
  };
};

const events = /*#__PURE__*/Object.freeze({
  __proto__: null,
  build: build,
  command: command,
  generate: generate,
  dependency: dependency,
  getDependencies: getDependencies,
  project: project,
  session: session
});

const FILE2PM = {
  "yarn.lock": "yarn",
  "package-lock.json": "npm",
  "shrinkwrap.json": "npm"
};
async function detectPackageManager(rootDir) {
  for (const file in FILE2PM) {
    if (await fs__default['default'].pathExists(path__default['default'].resolve(rootDir, file))) {
      return FILE2PM[file];
    }
  }
  return "unknown";
}

function hash(str) {
  return crypto.createHash("sha256").update(str).digest("hex").substr(0, 16);
}

async function createContext(nuxt, options) {
  const rootDir = nuxt.options.rootDir || process.cwd();
  const git = await getGit(rootDir);
  const packageManager = await detectPackageManager(rootDir);
  const {seed} = options;
  const projectHash = await getProjectHash(rootDir, git, seed);
  const projectSession = getProjectSession(projectHash, seed);
  const nuxtVersion = (nuxt.constructor.version || "").replace("v", "");
  const nodeVersion = process.version.replace("v", "");
  const isEdge = nuxtVersion.includes("-");
  return {
    nuxt,
    seed,
    git,
    projectHash,
    projectSession,
    nuxtVersion,
    isEdge,
    cli: getCLI(),
    nodeVersion,
    os: os__default['default'].type().toLocaleLowerCase(),
    environment: getEnv(),
    packageManager,
    concent: options.consent
  };
}
function getEnv() {
  if (process.env.CODESANDBOX_SSE) {
    return "CSB";
  }
  if (ci__default['default'].isCI) {
    return ci__default['default'].name;
  }
  if (isDocker__default['default']()) {
    return "Docker";
  }
  return "unknown";
}
function getCLI() {
  let entry;
  if (typeof require !== "undefined" && require.main && require.main.filename) {
    entry = require.main.filename;
  } else {
    entry = process.argv[1];
  }
  const knownCLIs = {
    "nuxt-ts.js": "nuxt-ts",
    "nuxt-start.js": "nuxt-start",
    "nuxt.js": "nuxt"
  };
  for (const key in knownCLIs) {
    if (entry.includes(key)) {
      const edge = entry.includes("-edge") ? "-edge" : "";
      return knownCLIs[key] + edge;
    }
  }
  return "programmatic";
}
function getProjectSession(projectHash, sessionId) {
  return hash(`${projectHash}#${sessionId}`);
}
function getProjectHash(rootDir, git, seed) {
  let id;
  if (git && git.url) {
    id = `${git.source}#${git.owner}#${git.name}`;
  } else {
    id = `${rootDir}#${seed}`;
  }
  return hash(id);
}
async function getGitRemote(rootDir) {
  try {
    const parsed = await parseGitConfig__default['default']({cwd: rootDir});
    if (parsed) {
      const gitRemote = parsed['remote "origin"'].url;
      return gitRemote;
    }
    return null;
  } catch (err) {
    return null;
  }
}
async function getGit(rootDir) {
  const gitRemote = await getGitRemote(rootDir);
  if (!gitRemote) {
    return;
  }
  const meta = gitUrlParse__default['default'](gitRemote);
  const url = meta.toString("https");
  return {
    url,
    gitRemote,
    source: meta.source,
    owner: meta.owner,
    name: meta.name
  };
}

const log = consola__default['default'].withScope("@nuxt/telemetry");

class Telemetry {
  constructor(nuxt, options) {
    this.events = [];
    this.nuxt = nuxt;
    this.options = options;
  }
  getContext() {
    if (!this._contextPromise) {
      this._contextPromise = createContext(this.nuxt, this.options);
    }
    return this._contextPromise;
  }
  createEvent(name, payload) {
    const eventFactory = events[name];
    if (typeof eventFactory !== "function") {
      log.warn("Unknown event:", name);
      return;
    }
    const eventPromise = this._invokeEvent(name, eventFactory, payload);
    this.events.push(eventPromise);
  }
  async _invokeEvent(name, eventFactory, payload) {
    try {
      const context = await this.getContext();
      const event = await eventFactory(context, payload);
      event.name = name;
      return event;
    } catch (err) {
      log.error("Error while running event:", err);
    }
  }
  async getPublicContext() {
    const context = await this.getContext();
    const eventContext = {};
    for (const key of [
      "nuxtVersion",
      "isEdge",
      "nodeVersion",
      "cli",
      "os",
      "environment",
      "projectHash",
      "projectSession"
    ]) {
      eventContext[key] = context[key];
    }
    return eventContext;
  }
  async sendEvents() {
    const events2 = [].concat(...(await Promise.all(this.events)).filter(Boolean));
    this.events = [];
    const context = await this.getPublicContext();
    const body = {
      timestamp: Date.now(),
      context,
      events: events2
    };
    if (this.options.endpoint) {
      const start = Date.now();
      try {
        log.info("Sending events:", JSON.stringify(body, null, 2));
        await postEvent(this.options.endpoint, body);
        log.success(`Events sent to \`${this.options.endpoint}\` (${Date.now() - start} ms)`);
      } catch (err) {
        log.error(`Error sending sent to \`${this.options.endpoint}\` (${Date.now() - start} ms)
`, err);
      }
    }
  }
}

function getStats(stats) {
  const duration = stats.endTime - stats.startTime;
  return {
    duration,
    success: stats.compilation.errors.length === 0,
    size: 0,
    fullHash: stats.compilation.fullHash
  };
}

async function ensureUserconsent(options) {
  if (options.consent >= consentVersion) {
    return true;
  }
  if (stdEnv__default['default'].minimal || process.env.CODESANDBOX_SSE || process.env.NEXT_TELEMETRY_DISABLED || isDocker__default['default']()) {
    return false;
  }
  process.stdout.write("\n");
  consola__default['default'].info(`${c__default['default'].green("NuxtJS")} collects completely anonymous data about usage.
  This will help us improve Nuxt developer experience over time.
  Read more on ${c__default['default'].cyan.underline("https://git.io/nuxt-telemetry")}
`);
  const {accept} = await inquirer__default['default'].prompt({
    type: "confirm",
    name: "accept",
    message: "Are you interested in participating?"
  });
  process.stdout.write("\n");
  if (accept) {
    updateUserNuxtRc("telemetry.consent", consentVersion);
    updateUserNuxtRc("telemetry.enabled", true);
    return true;
  }
  updateUserNuxtRc("telemetry.enabled", false);
  return false;
}

async function _telemetryModule(nuxt) {
  const toptions = {
    endpoint: destr__default['default'](process.env.NUXT_TELEMETRY_ENDPOINT) || "https://telemetry.nuxtjs.com",
    debug: destr__default['default'](process.env.NUXT_TELEMETRY_DEBUG),
    ...nuxt.options.telemetry
  };
  if (!toptions.debug) {
    log.level = -Infinity;
  }
  if (nuxt.options.telemetry !== true) {
    if (toptions.enabled === false || nuxt.options.telemetry === false || !await ensureUserconsent(toptions)) {
      log.info("Telemetry disabled");
      return;
    }
  }
  log.info("Telemetry enabled");
  if (!toptions.seed) {
    toptions.seed = hash(nanoid.nanoid());
    updateUserNuxtRc("telemetry.seed", toptions.seed);
    log.info("Seed generated:", toptions.seed);
  }
  const t = new Telemetry(nuxt, toptions);
  if (nuxt.options._start) {
    nuxt.hook("listen", () => {
      t.createEvent("project");
      t.createEvent("session");
      t.createEvent("command");
      t.sendEvents();
    });
  }
  nuxt.hook("build:before", () => {
    t.createEvent("project");
    t.createEvent("session");
    t.createEvent("command");
    t.createEvent("dependency");
  });
  profile(nuxt, t);
}
const telemetryModule = async function() {
  try {
    await _telemetryModule(this.nuxt);
  } catch (err) {
    log.error(err);
  }
};
function profile(nuxt, t) {
  const startT = {};
  const duration = {};
  const stats = {};
  let routesCount = 0;
  const timeStart = (name2) => {
    startT[name2] = Date.now();
  };
  const timeEnd = (name2) => {
    duration[name2] = Date.now() - startT[name2];
  };
  nuxt.hook("build:before", () => {
    timeStart("build");
  });
  nuxt.hook("build:done", () => {
    timeEnd("build");
  });
  nuxt.hook("build:compiled", ({name: name2, stats: _stats}) => {
    stats[name2] = getStats(_stats);
  });
  nuxt.hook("generate:extendRoutes", () => timeStart("generate"));
  nuxt.hook("generate:routeCreated", () => {
    routesCount++;
  });
  nuxt.hook("generate:done", () => {
    timeEnd("generate");
    t.createEvent("generate", {duration, stats, routesCount});
    t.sendEvents();
  });
  nuxt.hook("build:done", () => {
    t.createEvent("build", {duration, stats});
    t.sendEvents();
  });
}
telemetryModule.meta = {name, version};

module.exports = telemetryModule;
