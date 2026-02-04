// components/dashboard/pending-bills-renewals.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"

// Type definition (you can move this to types file later)
type BillStatus = "overdue" | "upcoming" | "paid" | "pending"

interface PendingBill {
  memberName: string
  packageType: string
  amount?: number
  status: BillStatus
  daysInfo: string          // e.g. "4 days overdue", "Renewal in 6 days", "Paid Today"
}

interface PendingBillsRenewalsProps {
  bills: PendingBill[]
  title?: string
  maxItems?: number
}

export default function PendingBillsRenewals({
  bills,
  title = "Pending Bills & Renewals",
  maxItems = 5,
}: PendingBillsRenewalsProps) {
  // Get badge variant based on status
  const getBadgeVariant = (status: BillStatus) => {
    switch (status) {
      case "overdue":
        return "destructive"
      case "upcoming":
        return "secondary"
      case "paid":
        return "default"
      case "pending":
        return "outline"
      default:
        return "secondary"
    }
  }

  // Optional: format amount with Indian Rupee
  const formatAmount = (amount?: number) => {
    if (!amount) return ""
    return `₹${amount.toLocaleString("en-IN")}`
  }

  // Show only up to maxItems
  const displayedBills = bills.slice(0, maxItems)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-emerald-600" />
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {displayedBills.length > 0 ? (
          displayedBills.map((bill, index) => (
            <div
              key={`${bill.memberName}-${index}`}
              className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0"
            >
              <div>
                <p className="font-medium">{bill.memberName}</p>
                <p className="text-sm text-muted-foreground">
                  {bill.packageType}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {bill.amount && bill.status !== "paid" && (
                  <span className="text-sm font-medium text-muted-foreground">
                    {formatAmount(bill.amount)}
                  </span>
                )}
                <Badge variant={getBadgeVariant(bill.status)}>
                  {bill.daysInfo}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No pending bills or upcoming renewals
          </div>
        )}

        {bills.length > maxItems && (
          <div className="text-center pt-2">
            <button className="text-sm text-primary hover:underline">
              View all {bills.length} items →
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}