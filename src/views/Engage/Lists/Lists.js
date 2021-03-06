import React from 'react'
import Grid from '@material-ui/core/Grid'
import Button from 'rsuite/lib/Button'
import { connect } from 'react-redux'
import Loader from 'rsuite/lib/Loader'
import { useHistory } from 'react-router-dom'
import { routes } from '../../../routes'
import numeral from 'numeral'
import Icon from 'rsuite/lib/Icon'
import IconButton from 'rsuite/lib/IconButton'
import CustomPanel from '../../../components/CustomPanel'
import Whisper from 'rsuite/lib/Whisper'
import Dropdown from 'rsuite/lib/Dropdown'
import Popover from 'rsuite/lib/Popover'
import orderBy from 'lodash/orderBy'
import { getCurrentAccount } from '../../../utils'
import {
	objectives,
	activeStatuses,
	archivedStatuses,
	targetTypes
} from './constants'
import {
	fetchLists,
	archiveList,
	downloadExcelList,
	activateListVersion,
	cloneListVersion,
	setPostListSuccess
} from '../../../redux/actions/engage/lists'
import { whiteColor } from '../../../assets/jss/material-dashboard-react.js'
import { animated, useSpring } from 'react-spring'
import ButtonToolbar from 'rsuite/lib/ButtonToolbar'
import InputPicker from 'rsuite/lib/InputPicker'
import Table from 'rsuite/lib/Table'
import { useDispatch } from 'react-redux'
import { neutralColor } from '../../../assets/jss/colorContants'

const mapStateToProps = (state) => {
	return {
		lists: state.engage.lists,
		accounts: state.accounts,
		brandProfiles: state.brandProfiles,
		isFetchingLists: state.engage.isFetchingLists,
		fetchListsSuccess: state.engage.fetchListsSuccess,
		isDownloadingExcel: state.engage.isDownloadingExcel,
		isDownloadingExcelVersionId: state.engage.isDownloadingExcelVersionId,
		isPostingList: state.engage.isPostingList,
		postListSuccess: state.engage.postListSuccess,
		isPostingListVersionId: state.engage.isPostingListVersionId,
		smartListVersionUnderEdit: state.engage.smartListVersionUnderEdit
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		fetchLists: (accountId) => dispatch(fetchLists(accountId)),
		archiveList: (payload) => dispatch(archiveList(payload)),
		downloadExcelList: (payload) => dispatch(downloadExcelList(payload)),
		activateListVersion: (payload) => dispatch(activateListVersion(payload)),
		cloneListVersion: (payload) => dispatch(cloneListVersion(payload)),
		setPostListSuccess: (bool) => dispatch(setPostListSuccess(bool))
	}
}

