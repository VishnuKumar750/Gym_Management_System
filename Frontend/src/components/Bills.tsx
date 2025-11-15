import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";

const gymBills = [
  {
    id: "B001",
    dateISO: "2025-11-01",
    date: "Nov 01, 2025",
    plan: "Regular",
    paymentStatus: "Paid",
    amount: 499,
    currency: "INR",
    invoiceNumber: "INV-2025-0001",
    invoiceUrl: "/invoices/INV-2025-0001.pdf",
    downloadFileName: "INV-2025-0001.pdf"
  },
  {
    id: "B002",
    dateISO: "2025-11-03",
    date: "Nov 03, 2025",
    plan: "Premium",
    paymentStatus: "Paid",
    amount: 999,
    currency: "INR",
    invoiceNumber: "INV-2025-0002",
    invoiceUrl: "/invoices/INV-2025-0002.pdf",
    downloadFileName: "INV-2025-0002.pdf"
  },
  {
    id: "B003",
    dateISO: "2025-10-28",
    date: "Oct 28, 2025",
    plan: "Exclusive",
    paymentStatus: "Pending",
    amount: 1999,
    currency: "INR",
    invoiceNumber: "INV-2025-0003",
    invoiceUrl: "/invoices/INV-2025-0003.pdf",
    downloadFileName: "INV-2025-0003.pdf"
  },
  {
    id: "B004",
    dateISO: "2025-10-15",
    date: "Oct 15, 2025",
    plan: "Regular",
    paymentStatus: "Overdue",
    amount: 499,
    currency: "INR",
    invoiceNumber: "INV-2025-0004",
    invoiceUrl: "/invoices/INV-2025-0004.pdf",
    downloadFileName: "INV-2025-0004.pdf"
  },
  {
    id: "B005",
    dateISO: "2025-09-30",
    date: "Sep 30, 2025",
    plan: "Premium",
    paymentStatus: "Paid",
    amount: 999,
    currency: "INR",
    invoiceNumber: "INV-2025-0005",
    invoiceUrl: "/invoices/INV-2025-0005.pdf",
    downloadFileName: "INV-2025-0005.pdf"
  },
  {
    id: "B006",
    dateISO: "2025-09-05",
    date: "Sep 05, 2025",
    plan: "Exclusive",
    paymentStatus: "Failed",
    amount: 1999,
    currency: "INR",
    invoiceNumber: "INV-2025-0006",
    invoiceUrl: "/invoices/INV-2025-0006.pdf",
    downloadFileName: "INV-2025-0006.pdf"
  },
  {
    id: "B007",
    dateISO: "2025-08-20",
    date: "Aug 20, 2025",
    plan: "Regular",
    paymentStatus: "Paid",
    amount: 499,
    currency: "INR",
    invoiceNumber: "INV-2025-0007",
    invoiceUrl: "/invoices/INV-2025-0007.pdf",
    downloadFileName: "INV-2025-0007.pdf"
  },
  {
    id: "B008",
    dateISO: "2025-07-11",
    date: "Jul 11, 2025",
    plan: "Premium",
    paymentStatus: "Paid",
    amount: 999,
    currency: "INR",
    invoiceNumber: "INV-2025-0008",
    invoiceUrl: "/invoices/INV-2025-0008.pdf",
    downloadFileName: "INV-2025-0008.pdf"
  },
  {
    id: "B009",
    dateISO: "2025-06-01",
    date: "Jun 01, 2025",
    plan: "Exclusive",
    paymentStatus: "Paid",
    amount: 1999,
    currency: "INR",
    invoiceNumber: "INV-2025-0009",
    invoiceUrl: "/invoices/INV-2025-0009.pdf",
    downloadFileName: "INV-2025-0009.pdf"
  },
  {
    id: "B010",
    dateISO: "2025-05-20",
    date: "May 20, 2025",
    plan: "Regular",
    paymentStatus: "Pending",
    amount: 499,
    currency: "INR",
    invoiceNumber: "INV-2025-0010",
    invoiceUrl: "/invoices/INV-2025-0010.pdf",
    downloadFileName: "INV-2025-0010.pdf"
  },
  {
    id: "B011",
    dateISO: "2025-04-14",
    date: "Apr 14, 2025",
    plan: "Premium",
    paymentStatus: "Paid",
    amount: 999,
    currency: "INR",
    invoiceNumber: "INV-2025-0011",
    invoiceUrl: "/invoices/INV-2025-0011.pdf",
    downloadFileName: "INV-2025-0011.pdf"
  },
  {
    id: "B012",
    dateISO: "2025-03-02",
    date: "Mar 02, 2025",
    plan: "Exclusive",
    paymentStatus: "Overdue",
    amount: 1999,
    currency: "INR",
    invoiceNumber: "INV-2025-0012",
    invoiceUrl: "/invoices/INV-2025-0012.pdf",
    downloadFileName: "INV-2025-0012.pdf"
  },
  {
    id: "B013",
    dateISO: "2025-02-18",
    date: "Feb 18, 2025",
    plan: "Regular",
    paymentStatus: "Paid",
    amount: 499,
    currency: "INR",
    invoiceNumber: "INV-2025-0013",
    invoiceUrl: "/invoices/INV-2025-0013.pdf",
    downloadFileName: "INV-2025-0013.pdf"
  },
  {
    id: "B014",
    dateISO: "2025-01-06",
    date: "Jan 06, 2025",
    plan: "Premium",
    paymentStatus: "Paid",
    amount: 999,
    currency: "INR",
    invoiceNumber: "INV-2025-0014",
    invoiceUrl: "/invoices/INV-2025-0014.pdf",
    downloadFileName: "INV-2025-0014.pdf"
  },
  {
    id: "B015",
    dateISO: "2024-12-25",
    date: "Dec 25, 2024",
    plan: "Exclusive",
    paymentStatus: "Paid",
    amount: 1999,
    currency: "INR",
    invoiceNumber: "INV-2024-0015",
    invoiceUrl: "/invoices/INV-2024-0015.pdf",
    downloadFileName: "INV-2024-0015.pdf"
  }
];


const Bills = () => {
  return (
    <div className="">
        <h1 className="text-5xl font-bold my-4 dark:text-white">Bills</h1>
        <BillsTable bills={gymBills} />
    </div>
  )
}


function BillsTable({ bills = [] }) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 dark:text-white p-4">
      <Table>
        <TableHeader className="bg-neutral-200 dark:bg-neutral-700 ">
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-center">Invoice</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {bills.map((b) => (
            <TableRow key={b.id}>
              <TableCell>{b.date}</TableCell>
              <TableCell>{b.plan}</TableCell>

              <TableCell>
                <StatusBadge status={b.paymentStatus} />
              </TableCell>

              <TableCell className="text-right">
                {b.currency} {b.amount}
              </TableCell>

              <TableCell className="text-center">
                <a href={b.invoiceUrl} download={b.downloadFileName}>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function StatusBadge({ status }) {
  const variants = {
    Paid: "bg-green-600 hover:bg-green-700 text-white",
    Pending: "bg-yellow-500 hover:bg-yellow-600 text-black",
    Overdue: "bg-red-600 hover:bg-red-700 text-white",
    Failed: "bg-neutral-600 hover:bg-neutral-700 text-white",
  };

  return (
    <Badge className={variants[status] || "bg-neutral-400"}>
      {status}
    </Badge>
  );
}


export default Bills
