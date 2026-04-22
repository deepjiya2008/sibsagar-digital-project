import React from 'react';

const ResourceCard = ({ resource }) => {
  // resource = { title: "Assam History", author: "Dr. Deep Jyoti Boruah", url: "..." }
  
  const handleDownload = (url, filename) => {
    // This approach ensures the browser triggers a download rather than just opening the PDF
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename); 
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white flex justify-between items-center">
      <div>
        <h3 className="font-bold text-lg text-slate-800">{resource.title}</h3>
        <p className="text-sm text-slate-500">Author: {resource.author}</p>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mt-2 inline-block">
          {resource.type}
        </span>
      </div>
      
      <button 
        onClick={() => handleDownload(resource.url, `${resource.title}.pdf`)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        Download
      </button>
    </div>
  );
};

export default ResourceCard;