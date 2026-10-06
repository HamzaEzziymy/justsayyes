import type { Metadata } from "next";
import { CreateWizard } from "./CreateWizard";

export const metadata: Metadata = { title: "Create Your Invitation — JustSayYes", alternates: { canonical: "/create" } };
export default function Page() { return <CreateWizard />; }
