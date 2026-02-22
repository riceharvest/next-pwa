/**
 * @opensourceframework/next-pwa
 * Zero config PWA plugin for Next.js with Turbopack compatibility
 *
 * @original-author Shadow Walker
 * @original-repo https://github.com/shadowwalker/next-pwa
 * @license MIT
 */
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// cache.js
var require_cache = __commonJS({
  "cache.js"(exports, module) {
    "use strict";
    module.exports = [
      {
        urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts-webfonts",
          expiration: {
            maxEntries: 4,
            maxAgeSeconds: 365 * 24 * 60 * 60
            // 365 days
          }
        }
      },
      {
        urlPattern: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "google-fonts-stylesheets",
          expiration: {
            maxEntries: 4,
            maxAgeSeconds: 7 * 24 * 60 * 60
            // 7 days
          }
        }
      },
      {
        urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-font-assets",
          expiration: {
            maxEntries: 4,
            maxAgeSeconds: 7 * 24 * 60 * 60
            // 7 days
          }
        }
      },
      {
        urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-image-assets",
          expiration: {
            maxEntries: 64,
            maxAgeSeconds: 24 * 60 * 60
            // 24 hours
          }
        }
      },
      {
        urlPattern: /\/_next\/image\?url=.+$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "next-image",
          expiration: {
            maxEntries: 64,
            maxAgeSeconds: 24 * 60 * 60
            // 24 hours
          }
        }
      },
      {
        urlPattern: /\.(?:mp3|wav|ogg)$/i,
        handler: "CacheFirst",
        options: {
          rangeRequests: true,
          cacheName: "static-audio-assets",
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60
            // 24 hours
          }
        }
      },
      {
        urlPattern: /\.(?:mp4)$/i,
        handler: "CacheFirst",
        options: {
          rangeRequests: true,
          cacheName: "static-video-assets",
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60
            // 24 hours
          }
        }
      },
      {
        urlPattern: /\.(?:js)$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-js-assets",
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60
            // 24 hours
          }
        }
      },
      {
        urlPattern: /\.(?:css|less)$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-style-assets",
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60
            // 24 hours
          }
        }
      },
      {
        urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "next-data",
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60
            // 24 hours
          }
        }
      },
      {
        urlPattern: /\.(?:json|xml|csv)$/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "static-data-assets",
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60
            // 24 hours
          }
        }
      },
      {
        urlPattern: ({ url }) => {
          const isSameOrigin = self.origin === url.origin;
          if (!isSameOrigin) return false;
          const pathname = url.pathname;
          if (pathname.startsWith("/api/auth/")) return false;
          if (pathname.startsWith("/api/")) return true;
          return false;
        },
        handler: "NetworkFirst",
        method: "GET",
        options: {
          cacheName: "apis",
          expiration: {
            maxEntries: 16,
            maxAgeSeconds: 24 * 60 * 60
            // 24 hours
          },
          networkTimeoutSeconds: 10
          // fall back to cache if api does not response within 10 seconds
        }
      },
      {
        urlPattern: ({ url }) => {
          const isSameOrigin = self.origin === url.origin;
          if (!isSameOrigin) return false;
          const pathname = url.pathname;
          if (pathname.startsWith("/api/")) return false;
          return true;
        },
        handler: "NetworkFirst",
        options: {
          cacheName: "others",
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60
            // 24 hours
          },
          networkTimeoutSeconds: 10
        }
      },
      {
        urlPattern: ({ url }) => {
          const isSameOrigin = self.origin === url.origin;
          return !isSameOrigin;
        },
        handler: "NetworkFirst",
        options: {
          cacheName: "cross-origin",
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 60 * 60
            // 1 hour
          },
          networkTimeoutSeconds: 10
        }
      }
    ];
  }
});

