"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { day: "Mon", sol: 0.2 },
  { day: "Tue", sol: 0.35 },
  { day: "Wed", sol: 0.12 },
  { day: "Thu", sol: 0.55 },
  { day: "Fri", sol: 0.28 },
  { day: "Sat", sol: 0.72 },
  { day: "Sun", sol: 0.41 },
];

const recent = [
  { from: "pixelpup", amount: "0.20", message: "Sprinkles for days!" },
  { from: "coffeechris", amount: "0.05", message: "Loved the latest track ☕️" },
  { from: "mosscat", amount: "0.12", message: "Keep going!" },
];

export default function DashboardPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 py-10 grid gap-6">
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Donuts this week</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-extrabold">
              2.63 SOL
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Total supporters</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-extrabold">1,248</CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Avg per tip</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-extrabold">
              0.19 SOL
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Weekly SOL inflow</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="strawberry" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(0,0,0,0.05)"
                />
                <XAxis dataKey="day" stroke="currentColor" />
                <YAxis stroke="currentColor" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="sol"
                  stroke="var(--chart-1)"
                  fill="url(#strawberry)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Tabs defaultValue="recent">
          <TabsList>
            <TabsTrigger value="recent">Recent donations</TabsTrigger>
            <TabsTrigger value="top">Top fans</TabsTrigger>
          </TabsList>
          <TabsContent value="recent">
            <Card className="rounded-2xl">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From</TableHead>
                      <TableHead>Amount (SOL)</TableHead>
                      <TableHead>Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recent.map((r) => (
                      <TableRow key={r.from}>
                        <TableCell>@{r.from}</TableCell>
                        <TableCell>{r.amount}</TableCell>
                        <TableCell>{r.message}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="top">
            <Card className="rounded-2xl">
              <CardContent className="p-6 text-muted-foreground">
                Top fans module coming soon.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
