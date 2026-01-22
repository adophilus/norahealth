"use client"

import { useState } from "react"
import { Send, Plus, X, AlertCircle, CheckCircle } from "lucide-react"
import { createPost } from "@/lib/services/post-service"
import type { Channel } from "@/lib/services/types"

interface ScheduledPost {
  id: string
  content: string
  scheduledFor: Date | null
  status: "draft" | "scheduled" | "published"
}

export default function ComposeModule() {
  const [content, setContent] = useState("")
  const [selectedChannels, setSelectedChannels] = useState<Channel[]>([])
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("09:00")
  const [showScheduler, setShowScheduler] = useState(false)
  const [drafts, setDrafts] = useState<ScheduledPost[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  const channels: Array<{ id: Channel; name: string; color: string }> = [
    { id: "baseapp", name: "BaseApp", color: "bg-blue-600" },
    { id: "facebook", name: "Facebook", color: "bg-blue-700" },
    { id: "instagram", name: "Instagram", color: "bg-pink-500" },
  ]

  const toggleChannel = (channelId: Channel) => {
    setSelectedChannels((prev) =>
      prev.includes(channelId) ? prev.filter((id) => id !== channelId) : [...prev, channelId],
    )
  }

  const showMessageAndReset = (type: "success" | "error", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  const handlePost = async () => {
    if (!content.trim() || selectedChannels.length === 0) {
      showMessage("error", "Please write content and select at least one channel")
      return
    }

    setLoading(true)
    try {
      const scheduledFor = scheduleDate ? new Date(`${scheduleDate}T${scheduleTime}`) : null

      const newDraft: ScheduledPost = {
        id: `draft_${Date.now()}`,
        content,
        channels: selectedChannels,
        scheduledFor,
        status: "draft",
      }

      const createdDrafts = selectedChannels.length > 1
        ? selectedChannels.map((channel) => ({
            id: `draft_${Date.now()}_${channel.id}`,
            content,
            channels: [channel],
            scheduledFor,
            status: "draft",
          }))
        : [
            {
              id: `draft_${Date.now()}`,
              content,
              channels: selectedChannels,
              scheduledFor,
              status: "draft",
            }
          ]

      setDrafts((prev) => [...createdDrafts, ...prev])

      if (scheduledFor) {
        await Promise.all(
          createdDrafts.map((draft) =>
            createPost("user123", draft.content, [draft.channel], draft.scheduledFor)
          )
        )
      } else {
        await createPost("user123", content, selectedChannels, null)
      }

      setContent("")
      setSelectedChannels([])
      setScheduleDate("")
      setShowScheduler(false)
      showMessageAndReset("success", scheduledFor ? "Post scheduled successfully!" : "Post published!")
    } catch (error) {
      console.error("Error posting:", error)
      showMessageAndReset("error", error instanceof Error ? error.message : "Failed to create post. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const saveDraft = () => {
    if (!content.trim()) {
      showMessage("error", "Cannot save empty draft")
      return
    }

    const newDraft: ScheduledPost = {
      id: `draft_${Date.now()}`,
      content,
      channels: selectedChannels,
      scheduledFor: null,
      status: "draft",
    }

    setDrafts((prev) => [newDraft, ...prev])
    setContent("")
    showMessageAndReset("success", "Draft saved!")
  }

  const removeDraft = (id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id))
  }

  const getCharacterCountByChannel = () => {
    const limits: Record<Channel, number> = {
      baseapp: 300,
      facebook: 63206,
      instagram: 2200,
    }

    const issues: string[] = []
    selectedChannels.forEach((channel) => {
      if (content.length > limits[channel]) {
        issues.push(`${channel}: ${content.length}/${limits[channel]} characters`)
      }
    })

    return issues
  }

  const characterIssues = getCharacterCountByChannel()
  const isValid = content.trim().length > 0 && selectedChannels.length > 0 && characterIssues.length === 0

  return (
    <div className="h-full overflow-auto bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h2 className="text-3xl font-bold text-foreground">Create & Compose</h2>
          <p className="text-base text-muted-foreground">Write once, post everywhere across your channels</p>
        </div>

        <div className="flex gap-6 mb-6">
          <div className="flex-1 w-full max-w-3xl border border-border rounded-2xl bg-card p-6 md:p-8">
            <label className="block text-sm font-semibold text-foreground mb-3">Your Message</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind? Write your content here..."
              className="w-full h-32 md:h-40 resize-none bg-secondary border border-border rounded-lg px-3 py-2 text-foreground placeholder-muted-foreground transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 text-sm md:text-base"
            />

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-3">
              <p className="text-xs text-muted-foreground">{content.length} characters</p>
              {characterIssues.length > 0 && (
                <div className="text-xs text-destructive space-y-1">
                  {characterIssues.map((issue) => (
                    <div key={issue}>{issue}</div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-1 lg:col-span-3 space-y-6">
                <label className="block text-sm font-semibold text-foreground mb-4">Select Channels</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {channels.map((channel) => {
                    const isSelected = selectedChannels.includes(channel.id)
                    return (
                      <button
                        key={channel.id}
                        onClick={() => toggleChannel(channel.id)}
                        className={`p-3 md:p-4 rounded-lg border-2 transition-all text-left text-sm md:text-base ${
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border bg-secondary hover:border-muted-foreground"
                        }`}
                      >
                        <div className={`w-6 h-6 rounded ${channel.color} mb-2`} />
                        <p className="text-sm font-medium text-foreground">{channel.name}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {selectedChannels.length === 0 && (
                <p className="text-xs text-destructive mt-3">Select at least one channel</p>
              )}
            </div>

            <div className="col-span-1 lg:col-span-2 space-y-6">
              <label className="block text-sm font-semibold text-foreground mb-4">Schedule (Optional)</label>
              <button
                onClick={() => setShowScheduler(!showScheduler)}
                className="text-xs text-primary hover:text-primary/80 transition"
              >
                {showScheduler ? "Clear" : "Add Schedule"}
              </button>
            </div>

            {showScheduler && (
              <div className="flex gap-3 flex-col sm:flex-row">
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-foreground transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 text-sm"
                />
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-foreground transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 text-sm"
                />
              </div>
              )}

            {scheduleDate && (
              <p className="text-xs text-muted-foreground mt-3">
                Scheduled for {new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString()}
              </p>
            )}
          </div>

          <div className="col-span-1 lg:col-span-3">
            <button
              onClick={handlePost}
              disabled={!isValid || loading}
              className={`flex-1 px-4 py-2 md:py-3 rounded-lg bg-primary text-primary-foreground font-medium transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2 text-sm md:text-base ${
                loading || !isValid ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Send className="w-4 h-4" />
              {loading ? "Processing..." : scheduleDate ? "Schedule Post" : "Post Now"}
            </button>
            <button
              onClick={saveDraft}
              className="flex-1 px-4 py-2 md:py-3 rounded-lg bg-secondary text-foreground border border-border font-medium transition-all hover:bg-secondary/80 active:scale-95 flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Plus className="w-4 h-4" />
              Save Draft
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-semibold text-foreground mb-4">Drafts & Scheduled</h3>
            {drafts.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">
                No drafts yet. Create one to get started!
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {drafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="p-3 bg-secondary rounded-lg border border-border hover:border-muted-foreground transition"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-xs font-semibold text-foreground truncate flex-1">
                        {draft.content.substring(0, 30)}...
                      </p>
                      <button
                        onClick={() => removeDraft(draft.id)}
                        className="text-muted-foreground hover:text-foreground transition flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {draft.channels.map((ch) => (
                        <span key={ch} className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                          {ch}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {draft.status === "draft"
                        ? "Draft"
                        : draft.scheduledFor
                          ? `Scheduled for ${draft.scheduledFor.toLocaleDateString()}`
                          : "Published"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 order-last lg:order-none h-fit">
          <div className="bg-card rounded-lg border border-border p-4 md:p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Use the Compose module to schedule posts for your Base App channels</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <X className="w-4 h-4 text-orange-500" />
                <span>Composing directly from this UI is temporarily disabled</span>
              </div>
            </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 order-last lg:order-none h-fit">
          <div className="bg-card rounded-lg border border-border p-4 md:p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Channel Status</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <div>
                  <p className="font-medium">Base App</p>
                  <p className="text-xs text-muted-foreground">Connected and ready</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="font-medium">Farcaster</p>
                  <p className="text-xs text-muted-foreground">SIWN integration in progress</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="font-medium">Facebook</p>
                  <p className="text-xs text-muted-foreground">Not connected</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="font-medium">Instagram</p>
                  <p className="text-xs text-muted-foreground">Not connected</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 p-4">
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 text-sm md:text-base ${
                message.type === "success"
                  ? "bg-green-500/10 border border-green-500 text-green-500"
                  : "bg-destructive/10 border border-destructive text-destructive"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <p className="font-medium">{message.text}</p>
            </div>
          )}
        </div>
      </div>
  )
}
