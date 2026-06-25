import { copy } from "../copy/en";
import NavMenu from "../../components/NavMenu";
import UploadZone from "../../components/UploadZone";

export default function InvoicesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Reuse the shared site header so invoices matches the rest of the app. */}
      <NavMenu />
      <main id="main-content" className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-6">{copy.invoices.title}</h1>
        <p className="text-slate-400 mb-8">{copy.invoices.subtext}</p>
        <UploadZone />
      </main>
    </div>
  );
}
