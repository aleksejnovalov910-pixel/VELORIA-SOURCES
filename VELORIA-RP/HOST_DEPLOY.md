# VELORIA RP — host deployment checklist

Use only the `veloria-deploy` artifact from a fully successful `VELORIA Build` workflow run.

## Expected RAGE:MP layout

The artifact root must contain:

- `conf.json`
- `packages/veloria/index.js`
- `packages/veloria/server/index.js`
- `client_packages/index.js`
- `client_packages/veloria/index.html`
- `client_packages/veloria/runtime/client/index.js`
- `database/`
- `scripts/`
- `package.json`
- `.env.example`

RAGE:MP loads server resources from folders inside `packages`, while client-side loading starts from `client_packages/index.js`.

## First deployment

1. Stop the RAGE:MP server on the host.
2. Back up the current server files and database.
3. Upload the contents of the `veloria-deploy` artifact into the RAGE:MP server root.
4. Copy `.env.example` to `.env`.
5. Fill in the real MySQL and Redis connection details. Do not leave `MYSQL_PASSWORD=change_me`.
6. Install production Node.js dependencies:

   `npm install --omit=dev`

7. Run the complete host validation:

   `npm run validate:host`

   This performs the environment/layout preflight, MySQL + Redis connectivity smoke test, and database migrations.

8. Start the RAGE:MP server only if `validate:host` finishes successfully.

## Network

VELORIA currently uses RAGE:MP port `22005`. The host/firewall must allow the RAGE:MP game port and the adjacent HTTP port used for client package delivery according to the host setup.

## First live smoke test

After startup verify:

- server process stays running without fatal MySQL/Redis errors;
- server appears/connects on port 22005;
- client package download completes;
- authorization CEF opens;
- a test account can authenticate;
- character selection loads;
- reconnect works after closing and reopening the client.

If any step fails, save the full server console log before restarting the server.
