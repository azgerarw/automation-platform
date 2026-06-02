import Button from "../Button";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { useSettings } from "../../context/userSettingsContext";

type Rule = {
    rule_id: string,
    user_id: string,
    rule: { actions: [], conditions: [], trigger: {} },
    event_type: string,
    active: boolean,
    created_at: string
};


export default function Config() {
    const { userID } = useAuth();
    const { alertsEnabled, setAlerts } = useSettings();
    const [rules, setRules] = useState<Rule[]>([]);
    const [selectedRuleId, setSelectedRuleId] = useState<string>("");
    const [selectedLimit, setSelectedLimit] = useState<string>("");

    const notify = (message?: string) => toast.custom(
    <div className="bg-white text-black p-4 rounded shadow-[0px_0px_5px_0px_green] w-auto h-auto flex flex-col items-center">
        <strong className="text-sm">{message}</strong>
    </div>
    );

    /* handlers */

    const handleSelectRule = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRuleId = e.target.value;
        setSelectedRuleId(selectedRuleId);
        console.log('Selected rule ID:', selectedRuleId);
    }

    const handleSelectLimit = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLimit = e.target.value;
        setSelectedLimit(selectedLimit);
        console.log('Selected retry limit:', selectedLimit);
    }

    const updateRetryPolicy = async () => {
        console.log('Updating retry policy:', selectedRuleId, selectedLimit);

        try {
            const response = await fetch("http://localhost:3000/rules/retryPolicy", {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    limit: selectedLimit,
                    rule_id: selectedRuleId,
                }),
                credentials: 'include'
            });

            await response.json();

            if (response.ok) {
                notify('Retry policy updated successfully');
                console.log('Retry policy updated successfully');
            } else {
                console.error('Failed to update retry policy');
            }

        } catch (error) {
            console.error('Error updating retry policy:', error);
        }
    }

    const toggleAlerts = async () => {
        if (alertsEnabled === null) return;

        const nextAlertStatus = !alertsEnabled;
        console.log('Toggled alerts');
        console.log('Next alert status:', nextAlertStatus);

        try {
            const response = await fetch("http://localhost:3000/users/alerts/toggle", {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    newAlert: nextAlertStatus,
                }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setAlerts(data.newStatus);
                notify('Alerts updated successfully');
                console.log('Alerts updated successfully', data.alertStatus);
                fetchAlertStatus();
            } else {
                console.error('Failed to enable alerts');
            }

        } catch (error) {
            console.error('Error enabling alerts:', error);
        }
    }

    const fetchRules = async () => {
        try {
            const res: Response = await fetch(`http://localhost:3000/rules/list/${userID}`, {
                method: 'GET',
                credentials: 'include'
            });
            
            if (res.ok) {
                const data = await res.json();
                console.log('Fetched rules:', data.ruleServiceResponse.rules[0][0]);
                setRules(data.ruleServiceResponse.rules[0][0] || []);
            } else {
                console.error('Failed to fetch rules');
            }
        } catch (err) {
            console.error('Error fetching rules:', err);
        }
    }

    const fetchAlertStatus = async () => {
        try {
            const res: Response = await fetch(`http://localhost:3000/users/alerts/fetchStatus`, {
                method: 'GET',
                credentials: 'include'
            });
            
            if (res.ok) {
                const data = await res.json();
                console.log('Fetched alert status:', data.alertStatus);
                setAlerts(data.alertStatus);
            } else {
                console.error('Failed to fetch alert status');
            }
        } catch (err) {
            console.error('Error fetching alert status:', err);
        }        
    }

    useEffect(() => {
        fetchRules();
        fetchAlertStatus();
    }, [userID]);

    return (
        <>  
            <Toaster position="top-center" reverseOrder={false} />
            <h2 className="text-2xl font-bold mb-6">Configuration</h2>

            <div className="flex flex-row gap-20 shadow-[0px_0px_5px_0px_black] p-6 rounded w-auto justify-center items-center">
                <div className="flex flex-col gap-2 justify-center items-center ">
                        <h3 className="font-bold mb-2">Retry Policy</h3>
                    <div className="flex flex-row gap-2">
                        {rules.length > 0 ? ( 
                        <select onChange={handleSelectRule} className="border border-black px-3 py-2 cursor-pointer">
                            <option>Select rule</option>
                            {rules.map((rule) => (
                                <option key={rule.rule_id} value={rule.rule_id}>
                                    {`Rule ${rule.event_type} - ${rule.active ? "Active" : "Inactive"}`}
                                </option>
                            ))}
                        </select>
                        ) : 
                        (
                            <p>No rules found.</p>
                        )}
                        
                        <select onChange={handleSelectLimit} className="border border-black px-3 py-2 cursor-pointer">
                            <option value={1}>1 retry</option>
                            <option value={3}>3 retries</option>
                            <option value={5}>5 retries</option>
                        </select>
                    
                    </div>
                    <Button onClick={updateRetryPolicy} className="w-full">
                        Update Retry Policy
                    </Button>
                </div>
                

                <div className="h-31 grow">
                    <h3 className="font-bold mb-8">Notifications</h3>
                    <button onClick={toggleAlerts} disabled={alertsEnabled === null} className={alertsEnabled == true ? "bg-red-600 hover:bg-red-500 text-white p-2 w-full h-10 cursor-pointer active:scale-95 transition-transform rounded-sm" : "bg-green-600 hover:bg-green-500 text-white p-2 w-full h-10 cursor-pointer active:scale-95 transition-transform rounded-sm"}>
                        {alertsEnabled ? "Disable Alerts" : "Enable Alerts"}
                    </button>
                </div>
            </div>
        </>
    )
}