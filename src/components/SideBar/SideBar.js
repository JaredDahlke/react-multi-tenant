/*eslint-disable*/
import React from 'react'
// @material-ui/core components
import Drawer from 'rsuite/lib/Drawer'
import Dropdown from 'rsuite/lib/Dropdown'
import { Link } from 'react-router-dom'
// core components
import Icon from 'rsuite/lib/Icon'

import Nav from 'rsuite/lib/Nav'
import { perms, userCan } from '../../Can'
import { routes } from '../../routes'
import IconButton from 'rsuite/lib/IconButton'
import Sidenav from 'rsuite/lib/Sidenav'
import logo from '../../assets/img/sightly-logo.svg'
import makeStyles from '@material-ui/core/styles/makeStyles'
import sidebarStyles from '../../assets/jss/material-dashboard-react/components/sidebarStyle.js'

export default function Sidebar(props) {
	const NavLink = (props) => (
		<Dropdown.Item componentClass={MyLink} {...props} />
	)

	const useSidebarStyles = makeStyles(sidebarStyles)
	const sidebarClasses = useSidebarStyles()

	let brand = (
		<div className={sidebarClasses.logoImage}>
			<img src={logo} alt='logo' className={sidebarClasses.img} />
		</div>
	)

	const MyLink = React.forwardRef((props, ref) => {
		const { href, as, label, ...rest } = props

		return (
			<Link to={href} style={{ textDecoration: 'none' }} ref={ref} {...rest}>
				{label}
			</Link>
		)
	})

	return (
		<Drawer
			full
			placement={'left'}
			show={props.showMobileDrawer}
			onHide={props.closeMobileDrawer}
		>
			<Sidenav defaultOpenKeys={['3', '4']} activeKey='1'>
				<Sidenav.Header>
					<Nav>
						<Nav.Item href={routes.app.homepage.path}>{brand}</Nav.Item>
					</Nav>
				</Sidenav.Header>
				<Sidenav.Body>
					<Nav>
						<Dropdown
							eventKey='3'
							title='Discover'
							style={{
								display: userCan(perms.DISCOVER_READ) ? 'flex' : 'none'
							}}
							icon={<Icon icon='pie-chart' />}
						>
							<NavLink
								href={routes.app.discover.channelResearch.path}
								label='Channel Research'
							/>
						</Dropdown>
						<Dropdown
							eventKey='4'
							title='Engage'
							icon={<Icon icon='bolt' />}
							style={{
								display: userCan(perms.ENGAGE_READ) ? 'flex' : 'none'
							}}
						>
							<NavLink
								href={routes.app.engage.lists.lists.path}
								label='SmartLists'
							/>
						</Dropdown>
						<Dropdown
							eventKey='5'
							title='Account Settings'
							icon={<Icon icon='sliders' />}
						>
							{userCan(perms.ACCOUNT_READ) && (
								<NavLink
									href={routes.app.settings.account.path}
									label='Account'
								/>
							)}

							{userCan(perms.USER_READ) && (
								<NavLink href={routes.app.settings.users.path} label='Users' />
							)}
							{userCan(perms.BRAND_PROFILE_READ) && (
								<NavLink
									href={routes.app.settings.brandProfiles.path}
									label='Brand Profiles'
								/>
							)}

							{userCan(perms.BRAND_MENTALITY_READ) && (
								<NavLink
									href={routes.app.settings.brandMentality.path}
									label='Brand Mentality'
								/>
							)}
						</Dropdown>
						{userCan(perms.ADMIN_READ) && (
							<Dropdown
								title='Admin'
								eventKey='6'
								icon={<Icon icon='gears2' />}
							>
								{userCan(perms.ADMIN_READ) && (
									<NavLink
										href={routes.admin.scenarios.path}
										label='Configure Scenarios'
									/>
								)}

								{userCan(perms.ADMIN_READ) && (
									<NavLink
										href={routes.admin.opinions.path}
										label='Configure Opinions'
									/>
								)}

								{userCan(perms.ADMIN_READ) && (
									<NavLink
										href={routes.admin.questions.path}
										label='Configure Questions'
									/>
								)}

								{userCan(perms.ADMIN_READ) && (
									<NavLink
										href={routes.admin.permissions.path}
										label='Configure Permissions'
									/>
								)}
							</Dropdown>
						)}
					</Nav>
				</Sidenav.Body>
			</Sidenav>
		</Drawer>
	)
}
