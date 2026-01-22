export const IntegrationOauthFlowInfoCard = () => (
  <div className="bg-card rounded-lg border border-border p-6">
    <h4 className="font-semibold text-foreground mb-4">
      How OAuth Connection Works
    </h4>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        {
          step: '1',
          title: 'Click Connect',
          desc: "You'll be redirected to the platform's login"
        },
        {
          step: '2',
          title: 'Authorize',
          desc: 'Grant nora-health permission to post on your behalf'
        },
        {
          step: '3',
          title: 'Connected',
          desc: 'Securely start scheduling posts across channels'
        }
      ].map((item) => (
        <div key={item.step} className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
            {item.step}
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">
              {item.title}
            </p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)
