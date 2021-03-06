import React from 'react'
import Sidebar from 'rsuite/lib/Sidebar'
import Icon from 'rsuite/lib/Icon'
import Grid from '@material-ui/core/Grid'
import { useSpring, animated } from 'react-spring'
import PanelGroup from 'rsuite/lib/PanelGroup'
import SelectPicker from 'rsuite/lib/SelectPicker'
import CustomPanel from '../../../../../components/CustomPanel'
import Button from 'rsuite/lib/Button'
import ArrowLeft from '@material-ui/icons/ArrowLeftSharp'
import ArrowRight from '@material-ui/icons/ArrowRightSharp'
import InputGroup from 'rsuite/lib/InputGroup'
import InputNumber from 'rsuite/lib/InputNumber'
import DateRangePicker from 'rsuite/lib/DateRangePicker'
import FiltersLabel from './FiltersLabel'
import CheckTreePicker from 'rsuite/lib/CheckTreePicker'
import { iabCategoriesFilter } from '../../../../../staticData/iabCategories'
import TagPicker from 'rsuite/lib/TagPicker'
import Checkbox from 'rsuite/lib/Checkbox'
import { listActions } from '../../constants'
import {
	youtubeCategories,
	countriesOptions,
	languagesOptions
} from '../../../../../staticData/data'
var dayjs = require('dayjs')
const filterSpacing = 1

const actionIdOptions = [
	{
		label: 'View All',
		actionIds: null,
		id: 6
	},
	{
		label: 'No Action',
		actionIds: [],
		id: 5
	},
	{
		label: 'Target',
		actionIds: [listActions.target.actionId],
		id: listActions.target.actionId
	},
	{
		label: 'Block',
		actionIds: [listActions.block.actionId],
		id: listActions.block.actionId
	},
	{
		label: 'Watch',
		actionIds: [listActions.watch.actionId],
		id: listActions.watch.actionId
	},
	{
		label: 'All Actions',
		actionIds: [
			listActions.target.actionId,
			listActions.block.actionId,
			listActions.watch.actionId
		],
		id: 4
	}
]

