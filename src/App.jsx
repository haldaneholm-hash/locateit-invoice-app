import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";




export default function App() {
  const [client, setClient] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [historyFilter, setHistoryFilter] =
  useState("All");
  const [clientSearch, setClientSearch] =
  useState("");
 const [items, setItems] = useState([
  {
    description: "",
    qty: 1,
    rate: 0,
  },
]);
const addItem = () => {
  setItems([
    ...items,
    {
      description: "",
      qty: 1,
      rate: 0,
    },
  ]);
};
const updateItem = (index, field, value) => {
  const updated = [...items];

  updated[index][field] = value;

  setItems(updated);
};
const totalAmount = items.reduce(
  (sum, item) => sum + item.qty * item.rate,
  0
);

  const [clients, setClients] = useState(() => {
    
  const savedClients = localStorage.getItem("clients");
  return savedClients ? JSON.parse(savedClients) : [];
});
const filteredClients = clients.filter(
  (c) =>
    c.name
      .toLowerCase()
      .includes(
        clientSearch.toLowerCase()
      )
);

const selectClient = (name) => {
  const selected = clients.find(
    (c) => c.name === name
  );

  if (selected) {
    setClient(selected.name);
    setEmail(selected.email);
    setPhone(selected.phone);
  }
};

const backupData = () => {
  const backup = {
    clients,
    history,
    exportDate:
      new Date().toLocaleString(),
  };

  const blob = new Blob(
    [JSON.stringify(backup, null, 2)],
    {
      type: "application/json",
    }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "LocateIT-Backup.json";

  link.click();

  URL.revokeObjectURL(url);
};
const exportToExcel = () => {
  const worksheetData = history.map(
    (invoice) => ({
      InvoiceNumber:
        invoice.invoiceNumber,
      Client: invoice.client,
      Email: invoice.email,
      Phone: invoice.phone,
      Type: invoice.type,
      Amount: invoice.amount,
      Status: invoice.status,
      DueDate: invoice.dueDate,
      InvoiceDate: invoice.date,
    })
  );



  const worksheet =
    XLSX.utils.json_to_sheet(
      worksheetData
    );

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Invoices"
  );

  XLSX.writeFile(
    workbook,
    "LocateIT-Invoices.xlsx"
  );
};

const deleteClient = (name) => {
  if (
    !window.confirm(
      `Delete ${name}?`
    )
  ) {

    
    return;
  }

  const updatedClients = clients.filter(
    (c) => c.name !== name
  );

  setClients(updatedClients);
};

const restoreData = (event) => {
  const file =
    event.target.files[0];

  if (!file) return;

  const reader =
    new FileReader();

  reader.onload = (e) => {
    const backup =
      JSON.parse(
        e.target.result
      );

    if (
      window.confirm(
        "Restore backup and replace current data?"
      )
    ) {
      setClients(
        backup.clients || []
      );

      setHistory(
        backup.history || []
      );

      alert(
        "Backup restored successfully"
      );
    }
  };

  reader.readAsText(file);
};

const [documentType, setDocumentType] =
  useState("Invoice");

const [history, setHistory] = useState(() => {
  const savedHistory = localStorage.getItem("history");
  return savedHistory ? JSON.parse(savedHistory) : [];
});

const [settings, setSettings] =
  useState(() => {
    const saved =
      localStorage.getItem(
        "locateit_settings"
      );

    return saved
      ? JSON.parse(saved)
      : {
          companyName:
            "LocateIT Solutions",
          phone:
            "0828027561",
          email:
            "dstvinstall.el@gmail.com",
          bank:
            "Capitec Bank",
          accountHolder:
            "MR HD HOLM",
          accountNumber:
            "1718704958",
          branchCode:
            "470010",
        };
  });

const [searchTerm, setSearchTerm] = useState("");
const [nextInvoiceNumber, setNextInvoiceNumber] = useState(() => {
  const saved = localStorage.getItem(
    "nextInvoiceNumber"
  );

  return saved ? Number(saved) : 1;
});

const [nextQuoteNumber, setNextQuoteNumber] = useState(() => {
  const saved = localStorage.getItem(
    "nextQuoteNumber"
  );

  return saved ? Number(saved) : 1;
});
useEffect(() => {
  localStorage.setItem(
    "locateit_settings",
    JSON.stringify(settings)
  );
}, [settings]);


useEffect(() => {
  const savedClients =
    localStorage.getItem(
      "locateit_clients"
    );

    
    

  const savedHistory =
    localStorage.getItem(
      "locateit_history"
    );

  if (savedClients) {
    setClients(
      JSON.parse(savedClients)
    );
  }

  if (savedHistory) {
    setHistory(
      JSON.parse(savedHistory)
    );
  }
  
}, []);

useEffect(() => {
  localStorage.setItem(
    "locateit_clients",
    JSON.stringify(clients)
  );
}, [clients]);

useEffect(() => {
  localStorage.setItem(
    "locateit_history",
    JSON.stringify(history)
  );
}, [history]);

useEffect(() => {
  localStorage.setItem(
    "clients",
    JSON.stringify(clients)
  );
}, [clients]);

useEffect(() => {
  localStorage.setItem(
    "history",
    JSON.stringify(history)
  );
}, [history]);

useEffect(() => {
  localStorage.setItem(
    "nextInvoiceNumber",
    nextInvoiceNumber
  );
}, [nextInvoiceNumber]);

useEffect(() => {
  localStorage.setItem(
    "nextQuoteNumber",
    nextQuoteNumber
  );
}, [nextQuoteNumber]);


  const invoiceNumber =
  documentType === "Quote"
    ? `QUO-${String(
        nextQuoteNumber
      ).padStart(3, "0")}`
    : `LOC-${String(
        nextInvoiceNumber
      ).padStart(3, "0")}`;

const paidInvoices = history.filter(
  (invoice) => invoice.status === "Paid"
);

const unpaidInvoices = history.filter(
  (invoice) => invoice.status !== "Paid"
);

const today = new Date();

const overdueInvoices = history.filter(
  (invoice) =>
    invoice.status === "Unpaid" &&
    invoice.dueDate &&
    new Date(invoice.dueDate) < today
);

const outstandingAmount = unpaidInvoices.reduce(
  (total, invoice) => total + Number(invoice.amount || 0),
  0
);

const paidRevenue = paidInvoices.reduce(
  (total, invoice) =>
    total + Number(invoice.amount || 0),
  0
);

const filteredHistory = history.filter(
  (invoice) => {
    const matchesSearch =
      invoice.client
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (historyFilter === "All")
      return true;

    if (historyFilter === "Invoices")
      return invoice.type === "Invoice";

    if (historyFilter === "Quotes")
      return invoice.type === "Quote";

    if (historyFilter === "Paid")
      return invoice.status === "Paid";

    if (historyFilter === "Unpaid")
      return invoice.status === "Unpaid";

    if (historyFilter === "Overdue")
      return (
        invoice.status === "Unpaid" &&
        invoice.dueDate &&
        new Date(invoice.dueDate) <
          new Date()
      );

    return true;
  }
);


  const saveClient = () => {
    if (!client) {
      alert("Please enter a client name");
      return;
    }

    const newClient = {
      name: client,
      email,
      phone,
    };

    setClients([newClient, ...clients]);

    alert("Client saved successfully");
  };

  const createInvoice = () => {
     const today =
    new Date().toLocaleDateString();
  const pdf = new jsPDF();
  const logo = new Image();
   logo.src = "/logo.png";

logo.onload = () => {
pdf.addImage(
  logo,
  "PNG",
  20,
  10,
  25,
  25
);
  
  pdf.setFontSize(25);
pdf.text(
  settings.companyName,
  70,
  20
);

pdf.setFontSize(14);
pdf.text(
  documentType.toUpperCase(),
  70,
  32
);

pdf.rect(140, 25, 60, 25);
  pdf.setFontSize(12);

  pdf.text(
  `${
    documentType === "Quote"
      ? "Quote"
      : "Invoice"
  } #: ${invoiceNumber}`,
  145,
  35
);
pdf.text(`Date: ${today}`, 145, 45);

pdf.setFontSize(10);

pdf.text(
  settings.companyName,
  20,
  42
);

pdf.text(
  settings.phone,
  20,
  48
);

pdf.text(
  settings.email,
  20,
  54
);

pdf.text(
  "Non VAT Vendor",
  20,
  60
);
pdf.line(20, 70, 190, 70);

pdf.text("Customer Details", 20, 80);
pdf.text(`Name: ${client}`, 20, 90);
pdf.text(`Email: ${email}`, 20, 100);
pdf.text(`Phone: ${phone}`, 20, 110);
pdf.text(`Due Date: ${dueDate}`, 20, 120);

pdf.line(20, 130, 190, 130);

pdf.text("Invoice Items", 20, 140);

autoTable(pdf, {
  startY: 145,
  head: [["Description", "Qty", "Rate", "Total"]],
  body: items.map((item) => [
    item.description,
    item.qty,
    `R ${item.rate}`,
    `R ${(item.qty * item.rate).toFixed(2)}`
  ]),
});

let y = pdf.lastAutoTable.finalY + 15;



pdf.setFillColor(230, 230, 230);
pdf.rect(20, y, 170, 15, "F");

pdf.setFontSize(16);
pdf.text(
  `TOTAL DUE: R ${totalAmount.toFixed(2)}`,
  25,
  y + 10
);

y += 25;

//if (y > 180) {
  //pdf.addPage();
  //y = 20;
//}

pdf.setFontSize(12);
pdf.text(
  settings.bank,
  20,
  y
);

y += 10;
pdf.text(
  `Account Holder: ${settings.accountHolder}`,
  20,
  y
);

y += 10;

pdf.text(
  `Account Number: ${settings.accountNumber}`,
  20,
  y
);

y += 10;

pdf.text(
  `Branch Code: ${settings.branchCode}`,
  20,
  y
);

y += 10;
pdf.text("Non VAT Vendor", 20, y);

y += 15;
if (y > 200) {
  pdf.addPage();
  y = 20;
}
pdf.setFontSize(10);

pdf.text("Terms & Conditions", 20, y);

y += 8;

pdf.text(
  "• Payment due within 24 hours of invoice date.",
  20,
  y
);

y += 6;

pdf.text(
  "• COD applies where specified.",
  20,
  y
);

y += 6;

pdf.text(
  "• Ownership remains with LocateIT Solutions until paid in full.",
  20,
  y
);

y += 6;

pdf.text(
  "• Labour and service fees are non-refundable after completion.",
  20,
  y
);

y += 6;

pdf.text(
  "• Equipment remains subject to manufacturer warranty terms.",
  20,
  y
);

y += 15;
pdf.text("Thank you for your business.", 20, y);


  pdf.save(`${invoiceNumber}.pdf`);
  };

setHistory([
  {
    invoiceNumber,
    client,
    email,
    phone,
    amount: totalAmount,
    status: "Unpaid",
    type: documentType,
    dueDate,
    date: today,
    items,
  },
  ...history,
]);

if (documentType === "Quote") {
  setNextQuoteNumber(
    nextQuoteNumber + 1
  );
} else {
  setNextInvoiceNumber(
    nextInvoiceNumber + 1
  );
}
};
 const sendWhatsAppReminder = (invoice) => {
  const message = `...`;

  if (!invoice.phone) {
    alert(
      "No phone number stored for this invoice."
    );
    return;
  }

  const phone = invoice.phone.replace(
    /\D/g,
    ""
  );

  window.open(
    `https://wa.me/27${phone.slice(-9)}?text=${encodeURIComponent(
      message
    )}`,
    "_blank"
  );
};

const emailInvoice = (invoice) => {
  if (!invoice.email) {
    alert(
      "No email address stored for this invoice."
    );
    return;
  }

  const subject =
    `Invoice ${invoice.invoiceNumber} - LocateIT Solutions`;

  const body = `Good day ${invoice.client},

Please find Invoice ${invoice.invoiceNumber} for R ${invoice.amount}.

Due Date: ${invoice.dueDate}

Thank you for your business.

LocateIT Solutions
082 802 7561`;

  window.open(
    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      invoice.email
    )}&su=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(
      body
    )}`,
    "_blank"
  );
};
const downloadInvoicePDF = (invoice) => {
  const pdf = new jsPDF();

  pdf.setFontSize(20);
  pdf.text(
    "LOCATEIT SOLUTIONS",
    20,
    20
  );

  pdf.setFontSize(12);

  pdf.text(
    `Invoice #: ${invoice.invoiceNumber}`,
    20,
    40
  );

  pdf.text(
    `Client: ${invoice.client}`,
    20,
    50
  );

  pdf.text(
    `Email: ${invoice.email}`,
    20,
    60
  );

  pdf.text(
    `Phone: ${invoice.phone}`,
    20,
    70
  );

  pdf.text(
    `Due Date: ${invoice.dueDate}`,
    20,
    80
  );

  let y = 100;

  pdf.text(
    "Description",
    20,
    y
  );

  pdf.text(
    "Qty",
    110,
    y
  );

  pdf.text(
    "Rate",
    140,
    y
  );

  pdf.text(
    "Total",
    170,
    y
  );

  y += 10;

  invoice.items.forEach(
    (item) => {
      pdf.text(
        item.description,
        20,
        y
      );

      pdf.text(
        String(item.qty),
        110,
        y
      );

      pdf.text(
        `R ${item.rate}`,
        140,
        y
      );

      pdf.text(
        `R ${
          item.qty *
          item.rate
        }`,
        170,
        y
      );

      y += 10;
    }
  );

  y += 10;

  pdf.setFontSize(16);

  pdf.text(
    `TOTAL: R ${invoice.amount}`,
    20,
    y
  );

  pdf.save(
    `${invoice.invoiceNumber}.pdf`
  );
};
const toggleInvoiceStatus = (invoiceNumber) => {
  const updatedHistory = history.map((invoice) => {
    if (invoice.invoiceNumber === invoiceNumber) {
      return {
        ...invoice,
        status:
          invoice.status === "Paid"
            ? "Unpaid"
            : "Paid",
      };
    }

    return invoice;
  });

  setHistory(updatedHistory);
};

