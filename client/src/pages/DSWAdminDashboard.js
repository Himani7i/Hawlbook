import { useEffect, useState } from 'react';
import API from '../api';
import { toast } from 'react-hot-toast';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

function DSWAdminDashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.get('/event/pending');
        setEvents(res.data);
      } catch (err) {
        toast.error('Could not load pending events');
      }
    };
    fetchEvents();
  }, []);

  const handleDecision = async (eventId, status) => {
    try {
      await API.put(`/event/decision/${eventId}`, { status, remarks: "Approved by DSW"  });
      toast.success(`Event ${status}`);
      setEvents(events.filter(e => e._id !== eventId));
    } catch (err) {
      toast.error('Action failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <h1 className="text-4xl font-bold mb-6 text-center text-yellow-400">📋 DSW Event Approval Panel</h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-300">No pending events found 💤</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="bg-white/10 backdrop-blur-md border border-yellow-400 shadow-lg">
                <CardContent className="p-6 space-y-3">
                  <h2 className="text-xl font-bold text-yellow-300">{event.title}</h2>
<p><strong>Submitted by:</strong> {event.student?.username} ({event.student?.email})</p>

                  <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                  <p><strong>Purpose:</strong> {event.purpose}</p>
                 <a href={`http://localhost:5000/${event.file}`} target="_blank" rel="noreferrer" className="underline text-blue-300">View Notesheet</a>

                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={() => handleDecision(event._id, 'approved')}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >Approve</Button>
                    <Button
                      onClick={() => handleDecision(event._id, 'rejected')}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >Reject</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DSWAdminDashboard;
