import { useEffect, useState } from "react";
import Button from "../Button";
import toast, { Toaster } from "react-hot-toast";

type ApiKey = {
    api_key_id: string;
    user_id: string;
    api_key: string;
    secret: string;
    created_at: string;
    usage: string;
};

export default function ApiKeys() {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

    const notify = (apiKey?: string, secret?: string, message?: string) => toast.custom(
    <div className="bg-white text-black p-4 rounded shadow-[0px_0px_5px_0px_green] w-auto h-auto flex flex-col items-start">
        <div>
            {apiKey}
        </div>
        <div>
            {secret}
        </div>
        <strong className="text-sm">{message}</strong>
    </div>
    );

    const fetchApiKeys = async () => {
    try {
        const res: Response = await fetch(`http://localhost:3000/apiKeys/list`, {
        method: "GET",
        credentials: "include",
        });

        if (res.ok) {
        const data = await res.json();
        console.log("Fetched api keys:", data?.authServiceResponse?.aKeys);
        setApiKeys(data?.authServiceResponse?.aKeys || []);
        } else {
        const text = await res.text().catch(() => "");
        console.error("Failed to fetch api keys", res.status, text);
        toast.error(`Failed to fetch api keys (HTTP ${res.status})`);
        }
    } catch (err) {
        console.error("Error fetching api keys:", err);
        toast.error("Error fetching api keys");
    }
    };

    const generateApiKey = async () => {
    try {
        const res: Response = await fetch("http://localhost:3000/apiKeys/generate", {
        method: "GET",
        credentials: "include",
        });

        if (res.ok) {
        const data: {
            message: string;
            authServiceResponse: { message: string; apiKey: string; secret: string };
        } = await res.json();

        console.log("api key generated", data);
        notify(
            `Your new API key:   ${data.authServiceResponse.apiKey}`, 
            `Secret:   ${data.authServiceResponse.secret}`, 
            'Please copy and store the secret securely. It will not be shown again.'
        );
        } else {
        const text = await res.text().catch(() => "");
        console.error("api key generation failed", res.status, text);
        toast.error(`API key generation failed (HTTP ${res.status})`);
        }

        fetchApiKeys();
    } catch (e) {
        console.error(e);
        toast.error("Error generating api key");
    }
    };

    const deleteApiKey = async (apiKeyId: string) => {
    try {
        const res: Response = await fetch(`http://localhost:3000/apiKeys/delete/${apiKeyId}`, {
        method: "GET",
        credentials: "include",
        });

        if (res.ok) {
        console.log("api key deleted");
        notify(undefined, undefined, "API key deleted successfully");
        fetchApiKeys();
        } else {
        const text = await res.text();
        console.error("Server error:", text);
        toast.error(`Failed to delete api key (HTTP ${res.status})`);
        }
    } catch (e) {
        console.error(e);
        toast.error("Error deleting api key");
    }
    };

    useEffect(() => {
    console.log("ApiKeys loaded");
    fetchApiKeys();
    }, []);

    return (
    <>
        <h2 className="text-2xl font-bold mb-6">API & Access</h2>

        <Button onClick={() => generateApiKey()} className="justify-self-start">
        Generate Api Key
        </Button>
        <Toaster position="top-center" reverseOrder={false} />

        <div className="bg-white text-black w-full flex items-center justify-center py-10">
        {apiKeys.length > 0 ? (
            <div className="shadow-[0px_0px_5px_0px_black] p-6 rounded ">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr>
                    <th className="p-2 text-center">ID</th>
                    <th className="p-2 text-center">Api Key</th>
                    <th className="p-2 text-center">Secret</th>
                    <th className="p-2 text-center">Created at</th>
                    <th className="p-2 text-center">Usage</th>
                    <th className="p-2 text-center">Delete</th>
                </tr>
                </thead>

                <tbody>
                {apiKeys.map((ap) => (
                    <tr key={ap.api_key_id} className=" p-5 ">
                    <td className="p-2 text-center text-sm">{ap.api_key_id}</td>
                    <td className="p-2 text-center text-sm">{ap.api_key}</td>
                    <td>
                        <div className="p-2 text-center overflow-ellipsis w-60 overflow-hidden whitespace-nowrap text-sm">
                        {ap.secret}
                        </div>
                    </td>
                    <td className="p-2 text-center text-sm text-gray-400">
                        {new Date(ap.created_at).toLocaleString()}
                    </td>
                    <td className="p-2 text-center text-sm">{ap.usage}</td>
                    <td className="p-2 text-center">
                        <button
                        onClick={() => deleteApiKey(ap.api_key_id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm cursor-pointer"
                        >
                        Delete
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        ) : (
            <p className="text-bold">No api keys generated.</p>
        )}
        </div>
    </>
    );
    }