const deleteInvoice = (invoiceNumber) => {
  if (
    !window.confirm(
      `Delete invoice ${invoiceNumber}?`
    )
  ) {
    return;
  }

  const updatedHistory = history.filter(
    (invoice) =>
      invoice.invoiceNumber !== invoiceNumber
  );

  setHistory(updatedHistory);
};
const convertQuoteToInvoice = (quote) => {
  const newInvoiceNumber = `LOC-${String(
    nextInvoiceNumber
  ).padStart(3, "0")}`;

  const newInvoice = {
    ...quote,
    invoiceNumber: newInvoiceNumber,
    type: "Invoice",
    status: "Unpaid",    
  };

 

  const updatedHistory = history.map(
  (item) => {
    if (
      item.invoiceNumber ===
      quote.invoiceNumber
    ) {
      return {
        ...item,
        status: "Converted",
        convertedTo:
          newInvoiceNumber,
      };
    }

    return item;
  }
);

  setHistory([
  newInvoice,
  ...updatedHistory,
]);

  setNextInvoiceNumber(
    nextInvoiceNumber + 1
  );
};
const currentMonth =
  new Date().getMonth();

const currentYear =
  new Date().getFullYear();

const revenueThisMonth = history
  .filter((item) => {
    if (!item.date) return false;

    const invoiceDate =
      new Date(item.date);

    return (
      item.type === "Invoice" &&
      invoiceDate.getMonth() ===
        currentMonth &&
      invoiceDate.getFullYear() ===
        currentYear
    );
  })
  .reduce(
    (total, item) =>
      total +
      Number(item.amount || 0),
    0
  );



