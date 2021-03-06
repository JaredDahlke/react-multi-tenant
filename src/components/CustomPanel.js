import React from 'react'
import Panel from 'rsuite/lib/Panel'
import { neutralLightColor } from '../assets/jss/colorContants'

const CustomPanel = (props) => {
	const { className, children, plain, profile, chart, ...rest } = props
	return (
		<Panel {...rest} style={{ backgroundColor: '#F7F7FA' }}>
			{children}
		</Panel>
	)
}

export default CustomPanel
