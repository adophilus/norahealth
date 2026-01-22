/**
 * Schedule Dialog - Dialog for scheduling posts
 * @module components/farcaster/schedule-dialog
 */

'use client'

import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useScheduledPosts } from '@/hooks/use-scheduled-posts'
import { Calendar, Clock, AlertCircle } from 'lucide-react'

interface ScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: string
  channelId?: string
  embeds?: Array<{ url: string }>
  onScheduled?: () => void
}

/**
 * Dialog component for scheduling a post to be published later
 * Uses shadcn Dialog and Select components
 */
export function ScheduleDialog({
  open,
  onOpenChange,
  content,
  channelId,
  embeds,
  onScheduled,
}: ScheduleDialogProps) {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedHour, setSelectedHour] = useState('12')
  const [selectedMinute, setSelectedMinute] = useState('00')
  const [selectedAmPm, setSelectedAmPm] = useState<'AM' | 'PM'>('PM')
  const [validationError, setValidationError] = useState<string | null>(null)

  const { schedulePost, isScheduling } = useScheduledPosts()

  // Generate date options for the next 30 days
  const dateOptions = useMemo(() => {
    const options: Array<{ value: string; label: string }> = []
    const today = new Date()

    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)

      const value = date.toISOString().split('T')[0]
      const label =
        i === 0
          ? 'Today'
          : i === 1
            ? 'Tomorrow'
            : date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })

      options.push({ value, label })
    }

    return options
  }, [])

  // Generate hour options (1-12)
  const hourOptions = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const hour = i + 1
      return { value: hour.toString(), label: hour.toString() }
    })
  }, [])

  // Generate minute options (00, 15, 30, 45)
  const minuteOptions = useMemo(() => {
    return [
      { value: '00', label: '00' },
      { value: '15', label: '15' },
      { value: '30', label: '30' },
      { value: '45', label: '45' },
    ]
  }, [])

  const handleSchedule = async () => {
    setValidationError(null)

    // Validate inputs
    if (!selectedDate) {
      setValidationError('Please select a date')
      return
    }

    // Build the scheduled time
    let hour = parseInt(selectedHour, 10)
    if (selectedAmPm === 'PM' && hour !== 12) {
      hour += 12
    } else if (selectedAmPm === 'AM' && hour === 12) {
      hour = 0
    }

    const scheduledDate = new Date(selectedDate)
    scheduledDate.setHours(hour, parseInt(selectedMinute, 10), 0, 0)

    // Validate the scheduled time is in the future
    if (scheduledDate <= new Date()) {
      setValidationError('Please select a future date and time')
      return
    }

    try {
      await schedulePost({
        content,
        scheduledTime: scheduledDate.toISOString(),
        channelId,
        embeds,
      })

      // Reset form and close
      setSelectedDate('')
      setSelectedHour('12')
      setSelectedMinute('00')
      setSelectedAmPm('PM')
      onScheduled?.()
    } catch (error) {
      // Error is handled by the hook with toast
      console.error('Failed to schedule post:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="size-5" />
            Schedule Post
          </DialogTitle>
          <DialogDescription>
            Choose when you want this post to be published.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Post preview */}
          <div className="rounded-md border bg-muted/50 p-3">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {content}
            </p>
            {channelId && (
              <p className="text-xs text-muted-foreground mt-2">
                Channel: /{channelId}
              </p>
            )}
          </div>

          {/* Date selector */}
          <div className="space-y-2">
            <Label htmlFor="schedule-date">Date</Label>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger id="schedule-date" className="w-full">
                <SelectValue placeholder="Select a date" />
              </SelectTrigger>
              <SelectContent>
                {dateOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time selector */}
          <div className="space-y-2">
            <Label>Time</Label>
            <div className="flex items-center gap-2">
              <Select value={selectedHour} onValueChange={setSelectedHour}>
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent>
                  {hourOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <span className="text-muted-foreground">:</span>

              <Select value={selectedMinute} onValueChange={setSelectedMinute}>
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="Min" />
                </SelectTrigger>
                <SelectContent>
                  {minuteOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedAmPm}
                onValueChange={(val) => setSelectedAmPm(val as 'AM' | 'PM')}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Validation error */}
          {validationError && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="size-4" />
              {validationError}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isScheduling}
          >
            Cancel
          </Button>
          <Button onClick={handleSchedule} disabled={isScheduling}>
            {isScheduling ? (
              <>
                <span className="animate-spin">⟳</span>
                Scheduling...
              </>
            ) : (
              <>
                <Clock className="size-4" />
                Schedule Post
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
