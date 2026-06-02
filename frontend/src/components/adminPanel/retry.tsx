import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type CircuitBreakerStatus = {
    state: "CLOSED" | "OPEN";
    failures: number;
    opened_at: string;
};

type GlobalRetryStrategy = {
    maxAttempts: number;
    delay: number;
};

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

const renderEmpty = (label: string) => (
    <div className="text-sm text-gray-500">{label}</div>
);

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

export default function Retry() {

    const notify = (message?: string) => toast.custom(
    <div className="bg-white text-black p-4 rounded shadow-[0px_0px_5px_0px_green] w-auto h-auto flex flex-col items-center">
        <strong className="text-sm">{message}</strong>
    </div>
    );
    const [circuitBreakers, setCircuitBreakers] = useState<CircuitBreakerStatus[]>([]);

    const [retryStrategy, setRetryStrategy] = useState<GlobalRetryStrategy>({
    maxAttempts: 0,
    delay: 0
    });

    const fetchCircuit = async () => {
        try{

            const response = await fetch('http://localhost:3000/microservices/circuit',
                {
                method: 'GET',
                credentials: 'include'
            })

            if(response.ok){
                const data = await response.json()
                console.log('circuit: ', data.executionServiceResponse.circuit)
                setCircuitBreakers([data.executionServiceResponse.circuit])
            }else{
                console.log('error', response.text)
            }
        }catch(e){
            console.log('error: ', e)
        }
    }

    const setGlobalRetryStrategy = async () => {
        
        try{
            const response = await fetch("http://localhost:3000/rules/globalRetry", {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    attempts: retryStrategy.maxAttempts,
                    delay: retryStrategy.delay
                })
            })

            if(response.ok){
                const data = await response.json()
                console.log('Global Retry Strategy updated', data)
                notify('Global retry strategy updated successfully');
            }else{
                console.log(`status: ${response.status}, ${response.text}`)
                toast.error('Update failed')
            }

            
        }catch(e){
            console.log(String(e))
        }
    }

    useEffect(() => {
        fetchCircuit();
    },[])
    return (
        <>
        <Toaster position="top-center" reverseOrder={false} />
        <Card title="Global retry strategy & Circuit breaker">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <h3 className="text-xl font-bold mb-3">Global retry strategy</h3>

                <div className="space-y-3">
                <label className="block">
                    <div className="text-sm text-gray-600 mb-1">Max attempts</div>
                    <input
                    type="number"
                    value={retryStrategy.maxAttempts}
                    max={5}
                    min={1}
                    onChange={(e) => setRetryStrategy((s) => ({ ...s, maxAttempts: Number(e.target.value) }))}
                    className="w-full border border-black px-3 py-2 rounded"
                    />
                </label>

                <label className="block">
                    <div className="text-sm text-gray-600 mb-1">Base delay (s)</div>
                    <input
                    type="number"
                    value={retryStrategy.delay}
                    max={5}
                    min={1}
                    onChange={(e) => setRetryStrategy((s) => ({ ...s, delay: Number(e.target.value) }))}
                    className="w-full border border-black px-3 py-2 rounded"
                    />
                </label>

                

                <button
                    onClick={setGlobalRetryStrategy}
                    className="w-full bg-black hover:bg-gray-800 text-white px-4 py-2 rounded text-sm font-semibold cursor-pointer"
                >
                    Save global retry strategy
                </button>

                
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold mb-3">Circuit breaker status</h3>

                {circuitBreakers.length === 0 ? (
                renderEmpty("No circuit breaker data (or endpoint not available yet).")
                ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                        <th className="p-2 text-center">Service</th>
                        <th className="p-2 text-center">State</th>
                        <th className="p-2 text-center">Failure rate</th>
                        <th className="p-2 text-center">Last trip</th>
                        </tr>
                    </thead>
                    <tbody>
                        {circuitBreakers.map((cb) => {
                        
                        return (
                            <tr key={cb.opened_at}>
                            <td className="p-2 text-center text-sm text-gray-600">
                                Execution Service
                            </td>
                            <td className="p-2 text-center">
                                <StatusBadge label={cb.state} variant={cb.state === "CLOSED" ? "green" : "red"} />
                            </td>
                            <td className="p-2 text-center text-sm text-gray-600">
                                {cb.failures === undefined ? "-" : `${cb.failures}`}
                            </td>
                            <td className="p-2 text-center text-sm text-gray-500">
                                {cb.opened_at ? cb.opened_at : "-"}
                            </td>
                            </tr>
                        );
                        })}
                    </tbody>
                    </table>
                </div>
                )}

            </div>
            </div>
        </Card>
        </>
    )
}