const revenueThisYear = history
  .filter((item) => {
    if (!item.date) return false;

    const invoiceDate =
      new Date(item.date);

    return (
      item.type === "Invoice" &&
      invoiceDate.getFullYear() ===
        currentYear
    );
  })
  .reduce(
    (total, item) =>
      total +
      Number(item.amount || 0),
    0
  );
const averageInvoiceValue =
  history.length > 0
    ? history.reduce(
        (total, item) =>
          total +
          Number(item.amount || 0),
        0
      ) / history.length
    : 0;

    const customerTotals = {};

history.forEach((item) => {
  if (item.type === "Invoice") {
    customerTotals[item.client] =
      (customerTotals[item.client] || 0) +
      Number(item.amount || 0);
  }
});

const topCustomer =
  Object.entries(customerTotals)
    .sort((a, b) => b[1] - a[1])[0];


return (
  
    <div className="app">
   <div className="card">
  <h2>Business Summary</h2>
  
   <button
    onClick={exportToExcel}
  >
    Export To Excel
  </button>
  <button
  onClick={backupData}
>
  
  Backup Data
</button>
<label
    style={{
      marginLeft: "10px",
    }}
  >
    <input
      type="file"
      accept=".json"
      onChange={restoreData}
      style={{
        display: "none",
      }}
    />

    <span
      style={{
        border: "1px solid black",
        padding: "8px",
        cursor: "pointer",
      }}
    >
      Restore Data
    </span>
  </label>
  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "10px",
    }}
    
  >
    <div className="invoice">
      <strong>Total Clients</strong>
      <h2>{clients.length}</h2>
    </div>

    <div className="invoice">
      <strong>Total Invoices</strong>
      <h2>{history.length}</h2>
    </div>

    <div className="invoice">
      <strong>Paid</strong>
      <h2>{paidInvoices.length}</h2>
    </div>

    <div className="invoice">
      <strong>Unpaid</strong>
      <h2>{unpaidInvoices.length}</h2>
    </div>

    <div className="invoice">
      <strong>Overdue</strong>
      <h2>{overdueInvoices.length}</h2>
    </div>

    <div className="invoice">
  <strong>Outstanding</strong>
  <h2>
    R {outstandingAmount.toFixed(2)}
  </h2>
