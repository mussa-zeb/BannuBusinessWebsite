import { useEffect, useState } from "react";
import {
  Wallet,
  Banknote,
  Smartphone,
  TrendingUp,
  Clock,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";
import api from "../../api/api";

const formatPrice = (price) =>
  Number(price || 0).toLocaleString("en-PK");

const METHOD_LABEL = {
  cod: "Cash on Delivery",
  easypaisa: "EasyPaisa",
  jazzcash: "JazzCash",
};

const STATUS_STYLE = {
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  failed: "bg-red-50 text-red-700 border-red-200",
};

export default function SellerPayments() {
  const [payments, setPayments] = useState([]);
  const [totals, setTotals] = useState({
    totalEarned: 0,
    pending: 0,
    byMethod: { cod: 0, easypaisa: 0, jazzcash: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/orders/seller/payments");
        setPayments(res.data?.payments || []);
        setTotals(
          res.data?.totals || {
            totalEarned: 0,
            pending: 0,
            byMethod: { cod: 0, easypaisa: 0, jazzcash: 0 },
          }
        );
      } catch (e) {
        console.error("Failed to load seller payments:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered =
    filter === "all"
      ? payments
      : payments.filter((p) => p.paymentMethod === filter);

  return (
    <div className="pb-16 text-[var(--color-text-primary)]">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-[#111111] sm:text-3xl">
          Payments
        </h1>
        <p className="mt-1 text-xs text-[#6B7280]">
          Track your earnings and payment methods
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={TrendingUp}
          label="Total Earned"
          value={`Rs ${formatPrice(totals.totalEarned)}`}
        />
        <StatCard
          icon={Clock}
          label="Pending"
          value={`Rs ${formatPrice(totals.pending)}`}
        />
        <StatCard
          icon={CheckCircle2}
          label="Paid Orders"
          value={payments.filter((p) => p.paymentStatus === "paid").length}
        />
      </div>

      {/* METHOD BREAKDOWN */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <MethodCard
          icon={Banknote}
          label="Cash on Delivery"
          count={totals.byMethod.cod}
        />
        <MethodCard
          icon={Smartphone}
          label="EasyPaisa"
          count={totals.byMethod.easypaisa}
        />
        <MethodCard
          icon={Wallet}
          label="JazzCash"
          count={totals.byMethod.jazzcash}
        />
      </div>

      {/* FILTER CHIPS */}
      <div className="mb-6 flex flex-wrap gap-1.5 rounded-full border border-[#E5E7EB] bg-white p-1 shadow-sm w-fit">
        {["all", "cod", "easypaisa", "jazzcash"].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setFilter(m)}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
              filter === m
                ? "bg-[#111111] text-white shadow-sm"
                : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]"
            }`}
          >
            {m === "all" ? "All Methods" : METHOD_LABEL[m]}
          </button>
        ))}
      </div>

      {/* TABLE CONTAINER */}
      <div className="overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 py-12 text-xs font-bold text-[#6B7280]">
            <LoaderCircle size={24} className="animate-spin text-[#111111]" />
            <span>Loading payments...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <Wallet size={42} className="mx-auto text-[#9CA3AF]" />
            <p className="mt-4 text-sm font-bold text-[#111827]">No payments yet</p>
            <p className="mt-1 text-xs text-[#6B7280]">
              Customer payments will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E5E7EB] bg-[#F8F9FA] text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Mobile / TXN</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filtered.map((p) => (
                  <tr key={p._id} className="transition hover:bg-[#F8F9FA]">
                    <td className="px-6 py-4 font-mono font-bold text-[#111827]">
                      #{p._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#111827]">
                        {p.customer?.name || "Customer"}
                      </p>
                      <p className="text-[11px] text-[#6B7280]">
                        {p.customer?.email}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#111827]">
                      {METHOD_LABEL[p.paymentMethod]}
                    </td>
                    <td className="px-6 py-4 text-[#6B7280]">
                      {p.mobileAccount || "—"}
                      {p.transactionId && (
                        <>
                          <br />
                          <span className="font-mono text-[10px]">TXN: {p.transactionId}</span>
                        </>
                      )}
                    </td>
                    <td className="px-6 py-4 font-black text-[#111111]">
                      Rs {formatPrice(p.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-bold capitalize ${
                          STATUS_STYLE[p.paymentStatus] || STATUS_STYLE.pending
                        }`}
                      >
                        {p.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[16px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111111] text-white">
        <Icon size={18} />
      </div>
      <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
        {label}
      </p>
      <p className="mt-0.5 text-2xl font-black text-[#111827]">{value}</p>
    </div>
  );
}

function MethodCard({ icon: Icon, label, count }) {
  return (
    <div className="flex items-center gap-4 rounded-[16px] border border-[#E5E7EB] bg-white p-5 shadow-sm transition hover:border-[#111111]">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#111111] text-white">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-[#111827]">{label}</p>
        <p className="text-[11px] text-[#6B7280]">
          {count} order{count === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}