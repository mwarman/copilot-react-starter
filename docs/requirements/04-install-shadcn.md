# Requirement: Install and Configure shadcn/ui

This document outlines the requirements and steps for integrating **shadcn/ui** as the common component framework in an existing Vite React TypeScript application.

---

## Description

Install and configure **shadcn/ui** into the Vite React TypeScript project. The **shadcn/ui** component library will be used to add common React components to the project as needed.

### Requirements

1. Initialize **shadcn/ui** and update the resulting `components.json` file as follows:

```
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/common/components",
    "utils": "@/common/utils/css",
    "ui": "@/common/components/ui",
    "lib": "@/common/utils",
    "hooks": "@/common/hooks"
  },
  "iconLibrary": "lucide"
}
```

2. Move the generated `lib/utils.ts` file to `src/common/css.ts` and update the exported function to an arrow function to match our project guidelines.

3. Pin the versions of all dependencies added to `package.json` and re-install to update the lock file.

---

## Notes for the engineer

It may be simpler to perform this step manually depending upon your setup. Since this project's directory structure requires modification of the `components.json` after initialization, it may not be a value-added activity using Copilot.
