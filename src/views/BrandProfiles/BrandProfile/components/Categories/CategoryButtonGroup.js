import React from 'react'
import GridItem from '../../../../../components/Grid/GridItem'
import GridContainer from '../../../../../components/Grid/GridContainer'
import ButtonGroup from 'rsuite/lib/ButtonGroup'
import Button from 'rsuite/lib/Button'
import { neutralColor } from '../../../../../assets/jss/colorContants'
import { perms, userCan } from '../../../../../Can'

export default function CategoryButtonGroup(props) {
	const [handlingClick, setHandlingClick] = React.useState(false)
	const handleClick = (val) => {
		if (!handlingClick) {
			setHandlingClick(true)
			let contentCategoryResponseId = val
			props.handleCategorySelect(
				props.category.contentCategoryId,
				contentCategoryResponseId
			)
			setHandlingClick(false)
		}
	}

	return (
		<GridContainer>
			<GridItem xs={6} sm={6} md={6}>
				<div
					style={{
						fontSize: '16px',
						float: 'right'
					}}
				>
					{props.category.contentCategory}
				</div>
			</GridItem>

			<GridItem xs={6} sm={6} md={6}>
				<ButtonGroup size='xs'>
					<Button
						disabled={!userCan(perms.BRAND_PROFILE_UPDATE)}
						key='0'
						id='0'
						onClick={(e) => handleClick(1)}
						color={
							props.category.contentCategoryResponseId == 1 ? 'green' : 'blue'
						}
					>
						Target
					</Button>
					<Button
						disabled={!userCan(perms.BRAND_PROFILE_UPDATE)}
						key='1'
						onClick={(e) => handleClick(2)}
						color={
							props.category.contentCategoryResponseId == 2 ? 'red' : 'blue'
						}
					>
						Block
					</Button>
				</ButtonGroup>
				<div style={{ color: neutralColor, height: 15 }} />
			</GridItem>
		</GridContainer>
	)
}
