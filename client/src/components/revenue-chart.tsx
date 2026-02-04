"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

// Dummy gym data - replace with real Firebase/Backend data later
const chartData = [
  { date: "2024-04-01", revenue: 185000, newMembers: 14 },
  { date: "2024-04-02", revenue: 192000, newMembers: 18 },
  { date: "2024-04-03", revenue: 178500, newMembers: 11 },
  { date: "2024-04-04", revenue: 210000, newMembers: 22 },
  { date: "2024-04-05", revenue: 245000, newMembers: 27 },
  { date: "2024-04-06", revenue: 238000, newMembers: 19 },
  { date: "2024-04-07", revenue: 198000, newMembers: 15 },
  { date: "2024-04-08", revenue: 265000, newMembers: 31 },
  { date: "2024-04-09", revenue: 172000, newMembers: 9  },
  { date: "2024-04-10", revenue: 215000, newMembers: 23 },
  // ... more days (you can keep your original 90+ days data)
  { date: "2024-06-28", revenue: 312000, newMembers: 28 },
  { date: "2024-06-29", revenue: 298000, newMembers: 24 },
  { date: "2024-06-30", revenue: 340000, newMembers: 35 },
]

const chartConfig = {
  revenue: {
    label: "Revenue (₹)",
    color: "hsl(152, 69%, 58%)", // nice gym-green
  },
  newMembers: {
    label: "New Members",
    color: "hsl(217, 91%, 60%)", // blue for growth
  },
} satisfies ChartConfig

export default  function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")

  // Auto-adjust default range on mobile
  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = React.useMemo(() => {
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90

    if (timeRange === "30d") daysToSubtract = 30
    if (timeRange === "7d")  daysToSubtract = 7

    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)

    return chartData.filter(item => {
      const date = new Date(item.date)
      return date >= startDate
    })
  }, [timeRange])

  return (
    <Card className="@container/card">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle>Revenue & New Members</CardTitle>
          <CardDescription>
            <span className="hidden @[540px]/card:block">
              Gym performance overview — last {timeRange === "7d" ? "7 days" : timeRange === "30d" ? "30 days" : "3 months"}
            </span>
            <span className="@[540px]/card:hidden">
              Last {timeRange === "7d" ? "7d" : timeRange === "30d" ? "30d" : "90d"}
            </span>
          </CardDescription>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Desktop toggle buttons */}
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden sm:flex"
          >
            <ToggleGroupItem value="90d">90 days</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">7 days</ToggleGroupItem>
          </ToggleGroup>

          {/* Mobile friendly dropdown */}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px] sm:hidden" size="sm">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[260px] sm:h-[320px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.9} />
                <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillNewMembers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-newMembers)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-newMembers)" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-IN", { 
                  month: "short", 
                  day: "numeric" 
                })
              }}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })
                  }}
                  valueFormatter={(value, name) => {
                    if (name === "revenue") {
                      return `₹${Number(value).toLocaleString("en-IN")}`
                    }
                    return `${value} new members`
                  }}
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="revenue"
              type="natural"
              fill="url(#fillRevenue)"
              stroke="var(--color-revenue)"
              stackId="a"
              name="revenue"
            />
            <Area
              dataKey="newMembers"
              type="natural"
              fill="url(#fillNewMembers)"
              stroke="var(--color-newMembers)"
              stackId="b"
              name="newMembers"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}