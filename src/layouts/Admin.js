import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Navbar from '../components/Navbars/Navbar.js'
import { SettingsRoutes } from '../routes.js'
import styles from '../assets/jss/material-dashboard-react/layouts/adminStyle.js'
import CreateUser from '../views/Users/CreateUser.js'

// Redux
import { connect } from 'react-redux'
import { setUserId } from '../redux/actions/auth.js'
import { fetchSiteData } from '../redux/actions/accounts.js'
import EditUser from '../views/Users/EditUser'
import TestBrandProfile from '../views/BrandProfiles/TestBrandProfile'
import ChannelResearchTemp from '../views/Discover/ChannelResearchTemp'
import ListBuilder from '../views/Discover/ListBuilder.js'
import Users from '../views/Users/Users'
import BrandProfiles from '../views/BrandProfiles/BrandProfiles.js'
import CreateBrandProfile from '../views/BrandProfiles/CreateBrandProfile.js'
import UserProfile from '../views/UserProfile/UserProfile.js'
import Account from '../views/Account/Account'

let ps

const switchRoutes = (
	<Switch>
		<Route path='/admin/settings/brandMentality' component={TestBrandProfile} />

		<Route
			path='/admin/discover/channelResearch'
			component={ChannelResearchTemp}
		/>

		<Route
			path='/admin/settings/users'
			render={({ match: { url } }) => (
				<>
					<Route path={`${url}/`} component={Users} exact />

					<Route path={`${url}/create`} component={CreateUser} />
					<Route
						path={`${url}/edit/:user`}
						render={(props) => <EditUser {...props} foo='bar' />}
					/>
				</>
			)}
		/>

		<Route path='/admin/engage/listBuilder' component={ListBuilder} />

		<Route path='/admin/settings/profile' component={UserProfile} />

		<Route path='/admin/settings/account' component={Account} />

		<Route
			path='/admin/settings/brandProfiles'
			render={({ match: { url } }) => (
				<>
					<Route path={`${url}/`} component={BrandProfiles} exact />

					<Route path={`${url}/create`} component={CreateBrandProfile} />
				</>
			)}
		/>

		<Redirect from='/admin' to='/admin/settings/profile' />
	</Switch>
)

const useStyles = makeStyles(styles)

const mapDispatchToProps = (dispatch) => {
	return {
		setUserId: (userId) => dispatch(setUserId(userId)),
		fetchSiteData: () => dispatch(fetchSiteData())
	}
}

function Admin({ ...rest }) {
	const classes = useStyles()
	const mainPanel = React.createRef()
	const [color] = React.useState('blue')
	const [mobileOpen, setMobileOpen] = React.useState(false)

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen)
	}
	const resizeFunction = () => {
		if (window.innerWidth >= 960) {
			setMobileOpen(false)
		}
	}
	// initialize and destroy the PerfectScrollbar plugin
	React.useEffect(() => {
		if (navigator.platform.indexOf('Win') > -1) {
			ps = new PerfectScrollbar(mainPanel.current, {
				suppressScrollX: true,
				suppressScrollY: false
			})
			document.body.style.overflow = 'hidden'
		}
		window.addEventListener('resize', resizeFunction)
		// Specify how to clean up after this effect:
		return function cleanup() {
			if (navigator.platform.indexOf('Win') > -1) {
				ps.destroy()
			}
			window.removeEventListener('resize', resizeFunction)
		}
	}, [mainPanel])

	var userId = rest.userId
	if (!userId) {
		let userId = localStorage.getItem('userId')
		if (userId) {
			rest.setUserId(userId)
		}
	}

	//preload critical data into the application
	const { fetchSiteData } = rest
	React.useEffect(() => {
		fetchSiteData()
	}, [fetchSiteData])

	return (
		<div className={classes.wrapper}>
			<div className={classes.mainPanel} ref={mainPanel}>
				<Navbar
					routes={SettingsRoutes}
					handleDrawerToggle={handleDrawerToggle}
					{...rest}
				/>

				<div className={classes.content}>
					<div className={classes.container}>{switchRoutes}</div>
				</div>
			</div>
		</div>
	)
}

export default connect(null, mapDispatchToProps)(Admin)