</div>

<div className="invoice">
  <strong>Revenue This Month</strong>
  <h2>
    R {revenueThisMonth.toFixed(2)}
  </h2>
</div>

<div className="invoice">
  <strong>Revenue This Year</strong>
  <h2>
    R {revenueThisYear.toFixed(2)}
  </h2>
</div>

<div className="invoice">
  <strong>Paid Revenue</strong>
  <h2>
    R {paidRevenue.toFixed(2)}
  </h2>
</div>
<div className="invoice">
  <strong>Average Invoice</strong>
  <h2>
    R {averageInvoiceValue.toFixed(2)}
  </h2>
</div>

<div className="invoice">
  <strong>Top Customer</strong>

  <h3>
    {topCustomer
      ? topCustomer[0]
      : "No Data"}
  </h3>

  <p>
    R{" "}
    {topCustomer
      ? topCustomer[1].toFixed(2)
      : "0.00"}
  </p>
</div>



</div>
</div>

<div className="card">
  <h2>Business Settings</h2>

  <input
    placeholder="Company Name"
    value={settings.companyName}
    onChange={(e) =>
      setSettings({
        ...settings,
        companyName: e.target.value,
      })
    }
  />

  <input
    placeholder="Phone"
    value={settings.phone}
    onChange={(e) =>
      setSettings({
        ...settings,
        phone: e.target.value,
      })
    }
  />

  <input
    placeholder="Email"
    value={settings.email}
    onChange={(e) =>
      setSettings({
        ...settings,
        email: e.target.value,
      })
    }
  />

  <input
    placeholder="Bank"
    value={settings.bank}
    onChange={(e) =>
      setSettings({
        ...settings,
        bank: e.target.value,
      })
    }
  />

  <input
    placeholder="Account Holder"
    value={settings.accountHolder}
    onChange={(e) =>
      setSettings({
        ...settings,
        accountHolder: e.target.value,
      })
    }
  />

  <input
    placeholder="Account Number"
    value={settings.accountNumber}
    onChange={(e) =>
      setSettings({
        ...settings,
        accountNumber: e.target.value,
      })
    }
  />

  <input
    placeholder="Branch Code"
    value={settings.branchCode}
    onChange={(e) =>
      setSettings({
        ...settings,
        branchCode: e.target.value,
      })
    }
  />
