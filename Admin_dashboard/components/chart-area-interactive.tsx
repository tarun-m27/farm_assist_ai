"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
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

export const description = "An interactive area chart showing hourly request counts"

// Updated chart config for website and api instead of desktop/mobile
const chartConfig = {
  requests: {
    label: "Requests",
  },
  website: {
    label: "Website",
    color: "var(--primary)",
  },
  api: {
    label: "API",
    color: "var(--secondary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [hourlyData, setHourlyData] = React.useState<Array<{
    hr: number
    website: number
    api: number
  }> | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch data from your endpoint
  React.useEffect(() => {
    const fetchHourlyData = async () => {
      try {
        // const response = await fetch('http://localhost:8000/api/admin/graph') // Adjust endpoint as needed
        // if (!response.ok) {
        //   throw new Error('Failed to fetch hourly request data')
        // }
        
        const response = await fetch('http://localhost:8000/api/admin/graph', {
          method: 'GET', // Assuming GET method; adjust if different
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("jwtToken") || ""}`, // Send jwtToken as Bearer Token
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch hourly request data');
        }

        const data = await response.json()
        setHourlyData(data.hourlyData)
      } catch (err) {
        console.error('Error fetching hourly data:', err)
        setError('Failed to load request data')
      } finally {
        setLoading(false)
      }
    }

    fetchHourlyData()
  }, [])

  // Format the data for the chart
  const chartData = React.useMemo(() => {
    if (!hourlyData) return []

    return hourlyData.map(hour => ({
      // Convert hour to time string (e.g., "12 AM", "1 AM")
      hour: `${hour.hr % 12 === 0 ? 12 : hour.hr % 12} ${hour.hr < 12 ? 'AM' : 'PM'}`,
      hourValue: hour.hr, // Numeric value for sorting
      website: hour.website,
      api: hour.api,
      // Add total for tooltips if needed
      total: hour.website + hour.api
    }))
  }, [hourlyData])

  if (loading) {
    return (
      <div className="px-4 lg:px-6">
        <h1 className="text-3xl font-bold mb-6">Request Analytics Dashboard</h1>
        <Card>
          <CardHeader>
            <CardTitle>Request Analytics</CardTitle>
            <CardDescription>Loading hourly request data...</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center">
            <div className="animate-pulse">Loading chart...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 lg:px-6">
        <h1 className="text-3xl font-bold mb-6">Request Analytics Dashboard</h1>
        <Card>
          <CardHeader>
            <CardTitle>Request Analytics</CardTitle>
            <CardDescription>Error loading data</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center text-destructive">
            {error}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="px-4 lg:px-6">
      <h1 className="text-3xl font-bold mb-6">Request Analytics Graph</h1>
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Hourly Request Analytics of Today</CardTitle>
          <CardDescription>
            Breakdown of website and API requests by hour (IST)
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillWebsite" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-website)"
                    stopOpacity={1.0}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-website)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillApi" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-api)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-api)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="hour"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24} // Fewer ticks for hourly data
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return `${value} (IST)`
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="api"
                type="natural"
                fill="url(#fillApi)"
                stroke="var(--color-api)"
                stackId="a"
              />
              <Area
                dataKey="website"
                type="natural"
                fill="url(#fillWebsite)"
                stroke="var(--color-website)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}