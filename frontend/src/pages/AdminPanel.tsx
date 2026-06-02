import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/authContext";
import Metrics from "../components/adminPanel/metrics";
import Users from "../components/adminPanel/users";
import Queues from "../components/adminPanel/queues";
import Logs from "../components/adminPanel/logs";
import Microservices from "../components/adminPanel/microservices";
import Retry from "../components/adminPanel/retry";
import Databases from "../components/adminPanel/dbs";

type ServiceConnection = {
  name: string;
  status: "connected" | "disconnected" | "unknown";
  lastCheckAt?: string;
  details?: string;
};


const notify = (message?: string) =>
  toast.custom(
    <div className="bg-white text-black p-4 rounded shadow-[0px_0px_5px_0px_green] w-auto h-auto flex flex-col items-center">
      <strong className="text-sm">{message}</strong>
    </div>
  );

function StatusBadge({
  label,
  variant,
}: {
  label: string;
  variant: "green" | "red" | "orange" | "gray";
}) {
  const className =
    variant === "green"
      ? "bg-green-600 text-white"
      : variant === "red"
        ? "bg-red-600 text-white"
        : variant === "orange"
          ? "bg-orange-500 text-white"
          : "bg-gray-200 text-black";

  return <span className={`inline-flex px-2 py-1 rounded text-xs ${className}`}>{label}</span>;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white text-black shadow-[0px_0px_5px_0px_black] p-6 rounded">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      {children}
    </section>
  );
}



export default function AdminPanel() {
    const { userID } = useAuth();

    const [loading, setLoading] = useState(false);
    

    const refresh = async () => {
        setLoading(true);
        try {
            window.location.reload();
        } catch (err) {
            console.error("Error refreshing data:", err);
            notify("Error refreshing data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    if (!userID) return;

    }, [userID]);

    

    return (
    <div className="bg-white text-black min-h-screen p-8">
        <Toaster position="top-center" reverseOrder={false} />

        <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold">Admin Panel</h1>
            <p className="text-gray-600">Metrics, users, queues, micro-services status, retry strategy & circuit breakers.</p>

            <div className="flex gap-3 mt-2">
            <button
                onClick={refresh}
                disabled={loading}
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded text-sm font-semibold cursor-pointer disabled:opacity-60"
            >
                {loading ? "Refreshing..." : "Refresh"}
            </button>
            </div>
        </div>

        {/* METRICS */}
        
        <Metrics />

        {/* USERS MANAGEMENT */}
        <Users />

        {/* QUEUES */}
        <Queues />

        {/* OBSERVABILITY */}
        <Logs />

        {/* MICRO-SERVICES CONNECTION STATUS */}
        <Microservices />

        {/* GLOBAL RETRY STRATEGY + CIRCUIT BREAKERS */}
        <Retry />

        {/* GLOBAL RETRY STRATEGY + CIRCUIT BREAKERS */}
        <Databases />

        </div>
    </div>
    );
}

