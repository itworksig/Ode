import { redirect } from "next/navigation";
import { getSiteConfig } from "@/lib/config";

export default function Root() {
  const { site } = getSiteConfig();
  redirect(`/${site.locale}`);
}
