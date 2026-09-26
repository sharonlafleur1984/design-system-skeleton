# Decisions

**Last updated:** September 26, 2026

Newest first.

<details>
<summary><b>Sep 26, 2026:</b> Life Hub's Figma library doesn't change</summary>

- **Decided by:** Sharon
- **Decision:** the Life Hub theme matches the Figma library exactly: all 112 colors including Sunflower Medley, every semantic mapping, spacing, radius, and all 16 text styles under their Figma names. A test checks this on every pull request.
- **Why:** the first version dropped Sunflower Medley and two text styles, renamed the text styles, and mapped one area accent wrong. The test caught the last one.

</details>

<details>
<summary><b>Sep 26, 2026:</b> Code is the source of truth for tokens</summary>

- **Decided by:** Sharon
- **Decision:** tokens live in code. Figma follows the code.
- **Why:** two of the three products are built in code, and After Graduation has no Figma file.
- **Other options:** Figma as the source, synced into code.

</details>

<details>
<summary><b>Sep 26, 2026:</b> One shared base, a theme for each product, in its own repo</summary>

- **Decided by:** Sharon
- **Decision:** a shared base (structure, naming, scales, status colors, accessibility) with a theme per product, in its own repo.
- **Why:** three products will use it (Life Hub, After Graduation, a designer toolkit), and Life Hub needs it soon. Life Hub's Figma library already had the structure Sharon wants.
- **Other options:** start inside After Graduation and move it later; separate systems per product.

</details>

<details>
<summary><b>Sep 26, 2026:</b> Structure taken from the Life Hub Library</summary>

- **Decided by:** Sharon
- **Decision:** the base copies the Life Hub Library's structure: a 4-point spacing scale, radius by purpose, ink, surface, border and accent names, one status set, and the type roles (display, heading, body, label, data).
- **Why:** it's already set up the way Sharon wants a design system organized. Only the look changes per product.

</details>