export const FiltersSideBar = ({
	expand,
	handleToggle,
	filterState,
	handleApplyFiltersButtonClick,
	handleFilterChange,
	filters
}) => {
	const sidebarProps = useSpring({
		width: expand ? 450 : 40
	})

	const contentProps = useSpring({
		width: expand ? 450 : 0,
		opacity: expand ? 1 : 0
	})

	return (
		<div>
			<Sidebar style={sidebarProps}>
				<CustomPanel
					bodyFill
					header={
						<div
							style={{ display: 'flex', cursor: 'pointer' }}
							onClick={handleToggle}
						>
							<div style={{ textAlign: 'left', flex: 1, marginTop: 11 }}>
								<Icon size='lg' icon='filter' />
							</div>
							<div
								style={{
									marginLeft: -10,
									textAlign: 'right',
									flex: 1
								}}
							>
								{expand ? (
									<ArrowLeft
										style={{
											fontSize: 45,
											color: '#0092d1'
										}}
									/>
								) : (
									<ArrowRight style={{ fontSize: 45, color: '#0092d1' }} />
								)}
							</div>
						</div>
					}
				>
					<animated.div style={contentProps}>
						<PanelGroup>
							<CustomPanel header='Actions Taken'>
								<SelectPicker
									disabled={!expand}
									size='xs'
									labelKey={'label'}
									valueKey={'actionIds'}
									placeholder={'Select'}
									data={actionIdOptions}
									value={filterState.actionIds}
									//	defaultValue={filterState.actionIds}
									onChange={(val) => {
										handleFilterChange(filters.actionIds, val)
									}}
									cleanable={false}
									block
									preventOverflow={true}
									searchable={false}
								/>
							</CustomPanel>

							<CustomPanel header='SmartList Filters'>
								<Grid container spacing={filterSpacing}>
									<Grid item xs={12}>
										<FiltersLabel text='IAB Categories' />
										<CheckTreePicker
											size={'xs'}
											defaultExpandAll={false}
											data={iabCategoriesFilter}
											labelKey={'name'}
											valueKey={'id'}
											onChange={(val) => {
												console.log('on change')
												console.log(filters)
												handleFilterChange(filters.iabCategories, val)
											}}
											cascade={true}
											block
											disabled={!expand}
										/>
									</Grid>
								</Grid>
							</CustomPanel>

							<CustomPanel header='YouTube Filters'>
								<Grid container spacing={filterSpacing}>
									<Grid item xs={12}>
										<TagPicker
											disabled={!expand}
											block
											size={'xs'}
											data={countriesOptions}
											labelKey={'countryName'}
											valueKey={'countryCode'}
											//defaultValue={['US']}
											placeholder='Countries'
											onChange={(val) => {
												handleFilterChange(filters.countries, val)
											}}
										/>
									</Grid>

									<Grid item xs={12}>
										<TagPicker
											block
											disabled={!expand}
											size={'xs'}
											data={languagesOptions}
											labelKey={'languageName'}
											valueKey={'languageCode'}
											//defaultValue={['en']}
											virtualized={true}
											placeholder='Languages'
											onChange={(val) => {
												handleFilterChange(filters.languages, val)
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<TagPicker
											block
											size={'xs'}
											disabled={!expand}
											data={youtubeCategories}
											labelKey={'categoryName'}
											valueKey={'categoryId'}
											virtualized={true}
											placeholder='Youtube Categories'
											onChange={(val) => {
												handleFilterChange(filters.categories, val)
											}}
										/>
									</Grid>

									<Grid item xs={12}>
										<Checkbox
											disabled={!expand}
											size={'xs'}
											onChange={(na, bool) => {
												handleFilterChange(filters.kids, bool)
											}}
										>
											Kids Only
										</Checkbox>
									</Grid>
								</Grid>
							</CustomPanel>
							<CustomPanel header='Video Filters'>
								<Grid container spacing={filterSpacing}>
									<Grid item xs={12}>
										<FiltersLabel text='Views' />
										<InputGroup size='xs'>
											<InputNumber
												step={10000}
												size='xs'
												disabled={!expand}
												value={filterState.views.min}
												onFocus={(event) => event.target.select()}
												placeholder={'Min'}
												min={0}
												onChange={(nextValue) => {
													let value = {
														min: Number(nextValue),
														max: filterState.views.max
													}
													handleFilterChange(filters.views, value)
												}}
											/>

											<InputGroup.Addon>to</InputGroup.Addon>
											<InputNumber
												disabled={!expand}
												step={10000}
												onFocus={(event) => event.target.select()}
												size='xs'
												min={0}
												placeholder={'Max'}
												value={filterState.views.max}
												onChange={(nextValue) => {
													let value = {
														min: filterState.views.min,
														max: Number(nextValue)
													}
													handleFilterChange(filters.views, value)
												}}
											/>
										</InputGroup>
										<Button
											disabled={!expand}
											size='xs'
											appearance='link'
											onClick={() =>
												handleFilterChange(filters.views, {
													min: null,
													max: null
												})
											}
										>
											Clear
										</Button>
									</Grid>

									<Grid item xs={12}>
										<FiltersLabel text='Duration (minutes)' />
										<InputGroup size='xs'>
											<InputNumber
												disabled={!expand}
												value={filterState.videoDurationSeconds.min}
												size='xs'
												onFocus={(event) => event.target.select()}
												placeholder={'Min'}
												onChange={(nextValue) => {
													let value = {
														min: Number(nextValue),
														max: filterState.videoDurationSeconds.max
													}
													handleFilterChange(
														filters.videoDurationSeconds,
														value
													)
												}}
											/>

											<InputGroup.Addon>to</InputGroup.Addon>
											<InputNumber
												disabled={!expand}
												value={filterState.videoDurationSeconds.max}
												onFocus={(event) => event.target.select()}
												size='xs'
												min={0}
												placeholder={'Max'}
												onChange={(nextValue) => {
													let value = {
														min: filterState.videoDurationSeconds.min,
														max: Number(nextValue)
													}
													handleFilterChange(
														filters.videoDurationSeconds,
														value
													)
												}}
											/>
										</InputGroup>
										<Button
											disabled={!expand}
											size='xs'
											appearance='link'
											onClick={() =>
												handleFilterChange(filters.videoDurationSeconds, {
													min: null,
													max: null
												})
											}
										>
											Clear
										</Button>
									</Grid>

									<Grid item xs={12}>
										<FiltersLabel text='Upload Date' />
										<DateRangePicker
											disabled={!expand}
											block
											size='xs'
											showOneCalendar
											placement='topStart'
											onChange={(val) => {
												let value = {}
												if (val.length > 0) {
													value = {
														min: dayjs(val[0]).format('YYYY-MM-DD'),
														max: dayjs(val[1]).format('YYYY-MM-DD')
													}
												}
												handleFilterChange(filters.uploadDate, value)
											}}
										/>
									</Grid>
								</Grid>
							</CustomPanel>
							<CustomPanel>
								<Button
									disabled={!expand}
									block
									size='xs'
									onClick={handleApplyFiltersButtonClick}
								>
									Apply Filters
								</Button>
							</CustomPanel>
						</PanelGroup>
					</animated.div>
				</CustomPanel>
			</Sidebar>
		</div>
	)
}
