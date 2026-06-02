import React, { useEffect, useMemo, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "../../context/authContext";

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

type Microservice = {
  service_name: string;
  status: "connected" | "disconnected" | "unknown";
  port?: number;

  cpu_usage?: number;
  memory_usage_mb?: number;
  rss?: number;

  uptime_seconds?: number;
  total_requests?: number;
  requests_per_min?: number;

  last_request_at?: string;
  last_heartbeat?: string;

  pid?: number;
  platform?: string;
  version?: string;
};

function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "connected" ? "bg-green-600" : status === "disconnected" ? "bg-red-600" : "bg-gray-200";
  const text = status === "unknown" ? "text-black" : "text-white";
  return (
    <span className={`inline-flex px-2 py-1 rounded text-xs ${variant} ${text}`}>
      {status}
    </span>
  );
}

function MetricRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border border-gray-100 rounded px-3 py-2">
      <div className="text-sm text-gray-600 font-medium">{label}</div>
      <div className="text-sm text-black text-right truncate">{value ?? "-"}</div>
    </div>
  );
}


function PaginationControls({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const canPrev = safePage > 1;
  const canNext = safePage < totalPages;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>
          Page <span className="font-semibold text-black">{safePage}</span> of{" "}
          <span className="font-semibold text-black">{totalPages}</span>
        </span>
        <span className="text-gray-400">•</span>
        <span>
          Showing <span className="font-semibold text-black">{Math.min(totalItems, safePage * pageSize)}</span> of{" "}
          <span className="font-semibold text-black">{totalItems}</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600 flex items-center gap-2">
          <span>Cards</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border border-gray-200 rounded px-2 py-1 bg-white text-black"
          >
            {[1, 2].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() => onPageChange(safePage - 1)}
          disabled={!canPrev}
          className="px-3 py-1 rounded border border-gray-200 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={() => onPageChange(safePage + 1)}
          disabled={!canNext}
          className="px-3 py-1 rounded border border-gray-200 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function Microservices() {
  const { userID } = useAuth();

  // Pagination: one card per service (per page defaults to 1 card)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);

  const [services, setServices] = useState<Microservice[]>([]);


  const onPageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const fetchServices = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/microservices",
        {
          credentials: "include",
        }
      );

      const data = await response.json();
      console.log('fetched services', data)
      if (response.ok) {
        setServices(data.services);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (!userID) return;

    // If you already have socket wiring for microservices elsewhere, you can hook it here.
    // Keeping a minimal structure to avoid breaking the app.
    const socket = io("http://localhost:4500");
    socket.on("execution_update", () => {
      fetchServices();
    });

    return () => {
      socket.disconnect();
    };
  }, [userID]);

  const pagedCards = useMemo(() => {
  const start = (currentPage - 1) * pageSize;
  return services.slice(start, start + pageSize);
  }, [services, currentPage, pageSize]);

  const totalItems = services.length;

  const renderEmpty = (label: string) => <div className="text-sm text-gray-500">{label}</div>;

  return (
    <Card title="Microservices">
      {totalItems === 0 ? (
        renderEmpty("No microservices data (or endpoint not available yet).")
      ) : (
        <>
          <div className={`
            grid gap-5
            ${
              pageSize === 1
                ? "grid-cols-1"
                : pageSize === 2
                ? "grid-cols-1 md:grid-cols-2"
                : pageSize <= 4
                ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
            }
          `}>
            {pagedCards.map((service) => (
              <article
                key={service.service_name}
                className="bg-white text-black rounded border border-gray-200 p-4 shadow-[0px_0px_5px_0px_rgba(0,0,0,0.03)]"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="text-lg font-bold capitalize">{service.service_name}</div>
                   
                  </div>
                  <StatusBadge status={service.status} />
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <MetricRow
                    label="Port"
                    value={service.port ? String(service.port) : '-'}
                  />

                  <MetricRow
                    label="CPU Usage"
                    value={String(service.cpu_usage ?? "-") + `%`}
                  />

                  <MetricRow
                    label="RAM Usage"
                    value={
                      service.memory_usage_mb
                        ? `${service.memory_usage_mb} MB`
                        : "-"
                    }
                  />

                  <MetricRow
                    label="RSS"
                    value={String(service.rss ?? "-")}
                  />

                  <MetricRow
                    label="Uptime"
                    value={
                      service.uptime_seconds
                        ? `${service.uptime_seconds}s`
                        : "-"
                    }
                  />

                  <MetricRow
                    label="Total Requests"
                    value={String(service.total_requests ?? "-")}
                  />

                  <MetricRow
                    label="Requests/min"
                    value={service.requests_per_min ? String(Math.floor(service.requests_per_min)) : '-'}
                  />

                  <MetricRow
                    label="Last Request"
                    value={service.last_request_at}
                  />

                  <MetricRow
                    label="Last Heartbeat"
                    value={service.last_heartbeat}
                  />

                  <MetricRow
                    label="PID"
                    value={String(service.pid ?? "-")}
                  />

                  <MetricRow
                    label="Platform"
                    value={service.platform}
                  />

                  <MetricRow
                    label="Version"
                    value={service.version}
                  />
                                  </div>
                                </article>
                              ))}
                            </div>

                            <PaginationControls
                              currentPage={currentPage}
                              pageSize={pageSize}
                              totalItems={totalItems}
                              onPageChange={(p) => setCurrentPage(p)}
                              onPageSizeChange={(s) => {
                                setPageSize(s);
                                setCurrentPage(1);
                              }}
                            />
        </>
      )}
    </Card>
  );
}

