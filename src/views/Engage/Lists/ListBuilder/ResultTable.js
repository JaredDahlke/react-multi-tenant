import React from 'react'
import { FixedSizeList as List } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import Grid from '@material-ui/core/Grid'
import Panel from '../../../../components/CustomPanel'
import {
	neutralLightColor,
	neutralExtraExtraLightColor
} from '../../../../assets/jss/colorContants'
import ButtonGroup from 'rsuite/lib/ButtonGroup'
import Button from 'rsuite/lib/Button'
import numeral from 'numeral'
import Whisper from 'rsuite/lib/Whisper'
import Tooltip from 'rsuite/lib/Tooltip'
import Icon from 'rsuite/lib/Icon'

export default function ResultTable({
	// Are there more items to load?
	// (This information comes from the most recent API request.)
	hasNextPage,

	// Are we currently loading a page of items?
	// (This may be an in-flight flag in your Redux store for example.)
	isNextPageLoading,

	// Array of items loaded so far.
	items,

	// Callback function responsible for loading the next page of items.
	loadNextPage,

	handleActionButtonClick,
	isChannels
}) {
	// We create a reference for the InfiniteLoader
	const infiniteLoaderRef = React.useRef(null)
	const hasMountedRef = React.useRef(false)

	const [actionsTaken, setActionsTaken] = React.useState(0)

	// Each time the sort prop changed we called the method resetloadMoreItemsCache to clear the cache
	React.useEffect(() => {
		// We only need to reset cached items when "sortOrder" changes.
		// This effect will run on mount too; there's no need to reset in that case.
		if (hasMountedRef.current) {
			if (infiniteLoaderRef.current) {
				infiniteLoaderRef.current.resetloadMoreItemsCache()
			}
		}
		hasMountedRef.current = true
	}, [actionsTaken])

	// If there are more items to be loaded then add an extra row to hold a loading indicator.
	const itemCount = hasNextPage ? items.length + 1 : items.length

	// Only load 1 page of items at a time.
	// Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
	const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage

	// Every row is loaded except for our loading indicator row.
	const isItemLoaded = (index) => !hasNextPage || index < items.length

	// Render an item or a loading indicator.
	const Item = ({ index, style }) => {
		if (!isItemLoaded(index)) {
			return <div style={style}>Loading...</div>
		} else {
			let item = items[index]
			let abbreviatedDescription = item.description
				? item.description.substring(0, 50)
				: ''
			return (
				<div style={style}>
					<Panel
						bordered
						style={{
							marginBottom: 20,
							marginRight: 20,
							backgroundColor: neutralLightColor
						}}
						header={<h4>{item.name}</h4>}
					>
						<Grid container spacing={3} style={{ position: 'relative' }}>
							<Grid item xs={12}>
								<Whisper
									placement='bottomStart'
									trigger='hover'
									speaker={<Tooltip>{item.description}</Tooltip>}
								>
									<div>{abbreviatedDescription}</div>
								</Whisper>
							</Grid>
							<Grid item xs={12}>
								{isChannels && (
									<Grid container>
										<Grid item xs={2}>
											Subscribers
											<br />
											{numeral(item.subscribers).format('0.0a')}
										</Grid>
										<Grid item xs={2}>
											Videos
											<br />
											{numeral(item.videos).format('0.0a')}
										</Grid>
										<Grid item xs={2}>
											Views
											<br />
											{numeral(item.views).format('0.0a')}
										</Grid>
										<Grid item xs={2}>
											Country
											<br />
											{item.country}
										</Grid>
										<Grid item xs={2}>
											Id
											<br />
											{item.id}
										</Grid>
									</Grid>
								)}
							</Grid>
							<Grid item xs={12}>
								<ButtonGroup>
									<Button
										active={item.actionId === 1}
										onClick={() => {
											handleActionButtonClick(1, item)
											setActionsTaken((prevState) => prevState + 1)
										}}
									>
										Target
									</Button>
									<Button
										active={item.actionId === 3}
										onClick={() => {
											handleActionButtonClick(3, item)
											setActionsTaken((prevState) => prevState + 1)
										}}
									>
										Watch
									</Button>
									<Button
										active={item.actionId === 2}
										onClick={() => {
											handleActionButtonClick(2, item)
											setActionsTaken((prevState) => prevState + 1)
										}}
									>
										Block
									</Button>
								</ButtonGroup>
							</Grid>
						</Grid>
					</Panel>
				</div>
			)
		}
	}

	return (
		<InfiniteLoader
			ref={infiniteLoaderRef}
			isItemLoaded={isItemLoaded}
			itemCount={itemCount}
			loadMoreItems={loadMoreItems}
		>
			{({ onItemsRendered, ref }) => (
				<List
					className='List'
					height={500}
					itemCount={itemCount}
					itemSize={250}
					onItemsRendered={onItemsRendered}
					ref={ref}
					width={800}
				>
					{Item}
				</List>
			)}
		</InfiniteLoader>
	)
}
