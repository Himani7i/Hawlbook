A full-stack Room Booking System designed for institution, where students can book seminar halls, labs,etc
— with a hierarchical event approval workflow by admins like DSW and HOD,room allocations, and real-time communication.

The flow: signup → upload notesheet → DSW approval → room booking → HOD approval) + Real time peer to peer communication.

Authentication & Security:
JWT-based authentication with role-based access (Student, DSW, HOD).
Protected routes to ensure secure access.

Hierarchical Event Approval:
Students submit event notesheets (PDF/DOCX).
First-level approval by DSW.
Upon approval, students can request room bookings to HODs.
Department HODs grant final room permissions.

Real-Time Communication:
Peer-to-peer video calling powered by WebRTC + Socket.IO.
Room creation & signaling for call negotiation.
Low-latency streams with interactive join/reject prompts on dashboards.




