import React, { Suspense } from 'react'
import './App.css'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import PrivateRoute from './pages/PrivateRoute.js'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import ChangePassword from './pages/ChangePassword'
import { Provider } from 'react-redux'
import configureStore from './redux/store/index.js'
import { neutralColor, accentColor } from './assets/jss/colorContants'
import CircularProgress from '@material-ui/core/CircularProgress'
//import Admin from '../src/layouts/Admin.js'

const Admin = React.lazy(() => import('../src/layouts/Admin'))
//const ResetPassword = lazy(() => import('./pages/ResetPassword'))
//const ChangePassword = lazy(() => import('./pages/ChangePassword'))
//const Login = lazy(() => import('./pages/Login'))

const store = configureStore()

const LoaderPage = () => (
	<div
		style={{
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: neutralColor,
			height: '100vh',
			color: 'white'
		}}
	>
		<div style={{ color: accentColor, marginRight: 16 }}>
			<CircularProgress color='inherit' />
		</div>
		<div>Loading...</div>
	</div>
)

function App() {
	return (
		<Provider store={store}>
			<Router>
				<div>
					<Route exact path='/' component={Login} />
					<Route path='/login' component={Login} />

					<Route path='/resetPassword' component={ResetPassword} />
					<Route
						path='/changePassword/:userId/:token'
						render={({ match }) => (
							<ChangePassword
								userId={match.params.userId}
								token={match.params.token}
							/>
						)}
					/>
					<Suspense fallback={<LoaderPage />}>
						<PrivateRoute path='/admin' component={Admin} />
					</Suspense>
				</div>
			</Router>
		</Provider>
	)
}

export default App