// build-custom-worker.js
var require_build_custom_worker = __commonJS({
  "build-custom-worker.js"(exports, module) {
    "use strict";
    var path = __require("path");
    var fs = __require("fs");
    var webpack = __require("webpack");
    var { CleanWebpackPlugin } = __require("clean-webpack-plugin");
    var TerserPlugin = __require("terser-webpack-plugin");
    var buildCustomWorker = ({ id, basedir, customWorkerDir, destdir, plugins, minify }) => {
      let workerDir = void 0;
      if (fs.existsSync(path.join(basedir, customWorkerDir))) {
        workerDir = path.join(basedir, customWorkerDir);
      } else if (fs.existsSync(path.join(basedir, "src", customWorkerDir))) {
        workerDir = path.join(basedir, "src", customWorkerDir);
      }
      if (!workerDir) return;
      const name = `worker-${id}.js`;
      const customWorkerEntries = ["ts", "js"].map((ext) => path.join(workerDir, `index.${ext}`)).filter((entry) => fs.existsSync(entry));
      if (customWorkerEntries.length === 0) return;
      if (customWorkerEntries.length > 1) {
        console.warn(
          `> [PWA] WARNING: More than one custom worker found (${customWorkerEntries.join(
            ","
          )}), not building a custom worker`
        );
        return;
      }
      const customWorkerEntry = customWorkerEntries[0];
      console.log(`> [PWA] Custom worker found: ${customWorkerEntry}`);
      console.log(`> [PWA] Build custom worker: ${path.join(destdir, name)}`);
      webpack({
        mode: "none",
        target: "webworker",
        entry: {
          main: customWorkerEntry
        },
        resolve: {
          extensions: [".ts", ".js"],
          fallback: {
            module: false,
            dgram: false,
            dns: false,
            path: false,
            fs: false,
            os: false,
            crypto: false,
            stream: false,
            http2: false,
            net: false,
            tls: false,
            zlib: false,
            child_process: false
          }
        },
        module: {
          rules: [
            {
              test: /\.(t|j)s$/i,
              use: [
                {
                  loader: "babel-loader",
                  options: {
                    presets: [
                      [
                        "next/babel",
                        {
                          "transform-runtime": {
                            corejs: false,
                            helpers: true,
                            regenerator: false,
                            useESModules: true
                          },
                          "preset-env": {
                            modules: false,
                            targets: "chrome >= 56"
                          }
                        }
                      ]
                    ]
                  }
                }
              ]
            }
          ]
        },
        output: {
          path: destdir,
          filename: name
        },
        plugins: [
          new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [path.join(destdir, "worker-*.js"), path.join(destdir, "worker-*.js.map")]
          })
        ].concat(plugins),
        optimization: minify ? {
          minimize: true,
          minimizer: [new TerserPlugin()]
        } : void 0
      }).run((error, status) => {
        if (error || status.hasErrors()) {
          console.error(`> [PWA] Failed to build custom worker`);
          console.error(status.toString({ colors: true }));
          process.exit(-1);
        }
      });
      return name;
    };
    module.exports = buildCustomWorker;
  }
});

