import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import io from "socket.io-client";

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

function MetricCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="border border-gray-200 rounded p-4">
      <div className="text-sm text-gray-600">{label}</div>
      <div className={`text-3xl font-bold ${label == 'Success rate' ? 'text-green-500' : label == 'Failure rate' ? 'text-red-500' : 'text-black'}`}>{value}</div>
      {hint ? <div className="text-xs text-gray-500 mt-1">{hint}</div> : null}
    </div>
  );
}

export default function Metrics() {
    const { userID } = useAuth();

    const [metrics, setMetrics] = useState({
        totalExecutions: '',
        successRate: '',
        failureRate: '',
        avgLatency: '',
        P95Latency: '',
        queueDepth: '',
        queueWaitTime: '',
        executionsPerHour: '',
        completedExecutionsPerHour: '',
        failedExecutionsPerHour: ''
    });

    const fetchMetrics = async () => {
        try {
            const response = await fetch(`http://localhost:3000/rules/executions/metrics`, {
                method: "GET",
                credentials: "include"
            });
            
            const data = await response.json();
            console.log("Fetched metrics:", data.executionServiceResponse);
            if (response.ok) {
              
              const metrics = data.executionServiceResponse;

              setMetrics({
                  totalExecutions: metrics.total_executions,
                  successRate: metrics.success_rate,
                  failureRate: metrics.failure_rate,
                  avgLatency: metrics.average_latency,
                  P95Latency: metrics.P95_latency,
                  queueDepth: metrics.queue_depth,
                  queueWaitTime: metrics.queue_wait_time,
                  executionsPerHour: metrics.executions_per_hour,
                  completedExecutionsPerHour: metrics.completed_executions_per_hour,
                  failedExecutionsPerHour: metrics.failed_executions_per_hour
              });
            } else {
                console.error("Failed to fetch metrics");
            }
        } catch (error) {
            console.error("Error fetching metrics:", error);
        }
    };

    useEffect(() => {
        console.log("Metrics fetched...");
        fetchMetrics();

        const socket = io("http://localhost:4500");

        socket.emit("join", {
            userId: '11'
        });

        socket.on("execution_update", (data: any) => {
            console.log("Realtime update:", data);
            
            fetchMetrics();
        });

        return () => {
            socket.disconnect();
        };

    }, [userID]);

    return (
    <>
      <Card title="Metrics">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard label="Total executions" value={metrics.totalExecutions.toString()} />
            <MetricCard label="Success rate" value={`${Number(metrics.successRate).toFixed(2)}%`} />
            <MetricCard label="Failure rate" value={`${Number(metrics.failureRate).toFixed(2)}%`} />
            <MetricCard label="Total executions per hour" value={`${Math.floor(Number(metrics.executionsPerHour))}`} />
            <MetricCard label="Completed executions per hour" value={`${Math.floor(Number(metrics.completedExecutionsPerHour))}`} />
            <MetricCard label="Failed executions per hour" value={`${Math.floor(Number(metrics.failedExecutionsPerHour))}`} />
            <MetricCard label="Avg latency" value={`${Number(metrics.avgLatency).toFixed(2)} ms`} />
            <MetricCard label="P95 latency" value={`${Number(metrics.P95Latency).toFixed(2)} ms`} />
            <MetricCard label="Queue depth" value={metrics.queueDepth.toString()} />
            <MetricCard label="Avg queue wait time" value={`${Number(metrics.queueWaitTime).toFixed(2)} ms`} />
          </div>
      </Card>
    </>
  );
}