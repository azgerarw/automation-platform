import Rules from "../components/dashboard/rules";
import ApiKeys from "../components/dashboard/apiKeys";
import Executions from "../components/dashboard/logs";
import Events from "../components/dashboard/events";
import Config from "../components/dashboard/config";

export default function Dashboard() {


    return (
    <div className="bg-white text-black min-h-screen p-8">
        <div className="max-w-6xl mx-auto space-y-12">

        {/* Header */}
        <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-600">
            Manage your automation rules and monitor executions
            </p>
        </div>

        {/* RULE MANAGEMENT */}
        <section className="grid grid-rows-auto gap-4 w-auto">
            <Rules/>
        </section>

        {/* API & ACCESS */}
        <section className="grid grid-rows-auto gap-4 w-auto">
            <ApiKeys/>
        </section>

        {/* OBSERVABILITY */}
        <section className="w-auto">
            <Executions/>
        </section>

        {/* REAL-TIME EVENTS */}
        <section className="w-auto">
            <Events/>
        </section>

        {/* CONFIGURATION */}
        <section className="flex flex-col justify-center items-center w-auto">
            <Config />
        </section>

        </div>
    </div>
    );
}