// build-fallback-worker.js
var require_build_fallback_worker = __commonJS({
  "build-fallback-worker.js"(exports, module) {
    "use strict";
    var path = __require("path");
    var fs = __require("fs");
    var webpack = __require("webpack");
    var { CleanWebpackPlugin } = __require("clean-webpack-plugin");
    var TerserPlugin = __require("terser-webpack-plugin");
    var getFallbackEnvs = ({ fallbacks, basedir, id, pageExtensions }) => {
      let { document, data } = fallbacks;
      if (!document) {
        let pagesDir = void 0;
        if (fs.existsSync(path.join(basedir, "pages"))) {
          pagesDir = path.join(basedir, "pages");
        } else if (fs.existsSync(path.join(basedir, "src", "pages"))) {
          pagesDir = path.join(basedir, "src", "pages");
        }
        if (!pagesDir) return;
        const offlines = pageExtensions.map((ext) => path.join(pagesDir, `_offline.${ext}`)).filter((entry) => fs.existsSync(entry));
        if (offlines.length === 1) {
          document = "/_offline";
        }
      }
      if (data && data.endsWith(".json")) {
        data = path.posix.join("/_next/data", id, data);
      }
      const envs = {
        __PWA_FALLBACK_DOCUMENT__: document || false,
        __PWA_FALLBACK_IMAGE__: fallbacks.image || false,
        __PWA_FALLBACK_AUDIO__: fallbacks.audio || false,
        __PWA_FALLBACK_VIDEO__: fallbacks.video || false,
        __PWA_FALLBACK_FONT__: fallbacks.font || false,
        __PWA_FALLBACK_DATA__: data || false
      };
      if (Object.values(envs).filter((v) => !!v).length === 0) return;
      console.log("> [PWA] Fallback to precache routes when fetch failed from cache or network:");
      if (envs.__PWA_FALLBACK_DOCUMENT__) console.log(`> [PWA]   document (page): ${envs.__PWA_FALLBACK_DOCUMENT__}`);
      if (envs.__PWA_FALLBACK_IMAGE__) console.log(`> [PWA]   image: ${envs.__PWA_FALLBACK_IMAGE__}`);
      if (envs.__PWA_FALLBACK_AUDIO__) console.log(`> [PWA]   audio: ${envs.__PWA_FALLBACK_AUDIO__}`);
      if (envs.__PWA_FALLBACK_VIDEO__) console.log(`> [PWA]   video: ${envs.__PWA_FALLBACK_VIDEO__}`);
      if (envs.__PWA_FALLBACK_FONT__) console.log(`> [PWA]   font: ${envs.__PWA_FALLBACK_FONT__}`);
      if (envs.__PWA_FALLBACK_DATA__) console.log(`> [PWA]   data (/_next/data/**/*.json): ${envs.__PWA_FALLBACK_DATA__}`);
      return envs;
    };
    var buildFallbackWorker = ({ id, fallbacks, basedir, destdir, minify, pageExtensions }) => {
      const envs = getFallbackEnvs({ fallbacks, basedir, id, pageExtensions });
      if (!envs) return;
      const name = `fallback-${id}.js`;
      const fallbackJs = path.join(__dirname, `fallback.js`);
      webpack({
        mode: "none",
        target: "webworker",
        entry: {
          main: fallbackJs
        },
        resolve: {
          extensions: [".js"],
          fallback: {
            module: false,
            dgram: false,
            dns: false,
            path: false,
            fs: false,
            os: false,
            crypto: false,
            stream: false,
            http2: false,
            net: false,
            tls: false,
            zlib: false,
            child_process: false
          }
        },
        module: {
          rules: [
            {
              test: /\.js$/i,
              use: [
                {
                  loader: "babel-loader",
                  options: {
                    presets: [
                      [
                        "next/babel",
                        {
                          "transform-runtime": {
                            corejs: false,
                            helpers: true,
                            regenerator: false,
                            useESModules: true
                          },
                          "preset-env": {
                            modules: false,
                            targets: "chrome >= 56"
                          }
                        }
                      ]
                    ]
                  }
                }
              ]
            }
          ]
        },
        output: {
          path: destdir,
          filename: name
        },
        plugins: [
          new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [path.join(destdir, "fallback-*.js"), path.join(destdir, "fallback-*.js.map")]
          }),
          new webpack.EnvironmentPlugin(envs)
        ],
        optimization: minify ? {
          minimize: true,
          minimizer: [new TerserPlugin()]
        } : void 0
      }).run((error, status) => {
        if (error || status.hasErrors()) {
          console.error(`> [PWA] Failed to build fallback worker`);
          console.error(status.toString({ colors: true }));
          process.exit(-1);
        }
      });
      return { fallbacks, name, precaches: Object.values(envs).filter((v) => !!v) };
    };
    module.exports = buildFallbackWorker;
  }
});

