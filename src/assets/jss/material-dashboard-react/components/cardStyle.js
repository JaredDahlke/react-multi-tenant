import { whiteColor, hexToRgb } from '../../material-dashboard-react.js'
import { neutralColor } from '../../colorContants.js'

const cardStyle = {
	card: {
		border: '0',
		marginBottom: '30px',
		marginTop: '30px',
		borderRadius: '1px',
		color: 'rgba(' + hexToRgb(neutralColor) + ', 0.87)',
		background: neutralColor,
		width: '100%',
		boxShadow: '0 1px 4px 0 rgba(' + hexToRgb(whiteColor) + ', 0.14)',
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		minWidth: '0',
		wordWrap: 'break-word',
		fontSize: '.875rem'
	},
	cardPopover: {
		border: '0',
		// marginBottom: "30px",
		// marginTop: "30px",
		borderRadius: '6px',
		color: 'rgba(' + hexToRgb(neutralColor) + ', 0.87)',
		background: neutralColor,
		width: '100%',
		boxShadow: '0 1px 4px 0 rgba(' + hexToRgb(whiteColor) + ', 0.14)',
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		minWidth: '0',
		wordWrap: 'break-word',
		fontSize: '.875rem'
	},
	cardPlain: {
		background: 'transparent',
		boxShadow: 'none'
	},
	cardProfile: {
		marginTop: '30px',
		textAlign: 'center'
	},
	cardChart: {
		'& p': {
			marginTop: '0px',
			paddingTop: '0px'
		}
	}
}

export default cardStyle
