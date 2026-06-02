import React, { useEffect, useMemo, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "../../context/authContext";
 

function Card({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
    <section className="bg-white text-black shadow-[0px_0px_5px_0px_black] p-6 rounded">
        <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        {children}
    </section>
    );
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
    retries?: number;
    message?: string,
    error?: string,
};

type QueuesType = {
    [key: string]: (Execution[] | null)[][];
};

function toIdPart(input: string) {
    // Ensure we generate a valid DOM id segment
    return input.replace(/[^a-zA-Z0-9_-]/g, "_");
}


export default function Queues() {
    const [queues, setQueues] = useState<QueuesType>({});
    const [tableVisibility, setTableVisibility] = useState<Record<string, boolean>>({});
    const { userID } = useAuth();




    const normalizedQueues = useMemo(() => {
    return Object.fromEntries(
        Object.entries(queues).map(([key, value]) => [
            key,
            value?.flat(2).filter(Boolean) as Execution[] ?? []
        ])
    );
    }, [queues]);

    // Initialize visibility for newly fetched queues
    useEffect(() => {
        setTableVisibility((prev) => {
            const next = { ...prev };
            for (const queueName of Object.keys(normalizedQueues)) {
                if (next[queueName] === undefined) next[queueName] = false;
            }
            return next;
        });

    }, [normalizedQueues]);
    
    const toggleQueueTable = (queueName: string) => {
        setTableVisibility((prev) => ({
            ...prev,
            [queueName]: !(prev[queueName] ?? true),
        }));
    };

    useEffect(() => {
    console.log("Queues fetched...");
    fetchQueues();
    }, []);

    const fetchQueues = async () => {

        try {
        const response = await fetch(
            `http://localhost:3000/rules/executions/queues`,
            {
            method: "GET",
            credentials: "include",
            },
        );

        const data = await response.json();
        console.log("Fetched queues:", data.executionServiceResponse);
        if (response.ok) {
            setQueues(data.executionServiceResponse)
        } else {
            console.error("Failed to fetch queues");
        }
        } catch (error) {
        console.error("Error fetching queues:", error);
        }
    };

    useEffect(() => {
        const socket = io("http://localhost:4500");

        socket.on("execution_update", (data: any) => {
            console.log("Realtime update:", data);
            fetchQueues();
        });

        return () => {
            socket.disconnect();
        };
    }, [userID]);

    return (
    <Card title="Queues">
        <div className="overflow-x-auto space-y-8 max-h-100">
        {Object.entries(normalizedQueues).map(([queueName, jobs]) => (
            <div key={queueName}>

            <div
                className="flex items-center justify-between gap-3 m-4"
                aria-label={`${queueName} header`}
            >
                <h3 className="text-xl font-bold capitalize text-left">{queueName}, ({jobs.length})</h3>

                <button
                    type="button"
                    onClick={() => toggleQueueTable(queueName)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100"
                    aria-expanded={tableVisibility[queueName] ?? true}
                    aria-controls={`queue-table-${toIdPart(queueName)}`}
                    title={tableVisibility[queueName] ?? true ? "Hide table" : "Show table"}
                >
                    {(tableVisibility[queueName] ?? true) ? (
                        // arrow up
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="18 15 12 9 6 15" />
                        </svg>
                    ) : (
                        // arrow down
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    )}
                </button>
            </div>
            
            {(tableVisibility[queueName] ?? true) ? (
                <table
                    id={`queue-table-${toIdPart(queueName)}`}
                    className="w-full text-left border-collapse"
                >
                {queueName == 'DLQ' ? (
                    <>
                    <thead>
                        <tr>
                            <th className="p-2 text-center">Execution ID</th>
                            <th className="p-2 text-center">Payload</th>
                            <th className="p-2 text-center">Error</th>                          
                            <th className="p-2 text-center">Retries</th>
                            <th className="p-2 text-center">Queued at</th>
                        </tr>
                        </thead>

                        <tbody>
                        {jobs.length == 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center p-2 text-gray-500">
                                    no jobs queued
                                </td>

                            </tr>
                        )
                        : 
                        jobs.map((q: Execution) => (
                            <tr key={q.execution_id}>
                                <td className="p-1 text-center">
                                    {q.execution_id}
                                </td>
                                <td className="p-1 text-center">
                                {JSON.stringify(q.payload)}
                                </td>
                                <td className="p-1 text-center">
                                    {q.error}
                                </td>
                                <td className="p-1 text-center">
                                    {q.retries}
                                </td>
                                <td className="p-1 text-center">
                                    {q.queued_at}
                                </td>
                            </tr>
                        ))
                        }
                        
                        </tbody>
                        </>
                ) :
                (<>
                    <thead>
                    <tr>
                        <th className="p-2 text-center">Execution ID</th>
                        <th className="p-2 text-center">Payload</th>
                        <th className="p-2 text-center">Started at</th>
                        <th className="p-2 text-center">Finished at</th>
                    </tr>
                    </thead>

                    <tbody>
                    {jobs.length == 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center p-2 text-gray-500">
                                no jobs queued
                            </td>

                        </tr>
                    )
                    : 
                    jobs.map((q: Execution) => (
                        <tr key={q.execution_id}>
                            <td className="p-2 text-center">
                                {q.execution_id}
                            </td>
                            <td className="p-2 text-center">
                            {JSON.stringify(q.payload)}
                            </td>
                            <td className="p-2 text-center">
                                {q.started_at}
                            </td>
                            <td className="p-2 text-center">
                                {q.finished_at}
                            </td>

                        </tr>
                    ))
                    }
                    
                    </tbody>
                </>)}
                
            </table>
            ) : null}
            </div>
        ))}
        </div>


    </Card>
    );
}
