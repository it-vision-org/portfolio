// Shared app-wide types.

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export type ActionOk<T = void> = Extract<ActionResult<T>, { success: true }>;

/** Fixed project buckets shown as tabs in the Projects section. */
export type ProjectCategory = "WEB" | "MOBILE" | "UIUX" | "GRAPHIC";

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  WEB: "Full-Stack Web",
  MOBILE: "Full-Stack Mobile",
  UIUX: "UI/UX Design",
  GRAPHIC: "Graphic Design",
};

/** Sub-sections inside the Graphic Design bucket, each rendered as an image slider. */
export type GraphicSection = "LOGO" | "APP_ICON" | "COVER" | "POST";

export const GRAPHIC_SECTION_LABELS: Record<GraphicSection, string> = {
  LOGO: "Logos",
  APP_ICON: "App Icons",
  COVER: "Cover Images",
  POST: "Posts",
};

/** Which colour theme a graphic item is shown in. */
export type ThemeVisibility = "BOTH" | "LIGHT" | "DARK";

export const THEME_VISIBILITY_LABELS: Record<ThemeVisibility, string> = {
  BOTH: "Both themes",
  LIGHT: "Light only",
  DARK: "Dark only",
};
