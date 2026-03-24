import { Metadata } from "next";

export const baseMetadata: Metadata = {
  title: {
    default: "ビアログ - クラフトビール　評価",
    template: "%s | ビアログ - クラフトビール　評価",
  },
  description: "好きなビールを見つけましょう！",
  openGraph: {
    siteName: "ビアログ - クラフトビール　評価",
    type: "website",
  },
};