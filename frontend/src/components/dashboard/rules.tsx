import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import Button from "../Button";
import toast, { Toaster } from "react-hot-toast";

type Rule = {
    rule_id: string,
    user_id: string,
    rule: { actions: [], conditions: [], trigger: {} },
    event_type: string,
    active: boolean,
    created_at: string
};

type Condition = {
  field: string;
  operator: string;
  value: string;
};

type Action = {
    type: string;
    config: { to?: '', webhook?: '', message?: ''}
};

export default function Rules() {
    const { userID } = useAuth();
    const [rules, setRules] = useState<Rule[]>([]);

    const notify = (message?: string) => toast.custom(
    <div className="bg-white text-black p-4 rounded shadow-[0px_0px_5px_0px_green] w-auto h-auto flex flex-col items-center">
        <strong className="text-sm">{message}</strong>
    </div>
    );

    // create form state
    const [createForm, setCFState] = useState(false);
    const [trigger_input, setTrigger] = useState<{ type: string, value: string }>({ type: "", value: "" });
    const [conditions_input, setConditions] = useState<Condition[]>([
    { field: "", operator: "", value: "" }
    ]);
    const [actions_input, setActions] = useState<Action[]>([        
        { type: '', config: {}}
    ]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    
    // Edit form state
    const [editForm, setEditFormState] = useState(false);
    const [editingRuleId, setEditingRuleId] = useState<string>("");
    const [editTrigger_input, setEditTrigger] = useState<{ type: string, value: string }>({ type: "", value: "" });
    const [editConditions_input, setEditConditions] = useState<Condition[]>([
        { field: "", operator: "", value: "" }
    ]);
    const [editActions_input, setEditActions] = useState<Action[]>([        
        { type: '', config: {}}
    ]);
    const [editError, setEditError] = useState<string>('');
    const [editLoading, setEditLoading] = useState(false);




    /* --------------------------------------------------- */


    /* helpers */



    /* conditions */
    const updateCondition = (
    i: number,
    key: keyof Condition,
    value: string
    ) => {
    const updated = [...conditions_input];
    updated[i][key] = value;
    setConditions(updated);
    console.log(conditions_input)
    console.log(trigger_input)
    };

    const removeCondition = (i: number) => {
        
        const updated = [...conditions_input];
        updated.splice(i, 1);
        setConditions(updated);
    };





    /*actions*/
    const updateAction = (i: number, key: keyof Action, value: string) => {
    const updated = [...actions_input];
    updated[i][key] = value;
    setActions(updated);
    };

    const updateActionConfig = (
    i: number,
    key: string,
    value: string
    ) => {
    const updated = [...actions_input];
    updated[i].config = {
        ...updated[i].config,
        [key]: value,
    };
    setActions(updated);
    };

    const removeAction = (i: number) => {
        const updated = [...actions_input];
        updated.splice(i, 1);
        setActions(updated);
    };

    /* edit form helpers */
    const updateEditCondition = (
        i: number,
        key: keyof Condition,
        value: string
    ) => {
        const updated = [...editConditions_input];
        updated[i][key] = value;
        setEditConditions(updated);
    };

    const removeEditCondition = (i: number) => {
        const updated = [...editConditions_input];
        updated.splice(i, 1);
        setEditConditions(updated);
    };

    const updateEditAction = (i: number, key: keyof Action, value: string) => {
        const updated = [...editActions_input];
        updated[i][key] = value;
        setEditActions(updated);
    };

    const updateEditActionConfig = (
        i: number,
        key: string,
        value: string
    ) => {
        const updated = [...editActions_input];
        updated[i].config = {
            ...updated[i].config,
            [key]: value,
        };
        setEditActions(updated);
    };

    const removeEditAction = (i: number) => {
        const updated = [...editActions_input];
        updated.splice(i, 1);
        setEditActions(updated);
    };



    
    /* --------------------------------------------------- */
    
    
    
    
    
    /*rules*/
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
    

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const rule = {
            trigger: trigger_input,
            conditions: conditions_input,
            actions: actions_input
        }
        try {
            console.log('Rule creation attempt:', { rule });
            const res: Response = await fetch('http://localhost:3000/rules/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userID, rule }),
            credentials: 'include'
            });
            
            console.log("FULL RESPONSE", res);
            const data: { error: string, ruleServiceResponse: { error: string, message: string, status: number } } = await res.json();
            if (data.ruleServiceResponse.status !== 201) {
                setError(`${data.ruleServiceResponse.error}. Please try again.`)
            }else {
                console.log(data.ruleServiceResponse.message)
                notify('Rule created successfully');
            }
            if (!res.ok) {
                throw new Error("Request failed");
            }
            fetchRules()
        }
        catch (err) {
        setError('An error occurred during rule creation. Please try again.');
        console.error('Error:', err);
        } finally {
        setLoading(false);
        }
    };


    const toggleStatus = async (ruleId: string, newStatus: boolean) => {

        try {
            const res = await fetch(`http://localhost:3000/rules/change-state`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rule_id: ruleId, state: newStatus }),
                credentials: 'include'
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("Server error:", text);
                throw new Error("Request failed");
            }

            const data = await res.json();
            
            console.log(data)
           
            
            const updatedRules = rules.map(rule =>
                rule.rule_id === ruleId
                    ? { ...rule, active: newStatus }
                    : rule
            );

            setRules(updatedRules);

            notify(`Rule ${newStatus ? 'activated' : 'deactivated'} successfully`);
        } catch (err) {
            console.error(err);
            toast.error(`Failed to ${newStatus ? 'activate' : 'deactivate'} rule`);
        }
    };


    const deleteRule = async (ruleId: string) => {
        try {
            const res: Response = await fetch(`http://localhost:3000/rules/delete/${ruleId}`, {
            method: 'GET',
            credentials: 'include'
            });

            if (res.ok) {
                console.log('rule deleted')
                fetchRules()
                notify('Rule deleted successfully');
            } else {
                const text = await res.text();
                console.error("Server error:", text);
                throw new Error("Request failed");
                toast.error('Failed to delete rule');
            }
        } catch(e) {
            console.log(e)
            toast.error('Failed to delete rule');
        }
    }

