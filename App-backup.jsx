import { useState } from "react"; import jsPDF from "jspdf"; export default function App() { const [client, setClient] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone] = useState(""); const [service, setService] = useState(""); const [amount, setAmount] = useState(""); const [clients, setClients] = useState([]); const [history, setHistory] = useState([]); const invoiceNumber = `LOC-${String(history.length + 1).padStart(3, "0")}`; const saveClient = () => { if (!client) return; const newClient = { name: client, email, phone }; setClients([newClient, ...clients]); alert("Client saved"); }; const createInvoice = () => { const pdf = new jsPDF(); pdf.setFontSize(20); pdf.text("LocateIT Solution", 20, 20); pdf.setFontSize(12); pdf.text(`Invoice Number: ${invoiceNumber}`, 20, 40); pdf.text(`Client: ${client}`, 20, 50); pdf.text(`Email: ${email}`, 20, 60); pdf.text(`Phone: ${phone}`, 20, 70); pdf.text(`Service: ${service}`, 20, 80); pdf.text(`Amount: R ${amount}`, 20, 90); pdf.text("Capitec Bank", 20, 120); pdf.text("Account Holder: MR HD HOLM", 20, 130); pdf.text("Account Number: 1718704958", 20, 140); pdf.text("Branch Code: 470010", 20, 150); pdf.save(`${invoiceNumber}.pdf`); const invoice = { invoiceNumber, client, amount, service }; setHistory([invoice, ...history]); }; return ( <div className="app"> <h1>LocateIT Solution</h1> <p>Business Invoice Dashboard</p> <div className="card"> <h2>Create Invoice</h2> <input placeholder="Client Name" value={client} onChange={(e) => setClient(e.target.value)} /> <input placeholder="Client Email" value={email} onChange={(e) => setEmail(e.target.value)} /> <input placeholder="Client Phone" value={phone} onChange={(e) => setPhone(e.target.value)} /> <input placeholder="Service Description" value={service} onChange={(e) => setService(e.target.value)} /> <input placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} /> <button onClick={saveClient}> Save Client </button> <br /> <br /> <button onClick={createInvoice}> Generate PDF Invoice </button> </div> <div className="card"> <h2>Client Database</h2> {clients.length === 0 ? ( <p>No clients saved.</p> ) : ( clients.map((c, index) => ( <div className="invoice" key={index}> <strong>{c.name}</strong> <p>{c.email}</p> <p>{c.phone}</p> </div> )) )} </div> <div className="card"> <h2>Invoice History</h2> {history.length === 0 ? ( <p>No invoices yet.</p> ) : ( history.map((item, index) => ( <div className="invoice" key={index}> <strong>{item.invoiceNumber}</strong> <p>{item.client}</p> <p>{item.service}</p> <p>R {item.amount}</p> </div> )) )} </div> </div> ); }
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
