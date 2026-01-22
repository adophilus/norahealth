import { IntegrationHeader } from '@/features/integration/header'
import { IntegrationDetailsCards } from '@/features/integration/details-cards'
import { IntegrationSecurityCard } from '@/features/integration/security-card'
import { IntegrationsGrid } from '@/features/integration/grid'
import { IntegrationOauthFlowInfoCard } from '@/features/integration/oauth-flow-info-card'

export function IntegrationManager() {
	return (
		<>
			<IntegrationHeader />
			<IntegrationDetailsCards />
			<IntegrationsGrid />
			<IntegrationSecurityCard />
			<IntegrationOauthFlowInfoCard />
		</>
	)
}
