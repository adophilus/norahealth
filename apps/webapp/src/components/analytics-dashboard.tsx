"use client"

import { useState, useMemo } from "react"
import { Eye, Heart, MessageCircle, BarChart3 } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d")
  const [_selectedChannel, _setSelectedChannel] = useState<string | null>(null)

  // Mock analytics data
  const mockTrendData = [
    { date: "Jan 1", impressions: 2400, engagements: 240, Farcaster: 1200, Instagram: 900, Facebook: 300 },
    { date: "Jan 8", impressions: 3210, engagements: 321, Farcaster: 1600, Instagram: 1100, Facebook: 510 },
    { date: "Jan 15", impressions: 2290, engagements: 229, Farcaster: 1400, Instagram: 800, Facebook: 90 },
    { date: "Jan 22", impressions: 2000, engagements: 200, Farcaster: 1200, Instagram: 600, Facebook: 200 },
    { date: "Jan 29", impressions: 2181, engagements: 218, Farcaster: 1300, Instagram: 700, Facebook: 181 },
  ]

  const mockChannelBreakdown = [
    { name: "Farcaster", value: 45, color: "#3b82f6" },
    { name: "Instagram", value: 30, color: "#ec4899" },
    { name: "Facebook", value: 15, color: "#1e40af" },
    { name: "BaseApp", value: 10, color: "#1e3a8a" },
  ]

  const stats = [
    { label: "Total Impressions", value: "24,582", change: "+12.5%", icon: Eye, trend: "up" },
    { label: "Total Engagements", value: "3,421", change: "+8.2%", icon: Heart, trend: "up" },
    { label: "Comments & Shares", value: "542", change: "+5.1%", icon: MessageCircle, trend: "up" },
    { label: "Avg Engagement Rate", value: "14.2%", change: "+2.1%", icon: BarChart3, trend: "up" },
  ]

  const recentPosts = [
    {
      id: 1,
      content: "Excited to announce our new feature launch! 🚀",
      channels: ["Farcaster", "BaseApp"],
      impressions: 2400,
      engagements: 420,
      likes: 320,
      comments: 85,
      shares: 15,
      date: "2 hours ago",
    },
    {
      id: 2,
      content: "Big announcement coming next week. Stay tuned!",
      channels: ["Farcaster", "Instagram"],
      impressions: 3200,
      engagements: 680,
      likes: 520,
      comments: 120,
      shares: 40,
      date: "5 hours ago",
    },
    {
      id: 3,
      content: "Join our community discord for exclusive updates",
      channels: ["Facebook", "Instagram"],
      impressions: 1800,
      engagements: 250,
      likes: 180,
      comments: 45,
      shares: 25,
      date: "1 day ago",
    },
  ]

  const topPerformingPosts = useMemo(() => {
    return [...recentPosts].sort((a, b) => b.engagements - a.engagements).slice(0, 3)
  }, [])

  const channelStats = [
    {
      channel: "Farcaster",
      impressions: 11062,
      engagements: 1545,
      rate: "13.9%",
      color: "bg-blue-500",
    },
    {
      channel: "Instagram",
      impressions: 7374,
      engagements: 1265,
      rate: "17.1%",
      color: "bg-pink-500",
    },
    {
      channel: "Facebook",
      impressions: 3681,
      engagements: 410,
      rate: "11.1%",
      color: "bg-blue-700",
    },
    {
      channel: "BaseApp",
      impressions: 2465,
      engagements: 201,
      rate: "8.1%",
      color: "bg-blue-600",
    },
  ]

  return (
    <div className="h-full overflow-auto bg-background p-4 md:p-8">
      <div className="max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Analytics</h2>
            <p className="text-sm md:text-base text-muted-foreground">Track your content performance across all channels</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["7d", "30d", "90d"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  timeRange === range
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {range === "7d" ? "7D" : range === "30d" ? "30D" : "90D"}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-card rounded-lg border border-border p-4 md:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-green-500">{stat.change}</span>
                </div>
                <p className="text-muted-foreground text-xs md:text-sm mb-1">{stat.label}</p>
                <p className="text-xl md:text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Trend Chart */}
          <div className="lg:col-span-2 bg-card rounded-lg border border-border p-4 md:p-6">
            <h3 className="text-base md:text-lg font-bold text-foreground mb-6">Engagement Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={mockTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                  labelStyle={{ color: "var(--color-foreground)" }}
                />
                <Legend />
                <Line type="monotone" dataKey="impressions" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="engagements" stroke="#ec4899" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Channel Breakdown */}
          <div className="bg-card rounded-lg border border-border p-4 md:p-6">
            <h3 className="text-base md:text-lg font-bold text-foreground mb-6">By Channel</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={mockChannelBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {mockChannelBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {mockChannelBreakdown.map((channel) => (
                <div key={channel.name} className="flex items-center justify-between text-xs md:text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: channel.color }} />
                    <span className="text-muted-foreground">{channel.name}</span>
                  </div>
                  <span className="font-semibold text-foreground">{channel.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Channel Performance Table */}
        <div className="bg-card rounded-lg border border-border p-4 md:p-6 mb-8">
          <h3 className="text-base md:text-lg font-bold text-foreground mb-6">Channel Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 md:px-4 font-semibold text-muted-foreground">Channel</th>
                  <th className="text-right py-3 px-2 md:px-4 font-semibold text-muted-foreground">Impressions</th>
                  <th className="text-right py-3 px-2 md:px-4 font-semibold text-muted-foreground">Engagements</th>
                  <th className="text-right py-3 px-2 md:px-4 font-semibold text-muted-foreground">Rate</th>
                </tr>
              </thead>
              <tbody>
                {channelStats.map((stat) => (
                  <tr key={stat.channel} className="border-b border-border hover:bg-secondary transition">
                    <td className="py-3 px-2 md:px-4">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${stat.color}`} />
                        <span className="font-medium text-foreground">{stat.channel}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 md:px-4 text-right text-foreground">{stat.impressions.toLocaleString()}</td>
                    <td className="py-3 px-2 md:px-4 text-right text-foreground font-semibold">
                      {stat.engagements.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 md:px-4 text-right">
                      <span className="px-2 md:px-3 py-1 bg-primary/10 text-primary rounded-full text-xs md:text-sm font-semibold">
                        {stat.rate}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performing Posts */}
        <div className="bg-card rounded-lg border border-border p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-foreground mb-6">Top Performing Posts</h3>
          <div className="space-y-4">
            {topPerformingPosts.map((post) => (
              <div key={post.id} className="p-3 md:p-4 border border-border rounded-lg hover:bg-secondary transition">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                  <p className="text-sm md:text-base text-foreground font-medium flex-1">{post.content}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{post.date}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.channels.map((channel) => (
                    <span key={channel} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      {channel}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
                  <div className="bg-secondary rounded p-2 md:p-3">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Eye className="w-3 h-3 md:w-4 md:h-4" />
                      Impressions
                    </p>
                    <p className="font-bold text-sm md:text-base text-foreground">{post.impressions.toLocaleString()}</p>
                  </div>
                  <div className="bg-secondary rounded p-2 md:p-3">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Heart className="w-3 h-3 md:w-4 md:h-4" />
                      Likes
                    </p>
                    <p className="font-bold text-sm md:text-base text-foreground">{post.likes.toLocaleString()}</p>
                  </div>
                  <div className="bg-secondary rounded p-2 md:p-3">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
                      Comments
                    </p>
                    <p className="font-bold text-sm md:text-base text-foreground">{post.comments.toLocaleString()}</p>
                  </div>
                  <div className="bg-secondary rounded p-2 md:p-3 sm:col-span-2 lg:col-span-1">
                    <p className="text-xs text-muted-foreground mb-1">Engagement</p>
                    <p className="font-bold text-sm md:text-base text-foreground">
                      {((post.engagements / post.impressions) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
