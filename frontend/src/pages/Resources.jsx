import React, { useEffect, useState } from 'react';
import { Download, FileText } from 'lucide-react';

const ResourceItem = ({ resource }) => {
  return (
    <div className="p-4 border rounded shadow-md bg-white flex justify-between items-center mb-4">
      <div>
        <h3 className="text-xl font-bold text-slate-800">{resource.title}</h3>
        <p className="text-gray-600">By {resource.author} ({resource.type})</p>
      </div>
      
      <a 
        href={resource.url} 
        download={resource.title} 
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition duration-300 flex items-center gap-2"
      >
        <Download className="w-5 h-5" />
        Download PDF
      </a>
    </div>
  );
};

const Resources = () => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    // This connects to the /api/resources route in your server.js
    fetch(`${import.meta.env.VITE_API_URL}/api/resources`)
      .then((res) => res.json())
      .then((data) => setResources(data))
      .catch((err) => console.error("Error fetching resources:", err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-indigo-900 flex items-center gap-3">
        <FileText className="w-8 h-8" />
        Digital Library
      </h1>
      
      {resources.length > 0 ? (
        resources.map((res) => (
          <ResourceItem key={res.id} resource={res} />
        ))
      ) : (
        <p className="text-gray-500 italic text-center py-10">No resources available for download yet.</p>
      )}
    </div>
  );
};

export default Resources;
