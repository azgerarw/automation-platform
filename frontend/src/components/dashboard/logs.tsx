import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../context/authContext";
import { useSettings } from "../../context/userSettingsContext";
import toast, { Toaster } from "react-hot-toast";

type Execution = {
    execution_id: string,
    user_id: string,
    payload: { data: ''},
    correlation_id: string,
    status: string,
    created_at: string,
    finished_at: string,
    last_event_at: string,
    queued_at: string,
};

export default function Executions() {
    const [executions, setExecutions] = useState<Execution[]>([])

    const { userID } = useAuth();
    const { alertsEnabled } = useSettings();

    const notify = (message?: string) => toast.custom(
    <div className="bg-white text-black p-4 rounded shadow-[0px_0px_5px_0px_green] w-auto h-auto flex flex-col items-center">
        <strong className="text-sm">{message}</strong>
    </div>
    );

    const fetchExecutions = async () => {
        try {
            const res: Response = await fetch(`http://localhost:3000/rules/executions/list`, {
                method: 'GET',
                credentials: 'include'
            });
            
            if (res.ok) {
                const data = await res.json();
                console.log('Fetched executions:', data.executionServiceResponse.executions[0][0]);
                setExecutions(data.executionServiceResponse.executions[0][0] || []);
            } else {
                console.error('Failed to fetch executions');
            }
        } catch (err) {
            console.error('Error fetching executions:', err);
        }
    }

    useEffect(() => {
        if (!userID) return;

        console.log("Executions loaded for user:", userID);
        console.log("Alerts enabled from logs:", alertsEnabled);
        fetchExecutions();

        const socket = io("http://localhost:4500");

        socket.emit("join", {
            userId: userID
        });

        socket.on("execution_update", (data: any) => {
            console.log("Realtime update:", data);
            if (alertsEnabled == true) {
                notify(data.message);
            }
            fetchExecutions();
        });

        return () => {
            socket.disconnect();
        };
    }, [userID, alertsEnabled]);

    return (
        <>
            <h2 className="text-2xl font-bold mb-6">Observability</h2>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="bg-white text-black w-full flex items-center justify-center py-10">
                {executions.length > 0 ? (
                <div className="shadow-[0px_0px_5px_0px_black] p-6 rounded max-h-100 overflow-auto">
                    
                    <table className="w-full text-left border-collapse  overflow-auto">
                                
                        <thead>
                            <tr className="">
                                <th className="p-2 text-center">ID</th>
                                <th className="p-2 text-center">Correlation ID</th>
                                <th className="p-2 text-center">Status</th>
                                <th className="p-2 text-center">Started at</th>
                                <th className="p-2 text-center">Finished at</th>
                                <th className="p-2 text-center">Last event at</th>
                            </tr>
                        </thead>
    
                        <tbody> 
                        {[...executions].reverse().map((ex) => (
                            <tr key={ex.execution_id} className=" p-5 ">
                                <td className="p-2 text-center text-sm">{ex.execution_id}</td>
                                <td className="p-2 text-center text-sm">{ex.correlation_id}</td>
                                <td className={ex.status == 'completed' ? "p-2 text-center text-sm text-green-400" : "p-2 text-center text-sm text-red-500"}>{ex.status}</td>
                                <td className="p-2 text-center text-sm text-gray-400">{new Date(ex.created_at).toLocaleString()}</td> 
                                <td className="p-2 text-center text-sm text-gray-400">{new Date(ex.finished_at).toLocaleString()}</td>                              
                                <td className="p-2 text-center text-sm text-gray-400">{new Date(ex.last_event_at).toLocaleString()}</td>                                                            
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                ) :
                (
                    <p className="text-bold">No logs found.</p>
                )}
            </div>
        </>
    )
}