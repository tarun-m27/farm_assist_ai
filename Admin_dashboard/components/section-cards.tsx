"use client"

import * as React from "react"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  const [metrics, setMetrics] = React.useState<{
    totalRevenue: number
    totalUsers: number
    apiUsers: number
    growthRate: number
  } | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/admin/dashboard", {
          method: "GET", // Assuming GET method; adjust if different
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken") || ""}`, // Send jwtToken as Bearer Token
          },
        });
        const data = await response.json()

        if (data.success && data.metrics) {
          setMetrics(data.metrics)
        } else {
          throw new Error("Invalid metrics data")
        }
      } catch (err) {
        console.error("Error fetching metrics:", err)
        setError("Failed to load dashboard metrics")
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  if (loading) {
    return (
      <div className="px-4 lg:px-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
        <div className="animate-pulse text-center py-8">Loading dashboard...</div>
      </div>
    )
  }

  if (error || !metrics) {
    return (
      <div className="px-4 lg:px-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
        <div className="text-center text-destructive py-8">{error || "Error loading metrics"}</div>
      </div>
    )
  }

  return (
    <div className="px-4 lg:px-6">
      <h1 className="text-3xl font-bold mb-6 ml-6">Dashboard Overview</h1>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        
        {/* Total Revenue */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              ₹{metrics.totalRevenue.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +12.5%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Trending up this month <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>

        {/* New Customers */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {metrics.totalUsers}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +8.3%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Growing customer base <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Acquisition trend positive
            </div>
          </CardFooter>
        </Card>

        {/* API Users */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Active API Users</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {metrics.apiUsers}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingDown />
                -5%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Minor drop observed <IconTrendingDown className="size-4" />
            </div>
            <div className="text-muted-foreground">
              API engagement needs focus
            </div>
          </CardFooter>
        </Card>

        {/* Growth Rate */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Growth Rate</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {metrics.growthRate}%
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {metrics.growthRate >= 0 ? (
                  <>
                    <IconTrendingUp />
                    +{metrics.growthRate}%
                  </>
                ) : (
                  <>
                    <IconTrendingDown />
                    {metrics.growthRate}%
                  </>
                )}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {metrics.growthRate >= 0 ? (
                <>
                  Steady performance increase <IconTrendingUp className="size-4" />
                </>
              ) : (
                <>
                  Performance decline <IconTrendingDown className="size-4" />
                </>
              )}
            </div>
            <div className="text-muted-foreground">
              {metrics.growthRate >= 0
                ? "Meets growth projections"
                : "Needs strategy adjustment"}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}