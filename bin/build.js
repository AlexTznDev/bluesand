import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import { readdirSync } from 'fs';
import { createServer, request as httpRequest } from 'http';
import { join, sep } from 'path';

// Config output
const BUILD_DIRECTORY = 'dist';
const PRODUCTION = process.env.NODE_ENV === 'production';

// Config entrypoint files
const ENTRY_POINTS = ['src/index.js'];

// Config dev serving
const LIVE_RELOAD = !PRODUCTION;
const SERVE_PORT = 3000;
const ESBUILD_PORT = 3001;
const SERVE_ORIGIN = `http://localhost:${SERVE_PORT}`;

// Create context
const context = await esbuild.context({
  bundle: true,
  entryPoints: ENTRY_POINTS,
  outdir: BUILD_DIRECTORY,
  minify: PRODUCTION,
  sourcemap: !PRODUCTION,
  target: PRODUCTION ? 'es2019' : 'esnext',
  plugins: [sassPlugin()],
  inject: LIVE_RELOAD ? ['./bin/live-reload.js'] : undefined,
  define: {
    SERVE_ORIGIN: JSON.stringify(SERVE_ORIGIN),
  },
});

// Build files in prod
if (PRODUCTION) {
  await context.rebuild();
  context.dispose();
}

// Watch and serve files in dev
else {
  await context.watch();
  await context.serve({ servedir: BUILD_DIRECTORY, port: ESBUILD_PORT });

  // Proxy on SERVE_PORT that adds CORS headers to every response
  createServer((req, res) => {
    const options = {
      hostname: 'localhost',
      port: ESBUILD_PORT,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxy = httpRequest(options, (esbuildRes) => {
      res.writeHead(esbuildRes.statusCode, {
        ...esbuildRes.headers,
        'Access-Control-Allow-Origin': '*',
      });
      esbuildRes.pipe(res, { end: true });
    });

    req.pipe(proxy, { end: true });
  }).listen(SERVE_PORT);

  logServedFiles();
}

/**
 * Logs information about the files that are being served during local development.
 */
function logServedFiles() {
  /**
   * Recursively gets all files in a directory.
   * @param {string} dirPath
   * @returns {string[]} An array of file paths.
   */
  const getFiles = (dirPath) => {
    const files = readdirSync(dirPath, { withFileTypes: true }).map((dirent) => {
      const path = join(dirPath, dirent.name);
      return dirent.isDirectory() ? getFiles(path) : path;
    });

    return files.flat();
  };

  const files = getFiles(BUILD_DIRECTORY);

  const filesInfo = files
    .map((file) => {
      if (file.endsWith('.map')) return;

      // Normalize path and create file location
      const paths = file.split(sep);
      paths[0] = SERVE_ORIGIN;

      const location = paths.join('/');

      // Create import suggestion
      const tag = location.endsWith('.css')
        ? `<link href="${location}" rel="stylesheet" type="text/css"/>`
        : `<script defer src="${location}"></script>`;

      return {
        'File Location': location,
        'Import Suggestion': tag,
      };
    })
    .filter(Boolean);

  // eslint-disable-next-line no-console
  console.table(filesInfo);
}
