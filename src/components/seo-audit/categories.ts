import { FileText, ImageIcon, Layers, ScanSearch, Share2, Sparkles } from "lucide-react";
import type { AuditCategory } from "../../lib/seo-audit";

// The audit's check groups, in display order, with a short description.
export const CATEGORIES: Array<{ name: AuditCategory; icon: typeof ScanSearch; copy: string }> = [
  {
    name: "Keyphrase",
    icon: ScanSearch,
    copy: "Placement in your title, opening, slug, meta description and subheadings, plus density and spread.",
  },
  {
    name: "Readability",
    icon: FileText,
    copy: "Sentence and paragraph length, passive voice, transition words and repeated openings.",
  },
  {
    name: "Structure",
    icon: Layers,
    copy: "One H1, heading order, section length and the word count your content type needs.",
  },
  {
    name: "Content Quality",
    icon: Sparkles,
    copy: "Internal links, keyphrase anchors, dash punctuation, overused AI phrases and risk disclaimers.",
  },
  {
    name: "Images",
    icon: ImageIcon,
    copy: "Image count, missing alt text, vague descriptions and keyphrase use in alt text.",
  },
  {
    name: "Social Sharing",
    icon: Share2,
    copy: "Open Graph and X tags, whether the share image loads, and a preview of the shared link.",
  },
];
