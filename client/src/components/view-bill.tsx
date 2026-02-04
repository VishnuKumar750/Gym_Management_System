import api from "@/axios/axios-api";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Download, Eye, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const getBillById = async (billId: string) => {
  const res = await api.get(`/bills/${billId}`, {
    withCredentials: true,
  });
  console.log("bill data", res.data.data);
  const bill = res.data.data;
  return bill;
};

interface Props {
  billId: string;
}

export default function Bill({ billId }: Props) {
  const {
    data: bill,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bill", billId],
    queryFn: () => getBillById(billId),
    enabled: !!billId,
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} className="w-full justify-start">
          <Eye className="w-4 h-4" />
          View Bill
        </Button>
      </SheetTrigger>

      <SheetContent className="px-4">
        <SheetHeader>
          <SheetTitle>Bill Details</SheetTitle>
          <SheetDescription>
            Bill No. {bill?.billNumber ?? "--"}
          </SheetDescription>
        </SheetHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}

        {isError && (
          <p className="text-sm text-destructive">
            Failed to load bill details
          </p>
        )}

        {bill && (
          <>
            {/* INVOICE CONTENT */}
            <div id="invoice-print" className="mt-6 space-y-6 ">
              {/* Header */}
              <div className="flex justify-between">
                <div>
                  <h2 className="font-semibold text-lg">Invoice</h2>
                  <p className="text-sm text-muted-foreground">
                    Bill No: {bill.billNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Date: {new Date(bill.paymentDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-medium">{bill.member.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {bill.member.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {bill.member.phone}
                  </p>
                </div>
              </div>

              {/* Package Details */}
              <table className="w-full border-collapse border">
                <thead>
                  <tr>
                    <th className="border p-2 text-left">Description</th>
                    <th className="border p-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">{bill.package.packageName}</td>
                    <td className="border p-2 text-right">₹{bill.amount}</td>
                  </tr>

                  {bill.discount > 0 && (
                    <tr>
                      <td className="border p-2">Discount</td>
                      <td className="border p-2 text-right">
                        −₹{bill.discount}
                      </td>
                    </tr>
                  )}

                  {bill.taxAmount > 0 && (
                    <tr>
                      <td className="border p-2">Tax</td>
                      <td className="border p-2 text-right">
                        +₹{bill.taxAmount}
                      </td>
                    </tr>
                  )}

                  <tr className="font-semibold">
                    <td className="border p-2">Total</td>
                    <td className="border p-2 text-right">
                      ₹{bill.finalAmount}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Validity */}
              <div className="text-sm text-muted-foreground">
                Valid from {new Date(bill.validFrom).toLocaleDateString()} to{" "}
                {new Date(bill.validUntil).toLocaleDateString()}
              </div>

              {/* Payment Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Payment Method:</span>{" "}
                  {bill.paymentMethod.toUpperCase()}
                </div>
                <div>
                  <span className="font-medium">Status:</span>{" "}
                  {bill.status.toUpperCase()}
                </div>
              </div>

              {bill.remarks && (
                <p className="text-sm">
                  <span className="font-medium">Remarks:</span> {bill.remarks}
                </p>
              )}
            </div>

            {/* ACTIONS */}
            <Button
              className="w-full mt-6 "
              onClick={() => printInvoice("invoice-print")}
            >
              <Download className="h-4 w-4 mr-2" />
              Download / Print Invoice
            </Button>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

// utils/printInvoice.ts
const printInvoice = (elementId: string) => {
  const content = document.getElementById(elementId);
  if (!content) return;

  const printWindow = window.open("", "", "width=900,height=650");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; }
          th { background: #f5f5f5; text-align: left; }
        </style>
      </head>
      <body>
        ${content.innerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};
