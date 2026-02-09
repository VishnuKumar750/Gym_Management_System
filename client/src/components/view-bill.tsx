import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Download, Eye } from "lucide-react";
import type { IBill } from "@/types/bill.types";

type Props = {
  bill: IBill;
};

export default function Bill({ bill }: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} className="w-full justify-start">
          <Eye className="w-4 h-4" />
          View Bill
        </Button>
      </SheetTrigger>

      <SheetContent className="overflow-auto">
        <SheetHeader>
          <SheetTitle>Bill Details</SheetTitle>
          <SheetDescription>
            Bill No. {bill?.billNumber ?? "--"}
          </SheetDescription>
        </SheetHeader>

        {bill && (
          <>
            {/* INVOICE CONTENT */}
            <div id="invoice-print" className="px-4 space-y-6 ">
              {/* Header */}
              <div className="flex justify-between">
                <div>
                  <h2 className="font-semibold text-lg">Invoice</h2>
                  <p className="text-sm text-muted-foreground">
                    Bill No: {bill.billNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Date:{" "}
                    {bill.paymentDate
                      ? new Date(bill.paymentDate).toLocaleDateString()
                      : ""}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-medium">{bill.memberId.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {bill.memberId.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {bill.memberId.phone}
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
                    <td className="border p-2">{bill.packageId.packageName}</td>
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
                        {bill.taxAmount}%
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

              {/* Payment Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Payment Method:</span>{" "}
                  {bill.paymentMethod ? bill.paymentMethod.toUpperCase() : "-"}
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
              {/* ACTIONS */}
              <Button
                className="w-full mt-6 "
                onClick={() => printInvoice("invoice-print")}
              >
                <Download className="h-4 w-4 mr-2" />
                Download / Print Invoice
              </Button>
            </div>
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
