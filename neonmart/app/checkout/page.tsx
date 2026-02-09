"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fmt } from "../lib/data";

type Shipping = "standard" | "express";

export default function Checkout({
  searchParams,
}: {
  searchParams: { subtotal?: string };
}) {
  // BUG: In Next.js 15+, searchParams is a Promise for server components
  // Client components ("use client") cannot receive searchParams as props
  // This causes: "searchParams is a Promise and must be unwrapped"
  // Result: searchParams is undefined, so baseSubtotal = 0, subtotal displays $0.00
  // FIX: Use useSearchParams() hook from next/navigation for client components
  const baseSubtotal = Number(searchParams?.subtotal || 0);

  const [shipping, setShipping] = useState<Shipping>("standard");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address1: "",
  });

  const shippingCost = shipping === "standard" ? 0 : 12;
  const discount = couponApplied ? 10 : 0;

  const total = useMemo(() => Math.max(0, baseSubtotal + shippingCost - discount), [
    baseSubtotal,
    shippingCost,
    discount,
  ]);

  // BUGGY VALIDATION: missing important dependencies → stale disabled state after coupon + shipping switch
  const [isValid, setIsValid] = useState(false);
  useEffect(() => {
    const ok =
      form.name.trim().length > 1 &&
      form.email.includes("@") &&
      form.address1.trim().length > 5 &&
      baseSubtotal > 0 &&
      total > 0;

    setIsValid(Boolean(ok));
    // BUG: missing dependencies (shipping, couponApplied, discount, total changes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.name, form.email, form.address1, baseSubtotal]); // <- intentionally incomplete

  const status = couponApplied ? "Discount applied ✅" : "No coupon applied.";

  function applyCoupon() {
    const code = coupon.trim().toUpperCase();
    setCouponApplied(code === "SAVE10");
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="flex items-center justify-between">
        <Link href="/" className="text-cyan-200 font-bold tracking-widest">
          NEONMART
        </Link>
        <Link href="/" className="text-slate-300 hover:text-white underline">
          Back to store
        </Link>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Left: form */}
        <section className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-6">
          <h1 className="text-2xl font-bold">Checkout</h1>
          <p className="mt-2 text-slate-300">
            Repro bug: Fill form → Apply SAVE10 → Switch shipping → “Place order” stays disabled.
          </p>

          <div className="mt-6 grid gap-4">
            <Field label="Full name">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-slate-600/50 bg-slate-950/60 px-4 py-3 outline-none focus:border-cyan-300/50"
                placeholder="Jane Doe"
              />
            </Field>
            <Field label="Email">
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-slate-600/50 bg-slate-950/60 px-4 py-3 outline-none focus:border-cyan-300/50"
                placeholder="jane@neonmart.com"
              />
            </Field>
            <Field label="Address">
              <input
                value={form.address1}
                onChange={(e) => setForm({ ...form, address1: e.target.value })}
                className="w-full rounded-xl border border-slate-600/50 bg-slate-950/60 px-4 py-3 outline-none focus:border-cyan-300/50"
                placeholder="123 Cyber St, Seoul"
              />
            </Field>

            <div className="mt-2 rounded-2xl border border-slate-700/50 bg-slate-950/30 p-4">
              <div className="font-semibold">Shipping</div>
              <div className="mt-3 flex gap-3">
                <ShipPill active={shipping === "standard"} onClick={() => setShipping("standard")}>
                  Standard (Free)
                </ShipPill>
                <ShipPill active={shipping === "express"} onClick={() => setShipping("express")}>
                  Express (+{fmt(12)})
                </ShipPill>
              </div>
            </div>

            <div className="mt-2 rounded-2xl border border-slate-700/50 bg-slate-950/30 p-4">
              <div className="font-semibold">Coupon</div>
              <div className="mt-3 flex gap-3">
                <input
                  id="coupon"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-600/50 bg-slate-950/60 px-4 py-3 outline-none focus:border-cyan-300/50"
                  placeholder="SAVE10"
                />
                <button
                  id="applyCoupon"
                  type="button"
                  onClick={applyCoupon}
                  className="rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-5 py-3 font-semibold hover:bg-cyan-400/20 transition"
                >
                  Apply
                </button>
              </div>
              <div id="couponStatus" className="mt-2 text-slate-300">
                {status}
              </div>
            </div>
          </div>
        </section>

        {/* Right: summary */}
        <aside className="lg:sticky lg:top-6 h-fit rounded-2xl border border-slate-700/50 bg-slate-900/40 p-6" data-testid="order-summary">
          <div className="text-xl font-bold">Order summary</div>

          <div className="mt-5 space-y-2 text-slate-200">
            <Row label="Subtotal" value={<span data-testid="subtotal">{fmt(baseSubtotal)}</span>} />
            <Row label="Shipping" value={fmt(shippingCost)} />
            <Row label="Discount" value={`-${fmt(discount).slice(1)}`} />
            <div className="my-3 h-px bg-slate-700/60" />
            <Row label={<span className="font-bold">Total</span>} value={<span data-testid="total" className="font-bold">{fmt(total)}</span>} />
          </div>

          <button
            id="placeOrder"
            data-testid="place-order"
            type="button"
            disabled={!isValid}
            className={`mt-6 w-full rounded-xl px-4 py-4 font-semibold transition
              ${isValid
                ? "border border-lime-300/30 bg-lime-400/10 hover:bg-lime-400/20"
                : "border border-slate-700/60 bg-slate-950/30 text-slate-500 cursor-not-allowed"}
            `}
          >
            Place order
          </button>

          <div className="mt-3 text-sm text-slate-400">
            If disabled after switching shipping, you hit the bug.
          </div>
        </aside>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm text-slate-300">{label}</span>
      {children}
    </label>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-slate-300">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

function ShipPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-4 py-2 font-semibold transition border
        ${active
          ? "border-cyan-300/40 bg-cyan-400/15"
          : "border-slate-700/60 bg-slate-950/30 text-slate-300 hover:border-cyan-300/25"}
      `}
    >
      {children}
    </button>
  );
}
