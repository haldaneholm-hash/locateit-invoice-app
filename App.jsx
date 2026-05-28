
import { useState } from "react";

export default function App() {
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");

  const generateInvoice = () => {
    alert(`Invoice created for ${client} - R ${amount}`);
  };

  return (
    <div className="container">
      <h1>LocateIT Solution Invoice App</h1>

      <div className="card">
        <input
          placeholder="Client Name"
          value={client}
          onChange={(e) => setClient(e.target.value)}
        />

        <input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button onClick={generateInvoice}>
          Generate Invoice
        </button>
      </div>

      <div className="footer">
        Built for LocateIT Solution
      </div>
    </div>
  );
}