function Lists(props) {
	const history = useHistory()

	const [currentSort, setCurrentSort] = React.useState({
		sortColumn: 'brandName',
		sortType: 'desc'
	})
	const [filterState, setFilterState] = React.useState({
		objectiveId: null,
		brandProfileId: null,
		targetTypeId: null,
		smartListId: null,
		activeStatusId: 1,
		archivedStatusId: 2
	})

	let fetchLists = props.fetchLists
	let accounts = props.accounts.data

	React.useEffect(() => {
		let currentAccount = getCurrentAccount(props.accounts.data)
		if (currentAccount) {
			fetchLists(currentAccount.accountId)
		}
	}, [fetchLists, accounts])

	let postListSuccess = props.postListSuccess
	React.useEffect(() => {
		if (postListSuccess) {
			let url = `/app/engage/lists/listBuilder/${props.smartListVersionUnderEdit.versionId}`
			history.push(url)
		}
	}, [postListSuccess])

	let setPostListSuccess = props.setPostListSuccess

	React.useEffect(() => {
		return () => {
			//clean up on unmount
			setPostListSuccess(false)
		}
	}, [])

	const handleUploadNewList = () => {
		history.push(routes.app.engage.lists.uploadList.path)
	}
	const handleCreateNewList = () => {
		history.push(`${routes.app.engage.lists.createList.path}`, {
			from: 'lists'
		})
	}

	const handleEditClick = (item) => {
		let params = {
			versionId: item.versionId,
			smartListName: item.smartListName,
			brandProfileName: item.brandProfileName
		}
		props.cloneListVersion(params)
	}

	const smartLists = React.useMemo(() => {
		let _smartLists = []
		let currentIds = []
		for (const list of props.lists) {
			if (!currentIds.includes(list.smartListId)) {
				_smartLists.push(list)
				currentIds.push(list.smartListId)
			}
		}
		return _smartLists
	}, [props.lists])

	const handleFilter = (list) => {
		if (
			filterState.objectiveId &&
			list.objectiveId != filterState.objectiveId
		) {
			return false
		}

		if (
			filterState.targetTypeId &&
			list.targetTypeId != filterState.targetTypeId
		) {
			return false
		}

		if (
			filterState.brandProfileId &&
			list.brandProfileId != filterState.brandProfileId
		) {
			return false
		}

		if (
			filterState.smartListId &&
			list.smartListId != filterState.smartListId
		) {
			return false
		}

		if (
			filterState.activeStatusId &&
			list.active != (filterState.activeStatusId === 1 ? true : false)
		) {
			return false
		}

		if (
			filterState.archivedStatusId &&
			list.archived != (filterState.archivedStatusId === 1 ? true : false)
		) {
			return false
		}

		return true
	}

	const visibleLists = React.useMemo(() => {
		let filtered = props.lists.filter((list) => handleFilter(list))
		let { sortColumn, sortType } = currentSort
		let sorted = orderBy(
			filtered,
			[
				(item) => {
					if (typeof item[sortColumn] === 'string') {
						return item[sortColumn].toLowerCase()
					} else {
						return item[sortColumn]
					}
				}
			],
			[sortType]
		)
		return sorted
	}, [props.lists, currentSort, filterState])

	const [lastSubscribers, setLastSubscribers] = React.useState(0)
	const [lastVideos, setLastVideos] = React.useState(0)
	const [lastChannels, setLastChannels] = React.useState(0)

	const totals = React.useMemo(() => {
		let _subscribers = 0
		let _channels = 0
		let _videos = 0
		for (const version of visibleLists) {
			_subscribers = _subscribers + version.subscriberCount
			_channels = _channels + version.channelCount
			_videos = _videos + version.videoCount
		}
		let subscribersFormatted = _subscribers
		let channelsFormatted = _channels
		let videosFormatted = _videos

		return {
			subscribers: subscribersFormatted,
			channels: channelsFormatted,
			videos: videosFormatted
		}
	}, [props.lists, currentSort, filterState])

	React.useEffect(() => {
		setLastSubscribers(totals.subscribers)
		setLastVideos(totals.videos)
		setLastChannels(totals.channels)
	}, [totals])

	const videosValue = useSpring({
		to: { number: Number(totals.videos) },
		from: { number: Number(lastVideos) },
		config: { duration: 250 }
	})

	const channelsValue = useSpring({
		to: { number: Number(totals.channels) },
		from: { number: Number(lastChannels) },
		config: { duration: 250 }
	})

	const subscribersValue = useSpring({
		to: { number: Number(totals.subscribers) },
		from: { number: Number(lastSubscribers) },
		config: { duration: 250 }
	})

	const SubscriberCell = ({ rowData, dataKey, ...props }) => {
		return (
			<Table.Cell {...props}>{rowData.subscriberCountFormatted}</Table.Cell>
		)
	}

	const ChannelCell = ({ rowData, dataKey, ...props }) => {
		return <Table.Cell {...props}>{rowData.channelCountFormatted}</Table.Cell>
	}

	const VideoCell = ({ rowData, dataKey, ...props }) => {
		return <Table.Cell {...props}>{rowData.videoCountFormatted}</Table.Cell>
	}

	const ActionCell = ({ rowData, dataKey, customProps, ...props }) => {
		return (
			<Table.Cell
				{...props}
				className='link-group'
				style={{ align: 'center', padding: 5 }}
			>
				<CustomWhisper rowData={rowData}>
					<IconButton
						appearance='subtle'
						icon={<Icon icon='more' />}
						loading={
							(customProps.isDownloadingExcel &&
								customProps.isDownloadingExcelVersionId ===
									rowData.versionId) ||
							(customProps.isPostingList &&
								customProps.isPostingListVersionId === rowData.versionId)
						}
					/>
				</CustomWhisper>
			</Table.Cell>
		)
	}

	const Menu = (props) => {
		const dispatch = useDispatch()
		return (
			<Dropdown.Menu onSelect={props.onSelect}>
				<Dropdown.Item
					eventKey={3}
					onClick={(e) => {
						let payload = {
							versionId: props.rowData.versionId,
							smartListName: props.rowData.smartListName
						}
						dispatch(downloadExcelList(payload))
					}}
				>
					Download
				</Dropdown.Item>
				{!props.rowData.archived && (
					<Dropdown.Item
						eventKey={7}
						onClick={() => {
							const payload = {
								smartListId: props.rowData.smartListId,
								archive: true
							}
							dispatch(archiveList(payload))
						}}
					>
						Archive All Versions
					</Dropdown.Item>
				)}

				{props.rowData.archived && (
					<Dropdown.Item
						eventKey={7}
						onClick={() => {
							const payload = {
								smartListId: props.rowData.smartListId,
								archive: false
							}
							dispatch(archiveList(payload))
						}}
					>
						Unarchive All Versions
					</Dropdown.Item>
				)}

				{!props.rowData.active && (
					<Dropdown.Item
						eventKey={7}
						onClick={() => {
							let payload = {
								versionId: props.rowData.versionId,
								smartListId: props.rowData.smartListId
							}

							dispatch(activateListVersion(payload))
						}}
					>
						Activate Version
					</Dropdown.Item>
				)}

				<Dropdown.Item
					eventKey={7}
					onClick={() => {
						handleEditClick(props.rowData)
					}}
				>
					Edit
				</Dropdown.Item>
			</Dropdown.Menu>
		)
	}

	const MenuPopover = ({ onSelect, rowData, ...rest }) => (
		<Popover {...rest} full>
			<Menu onSelect={onSelect} rowData={rowData} />
		</Popover>
	)

	let tableBody

	class CustomWhisper extends React.Component {
		constructor(props) {
			super(props)
			this.handleSelectMenu = this.handleSelectMenu.bind(this)
		}
		handleSelectMenu(eventKey, event) {
			this.trigger.hide()
		}
		render() {
			return (
				<Whisper
					placement='topEnd'
					trigger='click'
					triggerRef={(ref) => {
						this.trigger = ref
					}}
					container={() => {
						return tableBody
					}}
					speaker={
						<MenuPopover
							rowData={this.props.rowData}
							onSelect={this.handleSelectMenu}
						/>
					}
				>
					{this.props.children}
				</Whisper>
			)
		}
	}

	if (props.isFetchingLists) {
		return <Loader center size='lg' content='Loading...' vertical />
	}

	return (
		<Grid container justify='center' spacing={5}>
			<Grid container justify='center' spacing={2}>
				<Grid item xs={12} md={3} style={{ position: 'relative' }}>
					<CustomPanel header='Channels'>
						<animated.h2 style={{ height: 40 }}>
							{channelsValue.number.interpolate((val) => {
								if (val < 1000) {
									return numeral(Math.floor(val)).format('0,0')
								} else {
									return numeral(Math.floor(val)).format('0.0a')
								}
							})}
						</animated.h2>
					</CustomPanel>
				</Grid>
				<Grid item xs={12} md={3} style={{ position: 'relative' }}>
					<CustomPanel header='Videos'>
						<animated.h2 style={{ height: 40 }}>
							{videosValue.number.interpolate((val) => {
								if (val < 1000) {
									return numeral(Math.floor(val)).format('0,0')
								} else {
									return numeral(Math.floor(val)).format('0.0a')
								}
							})}
						</animated.h2>
					</CustomPanel>
				</Grid>
				<Grid item xs={12} md={3} style={{ position: 'relative' }}>
					<CustomPanel header='Subscribers'>
						<animated.h2 style={{ height: 40 }}>
							{subscribersValue.number.interpolate((val) => {
								if (val < 1000) {
									return numeral(Math.floor(val)).format('0,0')
								} else {
									return numeral(Math.floor(val)).format('0.0a')
								}
							})}
						</animated.h2>
					</CustomPanel>
				</Grid>
			</Grid>

			<Grid item xs={12}>
				<Grid
					container
					justify='flex-end'
					spacing={2}
					style={{ marginBottom: 20 }}
				>
					<Grid item>
						<ButtonToolbar>
							<Button onClick={() => handleCreateNewList()} color='green'>
								Build
							</Button>
							<Button onClick={handleUploadNewList}>Upload</Button>
						</ButtonToolbar>
					</Grid>
				</Grid>
			</Grid>

			<Grid item xs={12}>
				<Grid container justify='space-evenly'>
					<Grid item xs={12} md={2} style={{ position: 'relative' }}>
						<div style={{ position: 'absolute', top: -20, left: 0 }}>
							<p>Brand Profile</p>
						</div>
						<InputPicker
							size={'sm'}
							id='brandProfileId'
							label='Brand Profile'
							placeholder='Filter by Brand Profile'
							labelKey='brandName'
							valueKey='brandProfileId'
							data={props.brandProfiles}
							value={filterState.brandProfileId}
							onChange={(val) =>
								setFilterState((prevState) => {
									return {
										...prevState,
										brandProfileId: val
									}
								})
							}
						/>
					</Grid>

					<Grid item xs={12} md={2} style={{ position: 'relative' }}>
						<div style={{ position: 'absolute', top: -20, left: 0 }}>
							<p>SmartList Name</p>
						</div>
						<InputPicker
							size={'sm'}
							id='smartListId'
							label='SmartList'
							placeholder='Select a SmartList'
							labelKey='smartListName'
							valueKey='smartListId'
							data={smartLists}
							value={filterState.smartListId}
							onChange={(val) =>
								setFilterState((prevState) => {
									return {
										...prevState,
										smartListId: val
									}
								})
							}
						/>
					</Grid>

					<Grid item xs={12} md={2} style={{ position: 'relative' }}>
						<div style={{ position: 'absolute', top: -20, left: 0 }}>
							<p>Objective</p>
						</div>
						<InputPicker
							size={'sm'}
							id='objectiveId'
							label='Objective'
							placeholder='Filter by Objective'
							labelKey='objectiveName'
							valueKey='objectiveId'
							data={objectives}
							value={filterState.objectiveId}
							onChange={(val) =>
								setFilterState((prevState) => {
									return {
										...prevState,
										objectiveId: val
									}
								})
							}
						/>
					</Grid>

					<Grid item xs={12} md={2} style={{ position: 'relative' }}>
						<div style={{ position: 'absolute', top: -20, left: 0 }}>
							<p>Target Type</p>
						</div>
						<InputPicker
							size={'sm'}
							id='targetTypeId'
							label='Target Type'
							placeholder='Filter by Target Type'
							labelKey='targetTypeName'
							valueKey='targetTypeId'
							data={targetTypes}
							value={filterState.targetTypeId}
							onChange={(val) =>
								setFilterState((prevState) => {
									return {
										...prevState,
										targetTypeId: val
									}
								})
							}
						/>
					</Grid>

					<Grid item xs={12} md={2} style={{ position: 'relative' }}>
						<div style={{ position: 'absolute', top: -20, left: 0 }}>
							<p>Status</p>
						</div>
						<InputPicker
							size={'sm'}
							id='activeStatusId'
							label='Active'
							placeholder='Select a status'
							labelKey='activeStatusName'
							valueKey='activeStatusId'
							data={activeStatuses}
							value={filterState.activeStatusId}
							onChange={(val) =>
								setFilterState((prevState) => {
									return {
										...prevState,
										activeStatusId: val
									}
								})
							}
						/>
					</Grid>

					<Grid item xs={12} md={2} style={{ position: 'relative' }}>
						<div style={{ position: 'absolute', top: -20, left: 0 }}>
							<p>Archived Status</p>
						</div>
						<InputPicker
							size={'sm'}
							id='archivedStatusId'
							label='Archived'
							placeholder='Select a status'
							labelKey='archivedStatusName'
							valueKey='archivedStatusId'
							data={archivedStatuses}
							value={filterState.archivedStatusId}
							onChange={(val) =>
								setFilterState((prevState) => {
									return {
										...prevState,
										archivedStatusId: val
									}
								})
							}
						/>
					</Grid>
				</Grid>
			</Grid>

			<Grid item xs={12}>
				<Table
					height={600}
					data={visibleLists}
					sortColumn={currentSort.sortColumn}
					sortType={currentSort.sortType}
					onSortColumn={(sortColumn, sortType) => {
						setCurrentSort({ sortColumn, sortType })
					}}
				>
					<Table.Column width={60} sortable>
						<Table.HeaderCell>Id</Table.HeaderCell>
						<Table.Cell dataKey='smartListId' />
					</Table.Column>

					<Table.Column flexGrow={1} sortable>
						<Table.HeaderCell>SmartList</Table.HeaderCell>
						<Table.Cell dataKey='smartListName' />
					</Table.Column>

					<Table.Column flexGrow={1} sortable>
						<Table.HeaderCell>Brand Profile</Table.HeaderCell>
						<Table.Cell dataKey='brandProfileName' />
					</Table.Column>
					<Table.Column flexGrow={1} sortable>
						<Table.HeaderCell>Objective</Table.HeaderCell>
						<Table.Cell dataKey='objectiveName' />
					</Table.Column>
					<Table.Column flexGrow={1} sortable>
						<Table.HeaderCell>Target Type</Table.HeaderCell>
						<Table.Cell dataKey='targetType' />
					</Table.Column>

					<Table.Column sortable>
						<Table.HeaderCell>Status</Table.HeaderCell>
						<Table.Cell dataKey={'activeText'} />
					</Table.Column>
					<Table.Column flexGrow={1} sortable>
						<Table.HeaderCell>Channels</Table.HeaderCell>
						<ChannelCell dataKey={'channelCount'} />
					</Table.Column>
					<Table.Column flexGrow={1} sortable>
						<Table.HeaderCell>Videos</Table.HeaderCell>
						<VideoCell dataKey={'videoCount'} />
					</Table.Column>
					<Table.Column flexGrow={1} sortable>
						<Table.HeaderCell>Subscribers</Table.HeaderCell>
						<SubscriberCell dataKey={'subscriberCount'} />
					</Table.Column>

					<Table.Column width={60}>
						<Table.HeaderCell>Actions</Table.HeaderCell>
						<ActionCell customProps={props} />
					</Table.Column>
				</Table>
			</Grid>

			{!props.isFetchingLists &&
				props.fetchListsSuccess &&
				props.lists.length < 1 && (
					<h2 style={{ color: whiteColor }}>
						This account currently has no lists associated with it.
					</h2>
				)}
		</Grid>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(Lists)
