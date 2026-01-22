import { useState } from "react";
import { Save, LogOut, Trash2, Bell, Lock, User } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import {
  updateUserProfile,
  updateNotificationPreferences,
} from "@/lib/services/user-service";

interface UserSettings {
  displayName: string;
  email: string;
  timezone: string;
  emailNotifications: boolean;
  digestEmail: boolean;
  postScheduleReminder: boolean;
  analyticsDigest: boolean;
  weeklyRecap: boolean;
}

export default function SettingsPanel() {
  const router = useRouter();
  const [settings, setSettings] = useState<UserSettings>({
    displayName: "John Doe",
    email: "john@example.com",
    timezone: "UTC-5",
    emailNotifications: true,
    digestEmail: true,
    postScheduleReminder: true,
    analyticsDigest: false,
    weeklyRecap: true,
  });

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setUnsavedChanges(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUserProfile("user123", {
        displayName: settings.displayName,
        email: settings.email,
        timezone: settings.timezone,
      });
      setUnsavedChanges(false);
      showMessage("success", "Settings saved successfully!");
    } catch (_error) {
      showMessage("error", "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSave = async () => {
    setLoading(true);
    try {
      await updateNotificationPreferences("user123", {
        emailNotifications: settings.emailNotifications,
        digestEmail: settings.digestEmail,
      });
      setUnsavedChanges(false);
      showMessage("success", "Notification preferences saved!");
    } catch (_error) {
      showMessage("error", "Failed to update preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    showMessage("success", "Signed out successfully");
    setTimeout(() => {
      router.navigate({ to: "/auth" });
    }, 1000);
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    setLoading(true);
    try {
      console.log("Deleting account for user123");
      showMessage("success", "Account deletion initiated. Redirecting...");
      setTimeout(() => {
        router.navigate({ to: "/auth" });
      }, 2000);
    } catch (_error) {
      showMessage("error", "Failed to delete account");
    } finally {
      setLoading(false);
      setDeleteConfirm(false);
    }
  };

  return (
    <div className="h-full overflow-auto bg-background p-4 md:p-8">
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Settings</h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage your account preferences and security
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 text-sm ${message.type === "success"
                ? "bg-green-500/10 border border-green-500 text-green-500"
                : "bg-destructive/10 border border-destructive text-destructive"
              }`}
          >
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {/* Unsaved Changes Warning */}
        {unsavedChanges && (
          <div className="mb-6 p-3 md:p-4 rounded-lg bg-yellow-500/10 border border-yellow-500 text-yellow-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-xs md:text-sm font-medium">
              You have unsaved changes
            </span>
            <button
              type="button"
              onClick={() => {
                setSettings({
                  displayName: "John Doe",
                  email: "john@example.com",
                  timezone: "UTC-5",
                  emailNotifications: true,
                  digestEmail: true,
                  postScheduleReminder: true,
                  analyticsDigest: false,
                  weeklyRecap: true,
                });
                setUnsavedChanges(false);
              }}
              className="text-xs underline hover:no-underline"
            >
              Discard
            </button>
          </div>
        )}

        {/* Profile Settings */}
        <div className="bg-card rounded-lg border border-border p-4 md:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <User className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            <h3 className="text-base md:text-lg font-bold text-foreground">Profile</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-foreground mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={settings.displayName}
                onChange={(e) => handleChange("displayName", e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground placeholder-muted-foreground transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 text-sm"
                placeholder="Your display name"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={settings.email}
                disabled
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-muted-foreground placeholder-muted-foreground transition-all focus:outline-none opacity-60 cursor-not-allowed text-sm"
                placeholder="your@email.com"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your account email. Contact support to change.
              </p>
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-foreground mb-2">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => handleChange("timezone", e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 text-sm"
              >
                <option value="UTC-8">Pacific Time (UTC-8)</option>
                <option value="UTC-6">Central Time (UTC-6)</option>
                <option value="UTC-5">Eastern Time (UTC-5)</option>
                <option value="UTC">UTC</option>
                <option value="UTC+1">Central European (UTC+1)</option>
                <option value="UTC+5:30">India Standard (UTC+5:30)</option>
                <option value="UTC+8">Singapore / Hong Kong (UTC+8)</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Used for scheduling and notifications
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={!unsavedChanges || loading}
              className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <Save className="w-4 h-4 inline mr-2" />
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-card rounded-lg border border-border p-4 md:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <Bell className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            <h3 className="text-base md:text-lg font-bold text-foreground">Notifications</h3>
          </div>
          <div className="space-y-3 md:space-y-4">
            <div>
              <label className="flex items-start md:items-center gap-3 cursor-pointer py-2 md:py-3">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) =>
                    handleChange("emailNotifications", e.target.checked)
                  }
                  className="w-4 h-4 rounded cursor-pointer accent-primary mt-1 md:mt-0 flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm md:text-base text-foreground">
                    Email on interactions
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Get notified when someone engages with your posts
                  </p>
                </div>
              </label>
            </div>

            <div className="border-t border-border pt-3 md:pt-4">
              <label className="flex items-start md:items-center gap-3 cursor-pointer py-2 md:py-3">
                <input
                  type="checkbox"
                  checked={settings.postScheduleReminder}
                  onChange={(e) =>
                    handleChange("postScheduleReminder", e.target.checked)
                  }
                  className="w-4 h-4 rounded cursor-pointer accent-primary mt-1 md:mt-0 flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm md:text-base text-foreground">
                    Schedule reminders
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Reminder 1 hour before your scheduled posts go live
                  </p>
                </div>
              </label>
            </div>

            <div className="border-t border-border pt-3 md:pt-4">
              <label className="flex items-start md:items-center gap-3 cursor-pointer py-2 md:py-3">
                <input
                  type="checkbox"
                  checked={settings.digestEmail}
                  onChange={(e) =>
                    handleChange("digestEmail", e.target.checked)
                  }
                  className="w-4 h-4 rounded cursor-pointer accent-primary mt-1 md:mt-0 flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm md:text-base text-foreground">
                    Daily digest email
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Summary of your posts and engagement each day
                  </p>
                </div>
              </label>
            </div>

            <div className="border-t border-border pt-3 md:pt-4">
              <label className="flex items-start md:items-center gap-3 cursor-pointer py-2 md:py-3">
                <input
                  type="checkbox"
                  checked={settings.analyticsDigest}
                  onChange={(e) =>
                    handleChange("analyticsDigest", e.target.checked)
                  }
                  className="w-4 h-4 rounded cursor-pointer accent-primary mt-1 md:mt-0 flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm md:text-base text-foreground">
                    Analytics reports
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Weekly performance insights and trends
                  </p>
                </div>
              </label>
            </div>

            <div className="border-t border-border pt-3 md:pt-4">
              <label className="flex items-start md:items-center gap-3 cursor-pointer py-2 md:py-3">
                <input
                  type="checkbox"
                  checked={settings.weeklyRecap}
                  onChange={(e) =>
                    handleChange("weeklyRecap", e.target.checked)
                  }
                  className="w-4 h-4 rounded cursor-pointer accent-primary mt-1 md:mt-0 flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm md:text-base text-foreground">Weekly recap</p>
                  <p className="text-xs text-muted-foreground">
                    Best performing posts and channel updates
                  </p>
                </div>
              </label>
            </div>

            <button
              onClick={handleNotificationSave}
              disabled={loading}
              className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-6 text-sm"
            >
              <Save className="w-4 h-4 inline mr-2" />
              Save Notification Preferences
            </button>
          </div>
        </div>

        {/* Security Settings - Email/OTP Based */}
        <div className="bg-card rounded-lg border border-border p-4 md:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <Lock className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            <h3 className="text-base md:text-lg font-bold text-foreground">Security</h3>
          </div>
          <div className="space-y-3 md:space-y-4">
            <button className="w-full text-left p-3 md:p-4 rounded-lg border border-border hover:bg-secondary transition flex items-center justify-between text-sm">
              <div>
                <p className="font-medium text-foreground">
                  Two-Factor Authentication
                </p>
                <p className="text-xs text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <span className="text-muted-foreground flex-shrink-0">→</span>
            </button>

            <button className="w-full text-left p-3 md:p-4 rounded-lg border border-border hover:bg-secondary transition flex items-center justify-between text-sm">
              <div>
                <p className="font-medium text-foreground">Active Sessions</p>
                <p className="text-xs text-muted-foreground">
                  View and manage your logged-in devices
                </p>
              </div>
              <span className="text-muted-foreground flex-shrink-0">→</span>
            </button>

            <p className="text-xs text-muted-foreground bg-secondary/50 p-3 rounded border border-border mt-4">
              You use email/OTP authentication. No password is required. To
              authenticate, you'll receive a one-time code via email.
            </p>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-card rounded-lg border border-destructive/20 p-4 md:p-6 mb-6 bg-destructive/5">
          <h3 className="text-base md:text-lg font-bold text-foreground mb-4 md:mb-6">Account</h3>
          <div className="space-y-2 md:space-y-3">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 md:py-3 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-foreground transition text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>

            <button
              onClick={handleDeleteAccount}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 md:py-3 rounded-lg transition text-sm ${deleteConfirm
                  ? "bg-destructive/20 border border-destructive text-destructive hover:bg-destructive/30"
                  : "border border-destructive/30 text-destructive hover:bg-destructive/10"
                }`}
            >
              <Trash2 className="w-4 h-4" />
              {deleteConfirm ? "Confirm Delete Account" : "Delete Account"}
            </button>

            {deleteConfirm && (
              <p className="text-xs text-destructive bg-destructive/10 p-3 rounded border border-destructive/20">
                Warning: This action is permanent. All your data including
                posts, drafts, and settings will be permanently deleted.
              </p>
            )}
          </div>
        </div>

        {/* API Access (Optional) */}
        <div className="bg-card rounded-lg border border-border p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-foreground mb-3 md:mb-4">API Access</h3>
          <p className="text-xs md:text-sm text-muted-foreground mb-4">
            Generate API keys for programmatic access to nora-health. Use with
            caution.
          </p>
          <button className="px-4 py-2 rounded-lg bg-secondary text-foreground border border-border font-medium transition-all hover:bg-secondary/80 active:scale-95 text-sm">
            Generate API Key
          </button>
        </div>
      </div>
    </div>
  );
}
