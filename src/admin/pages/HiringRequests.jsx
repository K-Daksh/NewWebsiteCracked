// Component for managing hiring requests
import React, { useState, useEffect } from 'react';
import { Mail, Clock, CheckCircle, XCircle, Trash2, Building, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { getHiringRequests, updateHiringRequestStatus, deleteHiringRequest } from '../api';

const HiringRequests = () => {
  const { token } = useAdminAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      fetchRequests();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchRequests = async () => {
    try {
      const data = await getHiringRequests();
      setRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await updateHiringRequestStatus(id, newStatus);
      if (response.success) {
        setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    try {
        const response = await deleteHiringRequest(id);
        if (response.success) {
            setRequests(requests.filter(req => req.id !== id));
        }
    } catch (err) {
        console.error('Failed to delete request', err);
    }
  };

  if (loading) return <div className="text-white text-center py-10">Loading requests...</div>;
  if (error) return <div className="text-red-400 text-center py-10">Error: {error}</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Hiring Requests</h1>
        <div className="px-4 py-2 bg-purple-500/10 rounded-lg border border-purple-500/20 text-purple-300 text-sm">
          Total: {requests.length}
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
          <Mail className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-white font-medium text-lg">No requests yet</h3>
          <p className="text-white/40 text-sm mt-1">Hiring inquiries will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-colors">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                           <Building className="w-5 h-5 text-purple-400" />
                           {req.companyName}
                        </h3>
                        <p className="text-white/50 text-sm mt-1 flex items-center gap-2">
                           <Mail className="w-4 h-4" />
                           <a href={`mailto:${req.workEmail}`} className="hover:text-purple-300 transition-colors">{req.workEmail}</a>
                           <span className="text-white/20">•</span>
                           <span className="text-white/30">{new Date(req.createdAt).toLocaleDateString()}</span>
                        </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        req.status === 'pending' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300' :
                        req.status === 'contacted' ? 'bg-blue-500/10 border-blue-500/20 text-blue-300' :
                        'bg-green-500/10 border-green-500/20 text-green-300'
                    }`}>
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                    <h4 className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-2">Requirements</h4>
                    <p className="text-white/80 text-sm whitespace-pre-wrap leading-relaxed">{req.requirements}</p>
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 md:justify-center">
                    <button 
                        onClick={() => handleStatusUpdate(req.id, 'contacted')}
                        disabled={req.status === 'contacted'}
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${req.status === 'contacted' ? 'bg-blue-500/20 text-blue-300 cursor-default' : 'bg-white/5 text-white hover:bg-blue-500/20 hover:text-blue-300'}`}
                    >
                        <Clock className="w-4 h-4" /> Mark Contacted
                    </button>
                    <button 
                         onClick={() => handleStatusUpdate(req.id, 'closed')}
                         disabled={req.status === 'closed'}
                         className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${req.status === 'closed' ? 'bg-green-500/20 text-green-300 cursor-default' : 'bg-white/5 text-white hover:bg-green-500/20 hover:text-green-300'}`}
                    >
                        <CheckCircle className="w-4 h-4" /> Mark Closed
                    </button>
                    <button 
                        onClick={() => handleDelete(req.id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all mt-auto"
                    >
                        <Trash2 className="w-4 h-4" /> Delete
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HiringRequests;
