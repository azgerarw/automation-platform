import React, { useState, useEffect } from "react";

type dbType = {
    name: string,
    size: string
}

type databases = {
    name: string,
    type: string,
    databases: dbType[],
    state: string,
    latency_ms: number
}

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


export default function Metrics() {

    const [dbs, setDbs] = useState<databases>({
        name: '',
        type: '',
        databases: [],
        state: '',
        latency_ms: 0
    });

    const fetchDBs = async () => {

        try{
            const response = await fetch("http://localhost:3000/microservices/dbConnections",{
                credentials: 'include'
            })
            
            if(response.ok){
                const data = await response.json();
                setDbs(data.dbs[0])
                
                return
            }

            console.log('error ocurred')
        }catch(e){
            console.log(e)
        }

    }

    useEffect(() => {
        
        fetchDBs();

    }, []);

    return (
    <>
      <Card title="Databases">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          
            <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                        <th className="p-2 text-center">Name</th>
                        <th className="p-2 text-center">Type</th>
                        <th className="p-2 text-center">State</th>
                        <th className="p-2 text-center">Size</th>
                        <th className="p-2 text-center">Latency</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dbs.databases.map((db) => {
                        
                        return (
                            <tr key={db.name}>
                            <td className="p-2 text-center text-sm text-gray-600">
                                {db.name}
                            </td>
                            <td className={`p-2 text-center text-sm text-gray-600`}>
                                {dbs.type}
                            </td>
                            <td className={`${dbs.state == 'online' ? 'text-green-400' : 'text-red-600'} p-2 text-center`}>
                                {dbs.state}
                            </td>
                            <td className="p-2 text-center text-sm text-gray-600">
                                {db.size}
                            </td>
                            <td className="p-2 text-center text-sm text-gray-500">
                                {dbs.latency_ms}
                            </td>
                            </tr>
                        );
                        })}
                    </tbody>
                    </table>
          
          </div>
      </Card>
    </>
  );
}