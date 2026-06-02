import React, { useEffect, useState } from "react";
import Executions from "../dashboard/logs";
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

const renderEmpty = (label: string) => (
    <div className="text-sm text-gray-500">{label}</div>
);

type Event = {
    event_id: number,
    user_id: number,
    event_type: string,
    payload: {},
    status: string,
    execution_id: string
}

type Execution = {
    execution_id: string;
    user_id: number;
    payload: any;
    correlation_id: string;
    finished_at: string;
    last_event_at: string;
    status: string;
    started_at: string;
    queued_at: string;
    created_at: string;
};

export default function Logs() {
    const { userID } = useAuth();
    const [events, setEvents] = useState<Event[]>([])
    const [selectedExecution, setExecution] = useState<Execution>({
    execution_id: '',
    user_id: 0,
    payload: {},
    correlation_id: '',
    finished_at: '',
    last_event_at: '',
    status: '',
    started_at: '',
    queued_at: '',
    created_at: '',
    })
    const showTracing = async (id: string) => {
        try {
        const response = await fetch(
            `http://localhost:3000/rules/executions/byId/${id}`,
            {
            method: "GET",
            credentials: "include",
            },
        );

        const data = await response.json();

        if (response.ok) {
            setExecution(data.executionServiceResponse)
            
        } else {
            console.error("Failed to fetch events");
        }
        } catch (error) {
        console.error("Error fetching events:", error);
        }
    }

    const fetchEvents = async () => {
        try {
        const response = await fetch(
            `http://localhost:3000/rules/events/all`,
            {
            method: "GET",
            credentials: "include",
            },
        );

        const data = await response.json();
        console.log("Fetched events:", data.webhookServiceResponse);
        if (response.ok) {
            setEvents(data.webhookServiceResponse)
        } else {
            console.error("Failed to fetch events");
        }
        } catch (error) {
        console.error("Error fetching events:", error);
        }
    }

    useEffect(() => {
        console.log(selectedExecution)
    }, [selectedExecution])

    useEffect(() => {
        console.log('events fetched')
        fetchEvents()
    }, [])

    useEffect(() => {
        const socket = io("http://localhost:4500");

        socket.on("execution_update", (data: any) => {
            console.log("Realtime update:", data);
            fetchEvents();
        });

        return () => {
            socket.disconnect();
        };
    }, [userID]);

    return (
        <Card title="Observability">
            {events.length === 0  && Executions.length === 0 ? (
            renderEmpty("No recent observability items (or endpoint not available yet).")
            ) : (
            <div className="overflow-x-auto max-h-80 overflow-auto">
                <h2 className="text-left font-bold text-2xl">Events</h2>
                <table className="w-full text-left border-collapse">
                <thead>
                    <tr>
                    <th className="p-2 text-center">Event ID</th>
                    <th className="p-2 text-center">User ID</th>
                    <th className="p-2 text-center">Event type</th>
                    <th className="p-2 text-center">Payload</th>
                    <th className="p-2 text-center">Status</th>
                    <th className="p-2 text-center">Timeline</th>
                    </tr>
                </thead>
                <tbody>
                    {[...events].reverse().map((event) => {
                    return (
                        <>
                        <tr key={event.execution_id}>
                            <td className="p-2 text-center text-sm">{event.event_id}</td>
                            <td className="p-2 text-center text-sm text-gray-500">{event.user_id}</td>
                            <td className="p-2 text-center text-sm text-gray-500">{JSON.stringify(event.payload)}</td>
                            <td className="p-2 text-center text-sm text-gray-500">{event.event_type}</td>
                            <td className="p-2 text-center">
                                <StatusBadge label={event.status} variant={event.status == 'processed' ? "green" : "red"} />
                            </td>
                            <td className="p-2 text-center">
                                <button onClick={() => showTracing(event.execution_id)} className="bg-black text-white text-sm hover:bg-gray-700 cursor-pointer p-1 rounded">Check Tracing</button>
                            </td>
                        </tr>
                        {selectedExecution.execution_id == event.execution_id ? (
                            <tr>
                                <td className="text-left text-sm text-gray-600" colSpan={6}>
                                    <span className="p-1">Received at: {new Date(selectedExecution.created_at).toLocaleString()} -</span> 
                                    <span className="p-1">Queued at: {new Date(selectedExecution.queued_at).toLocaleString()} -</span>
                                    <span className="p-1">Execution started at: {new Date(selectedExecution.started_at).toLocaleString()} -</span>
                                    <span className="p-1">{selectedExecution.status == 'completed' ? `Completed at: ${new Date(selectedExecution.finished_at).toLocaleString()}` : `Failed at: ${new Date(selectedExecution.finished_at).toLocaleString()}`}</span>
                                </td>
                            </tr>
                        ) : ''}
                        </>
                    );
                    })}
                </tbody>
                </table>
            </div>

            
            )}
        </Card>
    )
}