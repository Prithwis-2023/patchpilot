"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { products, fmt, Product } from "./lib/data";

type CartItem = { p: Product; qty: number };

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.p.price * it.qty, 0),
    [items]
  );

  function addToCart(p: Product) {
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.p.id === p.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...prev, { p, qty: 1 }];
    });
    setCartOpen(true);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="flex items-center justify-between">
        <Link href="/" className="text-cyan-200 font-bold tracking-widest">
          NEONMART
        </Link>
        <button
          onClick={() => setCartOpen(true)}
          className="rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 font-semibold hover:bg-cyan-400/20 transition"
        >
          Cart ({items.reduce((n, it) => n + it.qty, 0)})
        </button>
      </header>

      <section className="mt-8">
        <h1 className="text-3xl font-bold">Featured</h1>
        <p className="mt-2 text-slate-300">
          Clean demo store. Real checkout bug lives in the flow.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 hover:border-cyan-300/30 transition"
            >
              <div className="h-40 rounded-xl bg-slate-950/50 border border-slate-700/40 grid place-items-center text-slate-500">
                {p.name}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="font-bold">{p.name}</div>
                  <div className="text-slate-300 text-sm">{p.desc}</div>
                </div>
                <div className="font-semibold">{fmt(p.price)}</div>
              </div>

              <button
                onClick={() => addToCart(p)}
                data-testid={p.id === "hoodie" ? "add-to-cart-hoodie" : undefined}
                className="mt-4 w-full rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-3 font-semibold hover:bg-cyan-400/20 transition"
              >
                Add to cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setCartOpen(false)}
          />
          <aside className="absolute right-0 top-0 h-full w-full max-w-md border-l border-slate-700/60 bg-[#070A13] p-6">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">Your cart</div>
              <button
                onClick={() => setCartOpen(false)}
                className="text-slate-300 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {items.length === 0 ? (
                <div className="text-slate-400">Cart is empty.</div>
              ) : (
                items.map((it) => (
                  <div
                    key={it.p.id}
                    className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-900/30 p-4"
                  >
                    <div>
                      <div className="font-semibold">{it.p.name}</div>
                      <div className="text-sm text-slate-400">
                        Qty: {it.qty}
                      </div>
                    </div>
                    <div className="font-semibold">{fmt(it.p.price * it.qty)}</div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 flex items-center justify-between text-slate-200">
              <span>Subtotal</span>
              <span className="font-semibold">{fmt(subtotal)}</span>
            </div>

            <Link
              href={`/checkout?subtotal=${subtotal}`}
              data-testid="go-to-checkout"
              className={`mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 font-semibold transition
                ${items.length ? "border border-cyan-300/30 bg-cyan-400/15 hover:bg-cyan-400/25" : "border border-slate-700/50 bg-slate-900/40 text-slate-500 pointer-events-none"}
              `}
            >
              Go to checkout
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}