</div>
      <h1>{settings.companyName}</h1>
      <img
  src="/logo.png"
  alt="LocateIT Logo"
  style={{
    width: "200px",
    marginBottom: "20px"
  }}
  
/>

      <p>Production Invoice Dashboard</p>
<div className="card">
  <h2>Business Dashboard</h2>

  <p>
    Total Invoices: {history.length}
  </p>

  <p>
    Paid Revenue: R{" "}
    {paidRevenue.toFixed(2)}
  </p>

  <p>
    Outstanding: R{" "}
    {outstandingAmount.toFixed(2)}
  </p>

  <p>
    Overdue Invoices:{" "}
    {overdueInvoices.length}
  </p>
</div>
  
      <div className="card">
        <h3>Select Existing Client</h3>

<select
  onChange={(e) =>
    selectClient(e.target.value)
  }
>
  <option value="">
    Select Client
  </option>

  {clients.map((c, index) => (
    <option
      key={index}
      value={c.name}
    >
      {c.name}
    </option>
  ))}
</select>

<br />
<br />


<br />
<br />

<h3>Document Type</h3>

<select
  value={documentType}
  onChange={(e) =>
    setDocumentType(e.target.value)
  }
>
  <option value="Invoice">
    Invoice
  </option>

  <option value="Quote">
    Quote
  </option>
</select>

<br />
<br />

<input
  placeholder="Client Name"
  value={client}
  onChange={(e) => setClient(e.target.value)}
/>
        

        <input
          placeholder="Client Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Client Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
  type="date"
  value={dueDate}
  onChange={(e) =>
    setDueDate(e.target.value)
  }
/>

        <h3>Invoice Items</h3>

