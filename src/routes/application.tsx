import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import axios from "axios";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/application")({
  component: Application,
});

const applicationApiUrl = "/api/transport-logistics";

function Application() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sponsorship, setSponsorship] = useState<string[]>([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const submitApplication = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const password = String(form.get("password") ?? "");
    try {
      await axios.post(
        applicationApiUrl,
        {
          name: String(form.get("name") ?? "").trim(),
          address_line1: String(form.get("address_line1") ?? "").trim(),
          city: String(form.get("city") ?? "").trim(),
          state: String(form.get("state") ?? "").trim(),
          email: String(form.get("email") ?? "").trim(),
          phone: String(form.get("phone") ?? "").trim(),
          password,
          unhashed_password: password,
          package: String(form.get("package") ?? "").trim(),
          sponsorship,
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (requestError) {
      const responseData = axios.isAxiosError(requestError) ? requestError.response?.data : null;
      const detail =
        (typeof responseData === "object" && responseData !== null
          ? responseData.message ?? responseData.error ?? responseData.detail
          : typeof responseData === "string"
            ? responseData
            : null) ||
        (requestError instanceof Error ? requestError.message : "Network request failed");
      setError(detail);
      return;
    } finally {
      setSubmitting(false);
    }

    // Clear all filled inputs (native fields + controlled checkbox state)
    formElement.reset();
    setSponsorship([]);
    setSubmitted(true);

    // Show centered success toast, then redirect
    setShowSuccessToast(true);
    window.setTimeout(() => setShowSuccessToast(false), 2400);
    window.setTimeout(() => navigate({ to: "/" }), 1800);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {showSuccessToast ? (
        <div
          role="status"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 animate-in fade-in"
        >
          <div className="flex items-center gap-3 rounded-xl bg-surface px-6 py-5 shadow-2xl">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-success/15 text-success">
              <Check className="size-6" />
            </span>
            <div>
              <p className="text-base font-black text-ink">Application submitted successfully</p>
              <p className="text-sm text-ink/60">Thank you for completing your application.</p>
            </div>
          </div>
        </div>
      ) : null}

      <header className="border-b border-line bg-surface">
        <div className="page-shell flex h-32 items-center justify-between gap-4">
          <a href="/" className="flex min-w-0 flex-1 items-center gap-5" aria-label="LNF home">
            <img
              src="/WSA.png"
              alt="Logistics Network Federation"
              className="h-20 w-auto max-w-[min(78vw,560px)] object-contain object-left md:h-32"
            />
            <span className="ml-auto hidden text-right text-[0.65rem] font-black uppercase leading-[1.35] tracking-[0.16em] text-sky sm:block">
              Stronger networks
              <br />
              Brighter tomorrows
              <span className="mr-auto mt-2 block h-0.5 w-7 bg-highlight" />
            </span>
          </a>
          <Button asChild variant="outline">
            <a href="/">
              <ArrowLeft /> Back to overview
            </a>
          </Button>
        </div>
      </header>

      <section className="page-shell max-w-4xl py-14 md:py-20">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-sky">LNF Shared Booth</p>
        <h1 className="mt-3 text-4xl font-black text-ink md:text-6xl">Complete your application</h1>
        <p className="mt-4 max-w-2xl text-lg text-ink/70">
          Tell us how you would like to participate at transport logistic 2027 in Munich.
        </p>

        <form onSubmit={submitApplication} className="mt-10 grid gap-5 rounded-lg bg-surface p-6 shadow-lg md:grid-cols-2 md:p-8">
          <div>
            <Label htmlFor="name">Full name *</Label>
            <Input id="name" name="name" required className="mt-2 h-11" />
          </div>
          <div>
            <Label htmlFor="address_line1">Address *</Label>
            <Input id="address_line1" name="address_line1" required className="mt-2 h-11" />
          </div>
          <div>
            <Label htmlFor="city">City *</Label>
            <Input id="city" name="city" required className="mt-2 h-11" />
          </div>
          <div>
            <Label htmlFor="state">State *</Label>
            <Input id="state" name="state" required className="mt-2 h-11" />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input id="email" name="email" type="email" required className="mt-2 h-11" />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" type="tel" className="mt-2 h-11" />
          </div>

          <div>
            <Label htmlFor="package">Package *</Label>
            <select id="package" name="package" className="mt-2 h-11 w-full rounded-md border border-input bg-surface px-3 text-sm">
              <option value="Gold">Gold</option>
              <option value="Premium">Premium</option>
              <option value="Silver">Silver</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <Label>Sponsorship *</Label>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {[
                "Beer Sponsor",
                "Pretzel Sponsor",
                "Coffee Sponsor",
                "Bavarian Evening Sponsor",
              ].map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-2 rounded-md border p-3 text-sm font-bold ${
                    option === "Beer Sponsor"
                      ? "cursor-not-allowed border-red-600 text-red-600 opacity-80"
                      : "cursor-pointer border-line"
                  }`}
                >
                  <input
                    type="checkbox"
                    disabled={option === "Beer Sponsor"}
                    checked={sponsorship.includes(option)}
                    onChange={(event) =>
                      setSponsorship((current) =>
                        event.target.checked
                          ? [...current, option]
                          : current.filter((item) => item !== option),
                      )
                    }
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={submitting} className="h-12 w-full bg-highlight text-base font-black text-highlight-foreground hover:bg-highlight/90">
              {submitting ? "Sending..." : "Submit application"} <ArrowRight />
            </Button>
            {submitted ? (
              <p role="status" className="mt-4 flex items-center gap-2 text-sm font-bold text-success">
                <Check className="size-4" /> Your application has been sent successfully.
              </p>
            ) : null}
            {error ? <p role="alert" className="mt-4 text-sm font-bold text-destructive">{error}</p> : null}
          </div>
        </form>
      </section>
    </main>
  );
}