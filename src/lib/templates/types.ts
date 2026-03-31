export type BrandKey = "intact" | "belairdirect";
export type FormatKey = "social" | "banner" | "story" | "email";

export interface TextLayer {
  type: "text";
  id: string;
  content: string;
  x: number;
  y: number;
  fontSize: number;
  fontWeight: string;
  color: string;
  fontFamily: string;
  maxWidth?: number;
  lineHeight?: number;
}

export interface ImageLayer {
  type: "image";
  id: string;
  placeholder: string; // emoji or label for prototype
  src?: string; // actual image path
  x: number;
  y: number;
  width: number;
  height: number;
  bgColor?: string;
}

export const KNIGHT_ASSETS = [
  { id: "heart", src: "/assets/knight/Heart_01.png", label: "Chevalier coeur" },
  { id: "car-house", src: "/assets/knight/Hold_Car_02_Car_And_House.png", label: "Auto + Maison" },
  { id: "phone", src: "/assets/knight/Hold_Phone_01.png", label: "Chevalier téléphone" },
  { id: "proud", src: "/assets/knight/Proud_01.png", label: "Chevalier fier" },
  { id: "protect", src: "/assets/knight/Protect_Hand_01.png", label: "Main protectrice" },
  { id: "ready", src: "/assets/knight/Ready_Go_01.png", label: "Chevalier prêt!" },
  { id: "sit", src: "/assets/knight/Sit_01.png", label: "Chevalier assis" },
  { id: "house", src: "/assets/knight/Hold_House_01.png", label: "Chevalier maison" },
];

export interface CtaLayer {
  type: "cta";
  id: string;
  label: string;
  x: number;
  y: number;
  width?: number;
  bgColor: string;
  textColor: string;
  borderRadius: number;
  fontSize: number;
  fontFamily: string;
  borderColor?: string;
  borderWidth?: number;
}

export interface LogoLayer {
  type: "logo";
  id: string;
  text: string; // text-based logo for prototype
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
}

export type Layer = TextLayer | ImageLayer | CtaLayer | LogoLayer;

export interface Template {
  id: string;
  name: string;
  brand: BrandKey;
  format: FormatKey;
  width: number;
  height: number;
  backgroundColor: string;
  layers: Layer[];
}

export interface BrandTokens {
  backgroundColor: string;
  h1Color: string;
  h1Font: string;
  bodyColor: string;
  bodyFont: string;
  ctaBg: string;
  ctaText: string;
  ctaRadius: number;
  logoText: string;
  logoColor: string;
  logoFont: string;
  accentColor: string;
}

export const BRAND_TOKENS: Record<BrandKey, BrandTokens> = {
  intact: {
    backgroundColor: "#F7F2EA",
    h1Color: "#000000",
    h1Font: "Georgia, 'Times New Roman', serif",
    bodyColor: "#000000",
    bodyFont: "Inter, sans-serif",
    ctaBg: "#D11338",
    ctaText: "#FFFFFF",
    ctaRadius: 24,
    logoText: "[intact]",
    logoColor: "#D11338",
    logoFont: "Georgia, serif",
    accentColor: "#D11338",
  },
  belairdirect: {
    backgroundColor: "#C8102E",
    h1Color: "#FFFFFF",
    h1Font: "'Montserrat', 'Arial Black', sans-serif",
    bodyColor: "#FFFFFF",
    bodyFont: "'Roboto', 'Arial', sans-serif",
    ctaBg: "#0F68D8",
    ctaText: "#FFFFFF",
    ctaRadius: 24,
    logoText: "belairdirect.",
    logoColor: "#FFFFFF",
    logoFont: "'Montserrat', sans-serif",
    accentColor: "#0F68D8",
  },
};

export const FORMAT_DIMENSIONS: Record<FormatKey, { width: number; height: number; label: string }> = {
  social: { width: 1080, height: 1080, label: "Social (1080×1080)" },
  banner: { width: 728, height: 90, label: "Banner (728×90)" },
  story: { width: 1080, height: 1920, label: "Story (1080×1920)" },
  email: { width: 600, height: 200, label: "Email (600×200)" },
};
