import {
	drawerWidth,
	transition,
	container,
	blackColor
} from '../../../jss/material-dashboard-react.js' //"../assets/jss/material-dashboard-react.js";

const appStyle = (theme) => ({
	wrapper: {
		position: 'relative',
		top: '0',
		height: '100vh',
		backgroundColor: blackColor
	},
	authPanel: {
		overflow: 'auto',
		position: 'relative',
		float: 'right',
		...transition,
		height: '100vh',
		minHeight: '100%',
		width: '100%',
		overflowScrolling: 'touch',
		backgroundColor: blackColor
	},
	mainPanel: {
		[theme.breakpoints.up('md')]: {
			// width: `calc(100% - ${drawerWidth}px)`
		},
		overflow: 'auto',
		position: 'relative',
		float: 'right',
		...transition,
		maxHeight: '100%',
		width: '100%',
		overflowScrolling: 'touch'
	},
	content: {
		marginTop: '30px',
		padding: '15px 15px'
		//minHeight: "calc(100vh - 123px)"
	},
	container,
	map: {
		marginTop: '70px'
	}
})

export default appStyle
