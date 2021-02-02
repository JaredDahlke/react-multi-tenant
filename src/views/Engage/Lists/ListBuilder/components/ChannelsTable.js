import React from 'react'
import ButtonGroup from 'rsuite/lib/ButtonGroup'
import Button from 'rsuite/lib/Button'
import debounce from 'just-debounce-it'
import Table from 'rsuite/lib/Table'
import Loader from 'rsuite/lib/Loader'
import { accentColor } from '../../../../../assets/jss/colorContants'
import Whisper from 'rsuite/lib/Whisper'
import Tooltip from 'rsuite/lib/Tooltip'
import { TooltipCell } from './TooltipCell'
import Grid from '@material-ui/core/Grid'
import '../../ListBuilder/components/listBuilder.css'
var dayjs = require('dayjs')
var calendar = require('dayjs/plugin/calendar')
dayjs.extend(calendar)

export default function ChannelsTable({
	channelsIsLoading,
	items,
	incrementPage,
	handleActionButtonClick,
	handleVideosClick,
	currentChannelsSort,
	setCurrentChannelsSort
}) {
	const hasMountedRef = React.useRef(false)

	const [actionsTaken, setActionsTaken] = React.useState(0)

	React.useEffect(() => {
		hasMountedRef.current = true
	}, [actionsTaken])

	const handleScroll = debounce(() => {
		incrementPage()
	}, 1200)

	const testClass = { height: 300 }
	const ActionCell = ({ rowData, dataKey, ...props }) => {
		return (
			<Table.Cell {...props} className='link-group' style={{ padding: 1 }}>
				<ButtonGroup vertical={false} size='xs'>
					<Button
						appearance={'ghost'}
						active={rowData.actionId === 1}
						style={{
							backgroundColor: rowData.actionId === 1 ? accentColor : ''
						}}
						onClick={() => {
							handleActionButtonClick(1, rowData)
							setActionsTaken((prevState) => prevState + 1)
						}}
					>
						Target
					</Button>
					<Button
						appearance={'ghost'}
						active={rowData.actionId === 3}
						style={{
							backgroundColor: rowData.actionId === 3 ? accentColor : ''
						}}
						onClick={() => {
							handleActionButtonClick(3, rowData)
							setActionsTaken((prevState) => prevState + 1)
						}}
					>
						Watch
					</Button>
					<Button
						appearance={'ghost'}
						active={rowData.actionId === 2}
						style={{
							backgroundColor: rowData.actionId === 2 ? accentColor : ''
						}}
						onClick={() => {
							handleActionButtonClick(2, rowData)
							setActionsTaken((prevState) => prevState + 1)
						}}
					>
						Block
					</Button>
				</ButtonGroup>
			</Table.Cell>
		)
	}

	const ImageCell = ({ rowData, dataKey, ...props }) => {
		return (
			<Table.Cell {...props} className='link-group' style={{ padding: 1 }}>
				<img src={rowData.thumbnail} width={50} style={{ borderRadius: 180 }} />
			</Table.Cell>
		)
	}

	const VideoCountCell = ({ rowData, dataKey, ...props }) => {
		return (
			<Table.Cell
				{...props}
				className='link-group'
				style={{ align: 'center', padding: 5 }}
			>
				<Whisper
					placement={'bottom'}
					trigger='hover'
					speaker={<Tooltip>{rowData.videosTooltip}</Tooltip>}
				>
					<Button appearance='link' onClick={() => handleVideosClick(rowData)}>
						{rowData.videosDisplay}
					</Button>
				</Whisper>
			</Table.Cell>
		)
	}

	return (
		<Table
			style={{ flex: 1, marginLeft: 15 }}
			rowClassName={'test-class'}
			sortColumn={currentChannelsSort.sortColumn}
			sortType={currentChannelsSort.sortType}
			onSortColumn={(sortColumn, sortType) => {
				if (!channelsIsLoading) {
					setCurrentChannelsSort({ sortColumn, sortType })
				}
			}}
			loading={items.length < 1 && channelsIsLoading}
			virtualized
			height={890}
			rowHeight={80}
			data={items}
			shouldUpdateScroll={false}
			onScroll={() => {
				handleScroll()
			}}
		>
			<Table.Column verticalAlign={'middle'} width={80}>
				<Table.HeaderCell></Table.HeaderCell>
				<ImageCell />
			</Table.Column>

			{/**<Table.Column verticalAlign={'middle'} align='center' sortable>
				<Table.HeaderCell>Country</Table.HeaderCell>
				<TooltipCell
					displayProp='countryDisplay'
					tooltipProp='countryTooltip'
					dataKey='countryCode'
				/>
			</Table.Column> */}

			<Table.Column verticalAlign={'middle'} sortable resizable>
				<Table.HeaderCell>Name</Table.HeaderCell>
				<TooltipCell
					displayProp='nameDisplay'
					tooltipProp='nameTooltip'
					tooltipPlacement='topLeft'
					dataKey='name'
				/>
			</Table.Column>
			<Table.Column verticalAlign={'middle'} align='center' sortable>
				<Table.HeaderCell>Uploaded</Table.HeaderCell>
				<TooltipCell
					displayProp='createDateDisplay'
					tooltipProp='createDateTooltip'
					dataKey='created'
				/>
			</Table.Column>

			{/**	<Table.Column verticalAlign={'middle'} align='center' sortable>
				<Table.HeaderCell>Id</Table.HeaderCell>
				<Table.Cell dataKey='id' style={{ color: 'grey' }} />
			</Table.Column> */}

			<Table.Column verticalAlign={'middle'} align='center' resizable>
				<Table.HeaderCell>YT Category</Table.HeaderCell>
				<TooltipCell
					displayProp='categoryDisplay'
					tooltipProp='categoryTooltip'
					dataKey='categoryName'
					tooltipPlacement='topLeft'
				/>
			</Table.Column>

			<Table.Column verticalAlign={'middle'} align='center' sortable resizable>
				<Table.HeaderCell>IAB Category</Table.HeaderCell>
				<TooltipCell
					dataKey='iabCategoryId'
					displayProp='iabCategoryName'
					tooltipProp='iabCategoryName'
				/>
			</Table.Column>

			<Table.Column verticalAlign={'middle'} align='center' sortable>
				<Table.HeaderCell>Videos</Table.HeaderCell>

				<VideoCountCell dataKey='allVideoCount' />
			</Table.Column>

			<Table.Column verticalAlign={'middle'} align='center' sortable>
				<Table.HeaderCell>Views</Table.HeaderCell>
				<TooltipCell
					dataKey='views'
					displayProp='viewsDisplay'
					tooltipProp='viewsTooltip'
				/>
			</Table.Column>

			<Table.Column verticalAlign={'middle'} align='center' sortable>
				<Table.HeaderCell>Subscribers</Table.HeaderCell>
				<TooltipCell
					displayProp='subscribersDisplay'
					tooltipProp='subscribersTooltip'
					dataKey='subscribers'
				/>
			</Table.Column>

			{/**	<Table.Column verticalAlign={'middle'} align='center' sortable>
				<Table.HeaderCell>IAB SubCategory</Table.HeaderCell>
				<TooltipCell
					dataKey='iabSubCategoryId'
					displayProp='iabSubCategoryName'
					tooltipProp='iabSubCategoryName'
				/>
			</Table.Column>

			<Table.Column verticalAlign={'middle'} align='center' sortable>
				<Table.HeaderCell>IAB Topic</Table.HeaderCell>
				<TooltipCell
					dataKey='iabTopicId'
					displayProp='iabTopicName'
					tooltipProp='iabTopicName'
				/>
			</Table.Column>
			<Table.Column verticalAlign={'middle'} align='center' sortable>
				<Table.HeaderCell>IAB SubTopic</Table.HeaderCell>
				<TooltipCell
					dataKey='iabSubTopicId'
					displayProp='iabSubTopicName'
					tooltipProp='iabSubTopicName'
				/>
			</Table.Column> */}

			<Table.Column width={180} verticalAlign={'middle'}>
				<Table.HeaderCell></Table.HeaderCell>
				<ActionCell />
			</Table.Column>
		</Table>
	)
}
