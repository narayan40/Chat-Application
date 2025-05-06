import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState(["hi there", "hello"]);
  const inputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080"); // use ws:// not http://
    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    };
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: { roomId: "red" }
      }));
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleSend = () => {
    const message = inputRef.current?.value;
    if (message && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "chat",
        payload: { message }
      }));
      inputRef.current.value = ""; // clear input
    }
  };

  return (
    <div className="h-screen bg-gray-900">
      <div className="h-[90vh] text-white p-4 text-xl overflow-y-auto">
        {messages.map((message, idx) => (
          <div key={idx}>{message}</div>
        ))}
      </div>

      <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-md space-x-4">
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-white p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type your message..."
        />
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-200"
          onClick={handleSend}
        >
          Send Message
        </button>
      </div>
    </div>
  );
}

export default App;
