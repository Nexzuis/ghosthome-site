# Ghosthome Starter v1.3

## How to use
1. Extract this zip **into your project folder** (ghosthome-site), allowing it to create/replace files.
2. Open a terminal in the project and run:
   ```bash
   npm i
   npm run test
   npm run dev
   ```
3. Open the local URL (usually http://localhost:5173).

## Where to add images
- Put your photos under:
  - `public/images/installs/`
  - `public/images/products/`
- Reference in code with absolute paths: `/images/installs/my-photo.webp`

## Colours
Adjust brand colours in `tailwind.config.cjs` under `extend.colors.brand`.