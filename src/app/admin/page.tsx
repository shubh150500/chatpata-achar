"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  IndianRupee,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

type Analytics = {
  totalOrders: number;
  revenue: number;
  customers: number;
  avgOrderValue: number;
  bestSellers: { name: string; qty: number; revenue: number }[];
  monthlySales: { month: string; total: number }[];
  statusCounts: Record<string, number>;
};

export default function AdminDashboard() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  const cards = [
    {
      label: "Total Orders",
      value: data?.totalOrders ?? 0,
      icon: ShoppingCart,
      color: "from-brand-saffron to-brand-red",
    },
    {
      label: "Revenue",
      value: data ? formatINR(data.revenue) : "—",
      icon: IndianRupee,
      color: "from-green-500 to-emerald-700",
    },
    {
      label: "Customers",
      value: data?.customers ?? 0,
      icon: Users,
      color: "from-blue-500 to-indigo-700",
    },
    {
      label: "Avg Order",
      value: data ? formatINR(data.avgOrderValue) : "—",
      icon: TrendingUp,
      color: "from-purple-500 to-fuchsia-700",
    },
  ];

  const maxMonth = Math.max(1, ...(data?.monthlySales.map((m) => m.total) ?? [1]));

  return (
    <div className="p-5 lg:p-8">
      <h1 className="font-display text-3xl font-bold text-brand-cream">
        Dashboard
      </h1>
      <p className="text-brand-cream/50">Welcome back, Admin 👋</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl glass p-5"
          >
            <div
              className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${c.color}`}
            >
              <c.icon className="h-5 w-5 text-white" />
            </div>
            <p className="mt-4 font-display text-2xl font-bold text-brand-cream">
              {c.value}
            </p>
            <p className="text-xs text-brand-cream/50">{c.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Monthly sales */}
        <div className="rounded-2xl glass p-6">
          <h3 className="font-display text-lg font-bold text-brand-cream">
            Monthly Sales
          </h3>
          <div className="mt-6 flex h-48 items-end gap-3">
            {data?.monthlySales.length ? (
              data.monthlySales.map((m) => (
                <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-full w-full items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(m.total / maxMonth) * 100}%` }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-brand-red to-brand-saffron"
                    />
                  </div>
                  <span className="text-[10px] text-brand-cream/50">
                    {m.month.slice(5)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-brand-cream/40">No sales data yet.</p>
            )}
          </div>
        </div>

        {/* Best sellers */}
        <div className="rounded-2xl glass p-6">
          <h3 className="font-display text-lg font-bold text-brand-cream">
            Best Selling Products
          </h3>
          <div className="mt-5 space-y-3">
            {data?.bestSellers.length ? (
              data.bestSellers.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-sm font-bold text-brand-mustard">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-brand-cream">{p.name}</p>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-saffron to-brand-red"
                        style={{
                          width: `${
                            (p.qty / (data.bestSellers[0]?.qty || 1)) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-brand-cream/70">
                    {p.qty} sold
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-brand-cream/40">No orders yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
