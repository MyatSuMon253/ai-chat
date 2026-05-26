import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/hello")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error fetching message:", error));
  }, []);

  return (
    <div className="p-4">
      <p className="text-2xl font-bold text-pink-400">{message}</p>
      <Button>Click me</Button>
    </div>
  );
}

export default App;
