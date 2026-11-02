# The Triangle Explorer

A local web application for exploring integer triangles (combinatorial arrays), 
computing their traits, and looking up matching sequences in the OEIS.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v26 or later), this also installs `npm`.

You do **not** need to install TypeScript globally; it is included as a project 
dependency.

---

## Getting Started

### 1. Install dependencies

Open a terminal in `TableExplorer\src` and run:

```
npm install
```

This downloads all required packages into a local `node_modules` folder. You 
only need to do this once (or again after receiving an updated `package.json`).

### 2. Start the local server (recommended)

For OEIS lookup, use server mode:

- Windows: run `public\start-server.bat`
- macOS/Linux: run `./public/start-server.sh`
- Or run `npm run start:server`

This may also auto-open the html-file (Windows, depending on desktop setup). 
Otherwise (Linux/macOS script) open URL yourself.

### 3. Open the application (URL)

Open your browser and navigate to:

`http://localhost:3000/TableExplorer.html`

**Important:** Do **not** open `TableExplorer.html` via `file://`; this setup 
requires the local server and otherwise leads to connection errors.

### 4. Use the application

- Select a **Triangle** from the dropdown to preview its rows and formula.
- Select a **Trait**    to compute a derived integer sequence.
- Click    **Generate** to compute and display the sequence.
- Click    **Look Up**  to search the OEIS for the generated sequence.
- Click    **Clear**    to reset the results list.

---

## Development

### Building the browser bundle (if modifying TypeScript code)

The pre-built `table-explorer.bundle.js` file is already included in the repository, 
so **you do not need to rebuild it for normal use**.

However, if you modify any TypeScript source files (particularly `browser-api.ts` 
or its dependencies), you must rebuild the bundle:

```
npm run build
```

This uses **esbuild** to compile all TypeScript dependencies of `browser-api.ts` 
into a single file: `table-explorer.bundle.js`. 

Run this command again after making code changes and before testing them in 
the browser.