{items.map((item, index) => (
  <div key={index}>
    <input
      placeholder="Description"
      value={item.description}
      onChange={(e) =>
        updateItem(index, "description", e.target.value)
      }
    />

    <input
      type="number"
      placeholder="Qty"
      value={item.qty}
      onChange={(e) =>
        updateItem(index, "qty", Number(e.target.value))
      }
    />

    <input
      type="number"
      placeholder="Rate"
      value={item.rate}
      onChange={(e) =>
        updateItem(index, "rate", Number(e.target.value))
      }
    />
  </div>
))}
<br />


<button onClick={addItem}>
  Add Line Item
</button>

<h2>
  Total Due: R {totalAmount.toFixed(2)}
</h2>

        <button onClick={saveClient}>
          Save Client
        </button>

        <br />
        <br />

        <button onClick={createInvoice}>
          Generate PDF Invoice
        </button>
      </div>

      <div className="card">
        <h2>Client Database</h2>
        <input
  placeholder="Search Client"
  value={clientSearch}
  onChange={(e) =>
    setClientSearch(e.target.value)
  }
/>

        {clients.length === 0 ? (
          <p>No clients saved.</p>
        ) : (
          filteredClients.map((c, index) => (
            <div className="invoice" key={index}>
              <strong>{c.name}</strong>
              <p>{c.email}</p>
              <p>{c.phone}</p>

              <button
    onClick={() =>
      deleteClient(c.name)
    }
  >
    Delete Client
  </button>

            </div>
          ))
        )}
      </div>

      <div className="card">
  <h2>Invoice History</h2>
   <input
    placeholder="Search invoice or client"
    value={searchTerm}
    onChange={(e) =>
      setSearchTerm(e.target.value)
    }
  />
  <div
  style={{
    marginTop: "10px",
    marginBottom: "10px",
  }}
>
  <button
    onClick={() =>
      setHistoryFilter("All")
    }
  >
    All
  </button>

  <button
    onClick={() =>
      setHistoryFilter("Invoices")
    }
  >
    Invoices
  </button>

  <button
    onClick={() =>
      setHistoryFilter("Quotes")
    }
  >
    Quotes
  </button>

  <button
    onClick={() =>
      setHistoryFilter("Paid")
    }
  >
    Paid
  </button>

  <button
    onClick={() =>
      setHistoryFilter("Unpaid")
    }
  >
    Unpaid
  </button>

  <button
    onClick={() =>
      setHistoryFilter("Overdue")
    }
  >
    Overdue
  </button>
</div>

  {history.length === 0 ? (
    <p>No invoices yet.</p>
  ) : (
    filteredHistory.map((item, index) => (
      <div
  className="invoice"
  key={index}
  style={{
    border:
      item.status === "Unpaid" &&
      item.dueDate &&
      new Date(item.dueDate) <
        new Date()
        ? "3px solid red"
        : "1px solid #ccc",
  }}
>
        <p>
  <strong>
    {item.type || "Invoice"}
  </strong>
</p>

<strong>
  {item.invoiceNumber}
</strong>

        <p>{item.client}</p>

        <p>R {item.amount}</p>
        {item.dueDate && (
  <p>
    Due Date: {item.dueDate}
  </p>
)}

        <p
  style={{
    color:
      item.status === "Unpaid" &&
      item.dueDate &&
      new Date(item.dueDate) <
        new Date()
        ? "red"
        : "black",
    fontWeight: "bold",
  }}
>
  Status: {
    item.status === "Unpaid" &&
    item.dueDate &&
    new Date(item.dueDate) < new Date()
      ? "OVERDUE"
      : item.status
  }
</p>
        {item.convertedTo && (
  <p>
    Converted To: {item.convertedTo}
  </p>
)}

        <button
          onClick={() =>
            toggleInvoiceStatus(
              item.invoiceNumber
            )
          }
        >
          Mark Paid / Unpaid
        </button>
        <button
  onClick={() =>
    deleteInvoice(
      item.invoiceNumber
    )
  }
>
  Delete Invoice
</button>
{(
  (item.type === "Quote" ||
    item.invoiceNumber.startsWith("QUO-")) &&
  item.status !== "Converted"
) && (
  <button
    onClick={() =>
      convertQuoteToInvoice(item)
    }
  >
    Convert To Invoice
  </button>
  
)}
{item.status !== "Paid" && (
  <button
    onClick={() =>
      sendWhatsAppReminder(item)
    }
  >
    WhatsApp Reminder
  </button>
)}
<button
  onClick={() =>
    downloadInvoicePDF(item)
  }
>
  Download PDF
</button>

<button
  onClick={() =>
    emailInvoice(item)
  }
>
  Email Invoice
</button>

      </div>
    ))
  )}
</div>

    </div>
  );
}