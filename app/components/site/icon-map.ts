import {
  Code2,
  Smartphone,
  PenTool,
  Palette,
  Cpu,
  Bot,
  Globe,
  Server,
  Database,
  LayoutGrid,
  Video,
  Camera,
  Rocket,
  Sparkles,
  Layers,
  Brush,
  MonitorSmartphone,
  type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  Code2,
  Smartphone,
  PenTool,
  Palette,
  Cpu,
  Bot,
  Globe,
  Server,
  Database,
  LayoutGrid,
  Video,
  Camera,
  Rocket,
  Sparkles,
  Layers,
  Brush,
  MonitorSmartphone,
};

export const ICON_NAMES = Object.keys(ICONS);

export function resolveIcon(name: string): LucideIcon {
  return ICONS[name] ?? Code2;
}
