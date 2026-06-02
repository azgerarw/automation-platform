import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../context/authContext";

type Event = {
    event_id: string,
    user_id: string,
    execution_id: string,
    correlation_id: string,
    event_type: string,
    payload: {},
    status: string,
    created_at: string
};

export default function Events() {
    const [events, setEvents] = useState<Event[]>([])

    const { userID } = useAuth();

    const fetchEvents = async () => {
        try {
            const res: Response = await fetch(`http://localhost:3000/rules/events/list`, {
                method: 'GET',
                credentials: 'include'
            });
            
            if (res.ok) {
                const data = await res.json();
                console.log('Fetched events:', data.webhookServiceResponse.events);
                setEvents(data.webhookServiceResponse.events || []);
            } else {
                console.error('Failed to fetch executions');
            }
        } catch (err) {
            console.error('Error fetching events:', err);
        }
    }

    useEffect(() => {
        if (!userID) return;

        console.log("Events loaded for user:", userID);

        fetchEvents();

        const socket = io("http://localhost:4500");

        socket.emit("join", {
            userId: userID
        });

        socket.on("event_update", (data: any) => {
            console.log("Realtime update:", data);
            fetchEvents();
        });

        return () => {
            socket.disconnect();
        };
    }, [userID]);

    return (
        <>
            <h2 className="text-2xl font-bold mb-6">Live events</h2>
            <p className="text-gray-600 text-sm">
                Listening for real-time events...
            </p>
            <div className="bg-white text-black w-full flex items-center justify-center py-10 ">
                
                {events.length > 0 ? (
                <div className="shadow-[0px_0px_5px_0px_black] p-6 rounded max-h-100 overflow-auto">
                    
                    <table className="w-full text-left border-collapse  ">
                                
                        <thead>
                            <tr className="">
                                <th className="p-2 text-center">ID</th>
                                <th className="p-2 text-center">Correlation ID</th>
                                <th className="p-2 text-center">Event Type</th>
                                <th className="p-2 text-center">Payload</th>
                                <th className="p-2 text-center">Status</th>
                                <th className="p-2 text-center">Received at</th>
                            </tr>
                        </thead>
    
                        <tbody> 
                        {[...events].reverse().map((e) => (
                            <tr key={e.event_id} className=" p-5 ">
                                <td className="p-2 text-center text-sm">{e.event_id}</td>
                                <td className="p-2 text-center text-sm">{e.correlation_id}</td>
                                <td className="p-2 text-center text-sm">{e.event_type}</td>
                                <td className="p-2 text-center text-sm">
                                    {(Object.keys(e.payload) as Array<keyof typeof e.payload>).map(key => {
                                        const value = e.payload[key];
                                        return (
                                            <span key={key} className="bg-gray-200 px-2 py-1 rounded mr-1">
                                                {JSON.stringify(value)}
                                            </span>
                                        );
                                    })}
                                </td>
                                <td className={e.status == 'processed' ? "p-2 text-center text-sm text-green-400" : "p-2 text-center text-sm text-red-500"}>{e.status}</td>
                                <td className="p-2 text-center text-sm text-gray-400">{new Date(e.created_at).toLocaleString()}</td> 
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                ) :
                (
                    <p className="text-bold">No events found.</p>
                )}
            </div>
        </>
    )
}