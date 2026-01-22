import { type FunctionComponent, type ReactNode, useState } from 'react'
import { context, type ContextData } from './context'
import { persistAuth, retrieveAuth } from './lib'

const persistedAuth = await retrieveAuth()

export const Provider: FunctionComponent<{ children: ReactNode }> = ({
	children
}) => {
	const [state, setState] = useState<ContextData>(persistedAuth)

	return (
		<context.Provider
			value={{
				...state,
				set: (state) => {
					persistAuth(state)
					setState(state)
				}
			}}
		>
			{children}
		</context.Provider>
	)
}