// Edit form handlers
    const handleEditClick = (rule: Rule) => {
        const ruleData = rule.rule as { trigger?: { type?: string; value?: string }; conditions?: Condition[]; actions?: Action[] };
        setEditingRuleId(rule.rule_id);
        setEditTrigger({ 
            type: ruleData.trigger?.type || "", 
            value: ruleData.trigger?.value || "" 
        });
        setEditConditions(ruleData.conditions || [{ field: "", operator: "", value: "" }]);
        setEditActions(ruleData.actions || [{ type: "", config: {} }]);
        setEditFormState(true);
    };

    const handleEditSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEditError('');
        setEditLoading(true);

        const rule = {
            trigger: editTrigger_input,
            conditions: editConditions_input,
            actions: editActions_input
        };

        try {
            console.log('Rule update attempt:', { rule_id: editingRuleId, rule });
            const res: Response = await fetch('http://localhost:3000/rules/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rule_id: editingRuleId, rule }),
                credentials: 'include'
            });

            console.log("FULL RESPONSE", res);
            const data: { error: string, ruleServiceResponse: { error: string, message: string, status: number } } = await res.json();

            if (data.ruleServiceResponse.status !== 200) {
                setEditError(`${data.ruleServiceResponse.error}. Please try again.`);
            } else {
                console.log(data.ruleServiceResponse.message);
                setEditFormState(false);
                notify('Rule updated successfully');
            }

            if (!res.ok) {
                throw new Error("Request failed");
            }
            fetchRules();
        } catch (err) {
            setEditError('An error occurred during rule update. Please try again.');
            console.error('Error:', err);
        } finally {
            setEditLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setEditFormState(false);
        setEditingRuleId("");
        setEditTrigger({ type: "", value: "" });
        setEditConditions([{ field: "", operator: "", value: "" }]);
        setEditActions([{ type: "", config: {} }]);
        setEditError("");
    };






    useEffect(() => {
        console.log("Rules loaded");

        fetchRules();
    }, []);

    return (
        <>
        <h2 className="text-2xl font-bold">Rule Management</h2>
        
        <Button className="justify-self-start" onClick={() => setCFState(!createForm)}>
            Create Rule
        </Button>
        
        <Toaster position="top-center" reverseOrder={false} />

        {/* create form */}
        <div className={`bg-white text-black w-full min-h-screen flex items-center justify-center py-20 ${createForm ? 'block' : 'hidden'}`}>
            <div className="w-auto">
                <div className="bg-white p-8 rounded shadow-[0px_0px_5px_0px_black]">
        
                {error && (
                    <div className="mb-6 p-4 bg-red-100 border-2 border-red-500 rounded text-red-700">
                    {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Trigger Input */}
                    <div >
                        <label htmlFor="trigger" className="block text-sm font-semibold mb-2">
                            Trigger
                        </label>
                        <div className="flex flex-row gap-2 justify-center">
                            <input
                                type="text"
                                placeholder="event.type"
                                value={trigger_input.type}
                                onChange={(e) =>
                                setTrigger({ ...trigger_input, type: e.target.value })
                                }
                                className="w-auto px-4 py-2 border-2 border-gray-400 rounded focus:outline-none focus:bg-gray-50 transition"
                            />

                            <input
                                type="text"
                                placeholder="value"
                                value={trigger_input.value}
                                onChange={(e) =>
                                setTrigger({ ...trigger_input, value: e.target.value })
                                }
                                className="w-auto px-4 py-2 border-2 border-gray-400 rounded focus:outline-none focus:bg-gray-50 transition"
                            />
                        </div>
                    </div>

                    {/* Conditions Input */}
                    <div>
                    <label htmlFor="conditions" className="block text-sm font-semibold mb-2">
                        Conditions
                    </label>
                    {conditions_input.map((cond, i) => (
                    <div key={i} className="flex flex-col gap-2 m-5 p-4 border rounded">
                        
                        <input
                        placeholder="field"
                        value={cond.field}
                        onChange={(e) => updateCondition(i, "field", e.target.value)}
                        className="w-auto px-4 py-2 border-2 border-gray-400 rounded focus:outline-none focus:bg-gray-50 transition"
                        />

                        <select
                        value={cond.operator}
                        onChange={(e) => updateCondition(i, "operator", e.target.value)}
                        className="w-auto px-4 py-2 border-2 border-gray-400 rounded focus:outline-none focus:bg-gray-50 transition"
                        >
                        <option value="eq">=</option>
                        <option value="gt">{'>'}</option>
                        <option value="lt">{'<'}</option>
                        </select>

                        <input
                        placeholder="value"
                        value={cond.value}
                        onChange={(e) => updateCondition(i, "value", e.target.value)}
                        className="w-auto px-4 py-2 border-2 border-gray-400 rounded focus:outline-none focus:bg-gray-50 transition"
                        />

                        <div className="flex gap-2">
                            {i > 0 && 
                            <span onClick={() => removeCondition(i)} className="bg-red-500 text-white px-2 py-1 rounded text-sm cursor-pointer">Remove</span>
                            }
                            <span onClick={() =>
                                        setConditions([...conditions_input, { field: "", operator: '', value: ''}])
                                    } className="bg-blue-500 text-white px-2 py-1 rounded text-sm cursor-pointer">+ Add condition</span>
                        </div>
                    </div>
                    ))}

                    </div>
        
                    {/* Actions Input */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Actions
                        </label>

                        {actions_input.map((action, i) => (
                            <div key={i} className="flex flex-col gap-2 m-5 p-4 border rounded">

                            {/* TYPE */}
                            <select
                                value={action.type}
                                onChange={(e) => updateAction(i, "type", e.target.value)}
                                className="px-4 py-2 border-2 border-gray-400 rounded"
                            >
                                <option value="">Select action</option>
                                <option value="email">Send Email</option>
                                <option value="discord">Send Discord</option>
                            </select>

                            {/* DYNAMIC CONFIG */}
                            {action.type === "email" && (
                                <input
                                placeholder="Recipient email"
                                onChange={(e) =>
                                    updateActionConfig(i, "to", e.target.value)
                                }
                                className="px-4 py-2 border-2 border-gray-400 rounded"
                                />
                            )}

                            {action.type === "discord" && (
                                <input
                                placeholder="Webhook URL"
                                onChange={(e) =>
                                    updateActionConfig(i, "webhook", e.target.value)
                                }
                                className="px-4 py-2 border-2 border-gray-400 rounded"
                                />
                            )}

                            {/* ACTION BUTTONS */}
                            <div className="flex gap-2">
                                {i > 0 && 
                                <span
                                onClick={() => removeAction(i)}
                                className="bg-red-500 text-white px-2 py-1 rounded text-sm cursor-pointer"
                                >
                                Remove
                                </span>}

                                <span
                                onClick={() =>
                                    setActions([...actions_input, { type: "", config: {} }])
                                }
                                className="bg-blue-500 text-white px-2 py-1 rounded text-sm cursor-pointer"
                                >
                                + Add action
                                </span>
                            </div>
                            </div>
                        ))}
                        </div>
                    
                    {/* Submit Button */}
                    <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white px-8 py-3 rounded font-semibold hover:bg-gray-800 active:scale-95 transition cursor-pointer"
                    >
                    {loading ? 'Creating rule...' : 'Create'}
                    </button>
                </form>
        
                </div>
                
            </div>
        </div>
        
        {/* edit form */}
        <div className={`absolute top-30 left-5 z-50 bg-white text-black w-80 p-4 rounded shadow-[0px_0px_5px_0px_black] ${editForm ? 'block' : 'hidden'}`}>
            <div className="bg-white p-4 rounded">
                {editError && (
                    <div className="mb-4 p-2 bg-red-100 border-2 border-red-500 rounded text-red-700 text-sm">
                        {editError}
                    </div>
                )}
                
                <form onSubmit={handleEditSubmit} className="space-y-4">
                    <h3 className="text-lg font-bold">Edit Rule</h3>
                    
                    {/* Trigger Input */}
                    <div>
                        <label className="block text-xs font-semibold mb-1">
                            Trigger
                        </label>
                        <div className="flex flex-row gap-1">
                            <input
                                type="text"
                                placeholder="event.type"
                                value={editTrigger_input.type}
                                onChange={(e) =>
                                setEditTrigger({ ...editTrigger_input, type: e.target.value })
                                }
                                className="w-1/2 px-2 py-1 border border-gray-400 rounded text-sm"
                            />

                            <input
                                type="text"
                                placeholder="value"
                                value={editTrigger_input.value}
                                onChange={(e) =>
                                setEditTrigger({ ...editTrigger_input, value: e.target.value })
                                }
                                className="w-1/2 px-2 py-1 border border-gray-400 rounded text-sm"
                            />
                        </div>
                    </div>

                    {/* Conditions Input */}
                    <div>
                        <label className="block text-xs font-semibold mb-1">
                            Conditions
                        </label>
                        {editConditions_input.map((cond, i) => (
                            <div key={i} className="flex flex-col gap-1 p-2 border rounded mb-2">
                                <input
                                    placeholder="field"
                                    value={cond.field}
                                    onChange={(e) => updateEditCondition(i, "field", e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-400 rounded text-sm"
                                />

                                <select
                                    value={cond.operator}
                                    onChange={(e) => updateEditCondition(i, "operator", e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-400 rounded text-sm"
                                >
                                    <option value="">Select</option>
                                    <option value="eq">=</option>
                                    <option value="gt">{'>'}</option>
                                    <option value="lt">{'<'}</option>
                                </select>

                                <input
                                    placeholder="value"
                                    value={cond.value}
                                    onChange={(e) => updateEditCondition(i, "value", e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-400 rounded text-sm"
                                />

                                <div className="flex gap-1">
                                    {i > 0 && 
                                    <span onClick={() => removeEditCondition(i)} className="bg-red-500 text-white px-1 py-0.5 rounded text-xs cursor-pointer">Remove</span>
                                    }
                                    <span onClick={() =>
                                                setEditConditions([...editConditions_input, { field: "", operator: '', value: ''}])
                                            } className="bg-blue-500 text-white px-1 py-0.5 rounded text-xs cursor-pointer">+ Add</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Actions Input */}
                    <div>
                        <label className="block text-xs font-semibold mb-1">
                            Actions
                        </label>

                        {editActions_input.map((action, i) => (
                            <div key={i} className="flex flex-col gap-1 p-2 border rounded mb-2">
                                <select
                                    value={action.type}
                                    onChange={(e) => updateEditAction(i, "type", e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-400 rounded text-sm"
                                >
                                    <option value="">Select action</option>
                                    <option value="email">Send Email</option>
                                    <option value="discord">Send Discord</option>
                                    <option value="web-message">Web Notification</option>
                                </select>

                                {action.type === "email" && (
                                    <input
                                        value={action.config.to}
                                        placeholder="Recipient email"
                                        onChange={(e) =>
                                            updateEditActionConfig(i, "to", e.target.value)
                                        }
                                        className="w-full px-2 py-1 border border-gray-400 rounded text-sm"
                                    />
                                )}

                                {action.type === "discord" && (
                                    <input
                                        value={action.config.webhook}
                                        placeholder="Webhook URL"
                                        onChange={(e) =>
                                            updateEditActionConfig(i, "webhook", e.target.value)
                                        }
                                        className="w-full px-2 py-1 border border-gray-400 rounded text-sm"
                                    />
                                )}

                                {action.type === "web-message" && (
                                    <input
                                        value={action.config.message}
                                        placeholder="Message"
                                        onChange={(e) =>
                                            updateEditActionConfig(i, "message", e.target.value)
                                        }
                                        className="w-full px-2 py-1 border border-gray-400 rounded text-sm"
                                    />
                                )}

                                <div className="flex gap-1">
                                    {i > 0 && 
                                    <span
                                        onClick={() => removeEditAction(i)}
                                        className="bg-red-500 text-white px-1 py-0.5 rounded text-xs cursor-pointer"
                                    >
                                        Remove
                                    </span>}

                                    <span
                                        onClick={() =>
                                            setEditActions([...editActions_input, { type: "", config: {} }])
                                        }
                                        className="bg-blue-500 text-white px-1 py-0.5 rounded text-xs cursor-pointer"
                                    >
                                        + Add
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={editLoading}
                            className="flex-1 bg-black text-white px-3 py-2 rounded text-sm font-semibold hover:bg-gray-800 cursor-pointer"
                        >
                            {editLoading ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="flex-1 bg-gray-300 text-black px-3 py-2 rounded text-sm font-semibold hover:bg-gray-400 cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>


        {/* Rules */}
        <div className="bg-white text-black w-full flex items-center justify-center py-10">
            {rules.length > 0 ? (
                <div className="shadow-[0px_0px_5px_0px_black] p-6 rounded overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    
                    {/* Header */}
                    <thead>
                    <tr className="">
                        <th className="p-2 text-center">ID</th>
                        <th className="p-2 text-center">Status</th>
                        <th className="p-2 text-center">Event Type</th>
                        <th className="p-2 text-center">Actions</th>
                        <th className="p-2 text-center">Conditions</th>
                        <th className="p-2 text-center">Created At</th>
                        <th className="p-2 text-center">Edit</th>
                        <th className="p-2 text-center">Delete</th>
                    </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                    {rules.map((rule) => (
                        <tr key={rule.rule_id} className="">
                        <td className="p-2 text-center">{rule.rule_id}</td>
                        <td className="p-2 text-center">
                            {rule.active ? (
                            <span onClick={() => toggleStatus(rule.rule_id, false)} className="bg-green-500 text-white px-2 py-1 rounded text-sm cursor-pointer">
                                Active
                            </span>
                            ) : (
                            <span onClick={() => toggleStatus(rule.rule_id, true)} className="bg-orange-500 text-white px-2 py-1 rounded text-sm cursor-pointer">
                                Inactive
                            </span>
                            )}
                        </td>

                        <td className="p-2 text-center">{rule.event_type}</td>

                        <td className="p-2 text-sm text-center">
                            {rule.rule.actions.map((action: { type: any }, i) => (
                                <span key={i} className="bg-gray-200 px-2 py-1 rounded mr-1">
                                    {JSON.stringify(action.type)}
                                </span>
                            ))}
                        </td>

                        <td className="p-2 text-sm text-center">
                            {rule.rule.conditions.map((conditions: { field: string, operator: string, value: string }, i) => (
                                <span key={i} className="bg-gray-200 px-2 py-1 rounded mr-1">
                                    {JSON.stringify(conditions.field)} {JSON.stringify(conditions.operator)} {JSON.stringify(conditions.value)}
                                </span>
                            ))}
                        </td>

                        <td className="p-2 text-sm text-center text-gray-400">
                            {new Date(rule.created_at).toLocaleString()}
                        </td>

                        <td className="p-2 text-center">
                            <button 
                                onClick={() => handleEditClick(rule)} 
                                className="bg-blue-500 text-white px-2 py-1 rounded text-sm cursor-pointer"
                            >
                                Edit
                            </button>
                        </td>
                        <td className="p-2 text-center">
                            <button onClick={() => deleteRule(rule.rule_id)} className="bg-red-500 text-white px-2 py-1 rounded text-sm cursor-pointer">
                                Delete
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>

                </table>
                </div>
            ) : (
                <p className="text-bold">No rules found.</p>
            )}
        </div>
        </>
    );
}
   