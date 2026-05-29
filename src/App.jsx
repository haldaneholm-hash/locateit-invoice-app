
import { useState } from "react";
import jsPDF from "jspdf";

export default function App() {
  const [client, setClient] = useState("");
  const [service, setService] = useState("");
  const [amount, setAmount] = useState("");
  const [history, setHistory] = useState([]);

  const invoiceNumber = `LOC-${String(history.length + 1).padStart(3, "0")}`;

  const createInvoice = () => {
    const pdf = new jsPDF();

    pdf.text("LocateIT Solution", 20, 20);
    pdf.text(`Invoice: ${invoiceNumber}`, 20, 40);
    pdf.text(`Client: ${client}`, 20, 50);
    pdf.text(`Service: ${service}`, 20, 60);
    pdf.text(`Amount: R ${amount}`, 20, 70);

    pdf.save(`${invoiceNumber}.pdf`);

    setHistory([
      {
        invoiceNumber,
        client,
        amount
      },
      ...history
    ]);
  };

  return (
    <div className="app">
      <h1>LocateIT Solution</h1>
      <p>Production Invoice Dashboard</p>

      <div className="card">
        <input
          placeholder="Client Name"
          value={client}
          onChange={(e) => setClient(e.target.value)}
        />

        <input
          placeholder="Service Description"
          value={service}
          onChange={(e) => setService(e.target.value)}
        />

        <input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button onClick={createInvoice}>
          Generate PDF Invoice
        </button>
      </div>

      <div className="card">
        <h2>Invoice History</h2>

        {history.length === 0 ? (
          <p>No invoices yet.</p>
        ) : (
          history.map((item, index) => (
            <div className="invoice" key={index}>
              <strong>{item.invoiceNumber}</strong>
              <p>{item.client}</p>
              <p>R {item.amount}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
