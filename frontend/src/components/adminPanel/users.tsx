import { useEffect, useState } from "react";
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

type User = {
    user_id: string;
    role?: string;
    username: string;
    email: string;
    active: boolean;
    alerts: boolean;
    created_at?: string;
};

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const { userID } = useAuth();

    const fetchUsers = async () => {
        try {
            const res: Response = await fetch(`http://localhost:3000/users/list`, {
                method: 'GET',
                credentials: 'include'
            });
            
            if (res.ok) {
                const data = await res.json();
                console.log('Fetched users:', data.userServiceResponse);
                setUsers(data.userServiceResponse || []);
            } else {
                console.error('Failed to fetch users');
            }
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    }

    useEffect(() => {
        if (!userID) return;
        fetchUsers();
    }, [userID]);
    return (
        <>
            <Card title="Users management">
                {users.length === 0 ? (
                    renderEmpty("No users found (or admin users endpoint not available yet).")
                    ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                            <th className="p-2 text-center">User ID</th>
                            <th className="p-2 text-center">Role</th>
                            <th className="p-2 text-center">Alerts</th>
                            <th className="p-2 text-center">Status</th>
                            <th className="p-2 text-center">Created</th>
                            <th className="p-2 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                            <tr key={u.user_id}>
                                <td className="p-2 text-center text-sm">{u.user_id}</td>
                                <td className="p-2 text-center text-sm text-gray-600">{u.role ?? "-"}</td>
                                <td className="p-2 text-center text-sm text-gray-600">
                                    <StatusBadge
                                    label={u.alerts ? "On" : "Off"}
                                    variant={u.alerts ? "green" : "red"}
                                    />
                                </td>
                                <td className="p-2 text-center">
                                <StatusBadge
                                    label={u.active ? "Active" : "Disabled"}
                                    variant={u.active ? "green" : "red"}
                                />
                                </td>
                                <td className="p-2 text-center text-sm text-gray-500">{u.created_at ? new Date(u.created_at).toLocaleString() : "-"}</td>
                                <td className="p-2 text-center">
                                <button
                                    className={
                                    u.active
                                        ? "bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm cursor-pointer"
                                        : "bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm cursor-pointer"
                                    }
                                >
                                    {u.active ? "Disable" : "Enable"}
                                </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    )}
            </Card>
        </>
    );
}