// index.js
var require_index = __commonJS({
  "index.js"(exports, module) {
    var path = __require("path");
    var fs = __require("fs");
    var crypto = __require("crypto");
    var globbyModule;
    var CleanWebpackPlugin;
    var WorkboxPlugin;
    var defaultCache;
    var buildCustomWorker;
    var buildFallbackWorker;
    var getRevision = (file) => crypto.createHash("md5").update(fs.readFileSync(file)).digest("hex");
    function detectTurbopack() {
      return process.env.NEXT_TURBOPACK === "true" || process.env.__NEXT_TURBOPACK === "true" || process.argv.includes("--turbo");
    }
    function lazyLoadGlobby() {
      if (!globbyModule) {
        globbyModule = __require("globby");
      }
      return globbyModule;
    }
    module.exports = (pluginOptions = {}) => (nextConfig = {}) => {
      const isTurbopack = detectTurbopack();
      const {
        disable = false,
        register = true,
        dest,
        sw = "sw.js",
        cacheStartUrl = true,
        dynamicStartUrl = true,
        dynamicStartUrlRedirect,
        skipWaiting = true,
        clientsClaim = true,
        cleanupOutdatedCaches = true,
        additionalManifestEntries,
        ignoreURLParametersMatching = [],
        importScripts = [],
        publicExcludes = ["!noprecache/**/*"],
        buildExcludes = [],
        modifyURLPrefix = {},
        manifestTransforms = [],
        fallbacks = {},
        cacheOnFrontEndNav = false,
        reloadOnOnline = true,
        scope,
        customWorkerDir = "worker",
        subdomainPrefix,
        ...workbox
      } = pluginOptions;
      if (disable) {
        console.log("> [PWA] PWA support is disabled");
        return nextConfig;
      }
      if (subdomainPrefix) {
        console.error(
          "> [PWA] subdomainPrefix is deprecated, use basePath in next.config.js instead: https://nextjs.org/docs/api-reference/next.config.js/basepath"
        );
      }
      if (isTurbopack) {
        console.log("> [PWA] Turbopack detected - generating service worker with buildId");
        console.log("> [PWA] Note: Using Turbopack-compatible PWA service worker");
        const basePath = nextConfig.basePath || "/";
        const _sw = sw.startsWith("/") ? sw : `/${sw}`;
        const _scope = path.posix.join(scope || basePath, "/");
        return {
          ...nextConfig,
          webpack(config, options) {
            const { buildId, dir } = options;
            const _dest = path.join(dir, dest || ".next");
            const swContent = `// Turbopack PWA Service Worker - ${buildId}
const CACHE_NAME = 'pwa-${buildId}';
const START_URL = '${basePath}';
const SCOPE = '${_scope}';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        START_URL
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('pwa-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            if (event.request.method === 'GET') {
              cache.put(event.request, fetchResponse.clone());
            }
            return fetchResponse;
          });
        });
      }).catch(() => caches.match('/'))
    );
  }
});
`;
            const fs2 = __require("fs");
            const swPath = path.join(_dest, _sw.replace(/^\/+/, ""));
            const swDir = path.dirname(swPath);
            if (!fs2.existsSync(swDir)) {
              fs2.mkdirSync(swDir, { recursive: true });
            }
            fs2.writeFileSync(swPath, swContent);
            console.log(`> [PWA] Service worker generated: ${swPath}`);
            config.plugins.push(
              new (__require("webpack")).DefinePlugin({
                __PWA_SW__: `'${_sw}'`,
                __PWA_SCOPE__: `'${_scope}'`,
                __PWA_ENABLE_REGISTER__: `${Boolean(register)}`,
                __PWA_START_URL__: dynamicStartUrl ? `'${basePath}'` : void 0,
                __PWA_CACHE_ON_FRONT_END_NAV__: `${Boolean(cacheOnFrontEndNav)}`,
                __PWA_RELOAD_ON_ONLINE__: `${Boolean(reloadOnOnline)}`
              })
            );
            const registerJs = path.join(__dirname, "register.js");
            const entry = config.entry;
            config.entry = () => entry().then((entries) => {
              if (entries["main.js"] && !entries["main.js"].includes(registerJs)) {
                entries["main.js"].unshift(registerJs);
              }
              return entries;
            });
            return config;
          },
          async headers() {
            const baseHeaders = nextConfig.headers ? await nextConfig.headers() : [];
            return [
              ...Array.isArray(baseHeaders) ? baseHeaders : [],
              {
                source: "/:path*",
                headers: [
                  {
                    key: "Link",
                    value: `<${path.join(basePath, "manifest.json")}>; rel=manifest`
                  }
                ]
              }
            ];
          }
        };
      }
      try {
        const { CleanWebpackPlugin: CWP } = __require("clean-webpack-plugin");
        const { GenerateSW, InjectManifest } = __require("workbox-webpack-plugin");
        CleanWebpackPlugin = CWP;
        WorkboxPlugin = { GenerateSW, InjectManifest };
      } catch (e) {
        console.warn(
          "> [PWA] Warning: workbox-webpack-plugin not installed. Run: npm install workbox-webpack-plugin"
        );
        return nextConfig;
      }
      try {
        defaultCache = require_cache();
        buildCustomWorker = require_build_custom_worker();
        buildFallbackWorker = require_build_fallback_worker();
      } catch (e) {
        console.warn("> [PWA] Warning: Could not load helper modules:", e.message);
      }
      const globby = lazyLoadGlobby();
      return Object.assign({}, nextConfig, {
        webpack(config, options) {
          const {
            webpack,
            buildId,
            dev,
            config: {
              distDir = ".next",
              pageExtensions = ["tsx", "ts", "jsx", "js", "mdx"],
              experimental = {}
            }
          } = options;
          let basePath = options.config.basePath;
          if (!basePath) basePath = "/";
          if (typeof nextConfig.webpack === "function") {
            config = nextConfig.webpack(config, options);
          }
          if (disable) {
            options.isServer && console.log("> [PWA] PWA support is disabled");
            return config;
          }
          console.log(`> [PWA] Compile ${options.isServer ? "server" : "client (static)"}`);
          let { runtimeCaching = defaultCache } = pluginOptions;
          const _scope = path.posix.join(scope || basePath, "/");
          const _sw = path.posix.join(basePath, sw.startsWith("/") ? sw : `/${sw}`);
          config.plugins.push(
            new webpack.DefinePlugin({
              __PWA_SW__: `'${_sw}'`,
              __PWA_SCOPE__: `'${_scope}'`,
              __PWA_ENABLE_REGISTER__: `${Boolean(register)}`,
              __PWA_START_URL__: dynamicStartUrl ? `'${basePath}'` : void 0,
              __PWA_CACHE_ON_FRONT_END_NAV__: `${Boolean(cacheOnFrontEndNav)}`,
              __PWA_RELOAD_ON_ONLINE__: `${Boolean(reloadOnOnline)}`
            })
          );
          const registerJs = path.join(__dirname, "register.js");
          const entry = config.entry;
          config.entry = () => entry().then((entries) => {
            if (entries["main.js"] && !entries["main.js"].includes(registerJs)) {
              entries["main.js"].unshift(registerJs);
            }
            return entries;
          });
          if (!options.isServer) {
            const _dest = path.join(options.dir, dest || distDir);
            const customWorkerScriptName = buildCustomWorker({
              id: buildId,
              basedir: options.dir,
              customWorkerDir,
              destdir: _dest,
              plugins: config.plugins.filter((plugin) => plugin instanceof webpack.DefinePlugin),
              minify: !dev
            });
            if (!!customWorkerScriptName) {
              importScripts.unshift(customWorkerScriptName);
            }
            if (register) {
              console.log(`> [PWA] Auto register service worker with: ${path.resolve(registerJs)}`);
            } else {
              console.log(
                `> [PWA] Auto register service worker is disabled, please call following code in componentDidMount callback or useEffect hook`
              );
              console.log(`> [PWA]   window.workbox.register()`);
            }
            console.log(`> [PWA] Service worker: ${path.join(_dest, sw)}`);
            console.log(`> [PWA]   url: ${_sw}`);
            console.log(`> [PWA]   scope: ${_scope}`);
            config.plugins.push(
              new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: [
                  path.join(_dest, "workbox-*.js"),
                  path.join(_dest, "worker-*.js.LICENSE.txt"),
                  path.join(_dest, "workbox-*.js.map"),
                  path.join(_dest, sw),
                  path.join(_dest, `${sw}.map`)
                ]
              })
            );
            let manifestEntries = additionalManifestEntries;
            if (!Array.isArray(manifestEntries)) {
              manifestEntries = globby.sync(
                [
                  "**/*",
                  "!workbox-*.js",
                  "!workbox-*.js.map",
                  "!worker-*.js",
                  "!worker-*.js.map",
                  "!fallback-*.js",
                  "!fallback-*.js.map",
                  `!${sw.replace(/^\/+/, "")}`,
                  `!${sw.replace(/^\/+/, "")}.map`,
                  ...publicExcludes
                ],
                {
                  cwd: "public"
                }
              ).map((f) => ({
                url: path.posix.join(basePath, `/${f}`),
                revision: getRevision(`public/${f}`)
              }));
            }
            if (cacheStartUrl) {
              if (!dynamicStartUrl) {
                manifestEntries.push({
                  url: basePath,
                  revision: buildId
                });
              } else if (typeof dynamicStartUrlRedirect === "string" && dynamicStartUrlRedirect.length > 0) {
                manifestEntries.push({
                  url: dynamicStartUrlRedirect,
                  revision: buildId
                });
              }
            }
            let _fallbacks = fallbacks;
            if (_fallbacks) {
              const res = buildFallbackWorker({
                id: buildId,
                fallbacks,
                basedir: options.dir,
                destdir: _dest,
                minify: !dev,
                pageExtensions
              });
              if (res) {
                _fallbacks = res.fallbacks;
                importScripts.unshift(res.name);
                res.precaches.forEach((route) => {
                  if (!manifestEntries.find((entry2) => entry2.url.startsWith(route))) {
                    manifestEntries.push({
                      url: route,
                      revision: buildId
                    });
                  }
                });
              } else {
                _fallbacks = void 0;
              }
            }
            const workboxCommon = {
              swDest: path.join(_dest, sw),
              additionalManifestEntries: dev ? [] : manifestEntries,
              exclude: [
                ...buildExcludes,
                ({ asset, compilation }) => {
                  if (asset.name.startsWith("server/") || asset.name.match(/^(build-manifest\.json|react-loadable-manifest\.json)$/)) {
                    return true;
                  }
                  if (dev && !asset.name.startsWith("static/runtime/")) {
                    return true;
                  }
                  if (experimental.modern) {
                    if (asset.name.endsWith(".module.js")) {
                      return false;
                    }
                    if (asset.name.endsWith(".js")) {
                      return true;
                    }
                  }
                  return false;
                }
              ],
              modifyURLPrefix: {
                ...modifyURLPrefix,
                "/_next/../public/": "/"
              },
              manifestTransforms: [
                ...manifestTransforms,
                async (manifestEntries2, compilation) => {
                  const manifest = manifestEntries2.map((m) => {
                    m.url = m.url.replace("/_next//static/image", "/_next/static/image");
                    m.url = m.url.replace("/_next//static/media", "/_next/static/media");
                    if (m.revision === null) {
                      let key = m.url;
                      if (key.startsWith(config.output.publicPath)) {
                        key = m.url.substring(config.output.publicPath.length);
                      }
                      const assset = compilation.assetsInfo.get(key);
                      m.revision = assset ? assset.contenthash || buildId : buildId;
                    }
                    m.url = m.url.replace(/\[/g, "%5B").replace(/\]/g, "%5D");
                    return m;
                  });
                  return { manifest, warnings: [] };
                }
              ]
            };
            if (workbox.swSrc) {
              const swSrc = path.join(options.dir, workbox.swSrc);
              console.log(`> [PWA] Inject manifest in ${swSrc}`);
              config.plugins.push(
                new WorkboxPlugin.InjectManifest({
                  ...workboxCommon,
                  ...workbox,
                  swSrc
                })
              );
            } else {
              if (dev) {
                console.log(
                  "> [PWA] Build in develop mode, cache and precache are mostly disabled. This means offline support is disabled, but you can continue developing other functions in service worker."
                );
                ignoreURLParametersMatching.push(/ts/);
                runtimeCaching = [
                  {
                    urlPattern: /.*/i,
                    handler: "NetworkOnly",
                    options: {
                      cacheName: "dev"
                    }
                  }
                ];
              }
              if (dynamicStartUrl) {
                runtimeCaching.unshift({
                  urlPattern: basePath,
                  handler: "NetworkFirst",
                  options: {
                    cacheName: "start-url",
                    plugins: [
                      {
                        cacheWillUpdate: async ({ request, response, event, state }) => {
                          if (response && response.type === "opaqueredirect") {
                            return new Response(response.body, {
                              status: 200,
                              statusText: "OK",
                              headers: response.headers
                            });
                          }
                          return response;
                        }
                      }
                    ]
                  }
                });
              }
              if (_fallbacks) {
                runtimeCaching.forEach((c) => {
                  if (c.options.precacheFallback) return;
                  if (Array.isArray(c.options.plugins) && c.options.plugins.find((p) => "handlerDidError" in p))
                    return;
                  if (!c.options.plugins) c.options.plugins = [];
                  c.options.plugins.push({
                    handlerDidError: async ({ request }) => self.fallback(request)
                  });
                });
              }
              config.plugins.push(
                new WorkboxPlugin.GenerateSW({
                  ...workboxCommon,
                  skipWaiting,
                  clientsClaim,
                  cleanupOutdatedCaches,
                  ignoreURLParametersMatching,
                  importScripts,
                  ...workbox,
                  runtimeCaching
                })
              );
            }
          }
          return config;
        }
      });
    };
  }
});
export default require_index();
//# sourceMappingURL=index.mjs.map