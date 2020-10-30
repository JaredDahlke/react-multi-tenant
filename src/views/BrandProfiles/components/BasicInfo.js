import React from 'react'
import GridItem from '../../../components/Grid/GridItem.js'
import GridContainer from '../../../components/Grid/GridContainer.js'
import InputAdornment from '@material-ui/core/InputAdornment'
import { grayColor } from '../../../assets/jss/material-dashboard-react.js'
import FormikInput from '../../../components/CustomInput/FormikInput'
import FormikSelect from '../../../components/CustomSelect/FormikSelect'

export default function BasicInfo(props) {
	return (
		<div>
			<GridContainer>
				<GridItem xs={12} sm={8} md={4}>
					<FormikInput
						name='basicInfoProfileName'
						labelText='Brand Profile Name'
					/>
				</GridItem>
			</GridContainer>

			<GridContainer>
				<GridItem xs={12} sm={8} md={4}>
					<FormikInput name='basicInfoWebsiteUrl' labelText='Website' />
				</GridItem>
			</GridContainer>

			<GridContainer>
				<GridItem xs={10} sm={10} md={4}>
					<FormikSelect
						id='industryVertical'
						name='basicInfoIndustryVerticalId'
						label='Industry Vertical'
						placeholder='Industry Vertical'
						optionLabel='industryVerticalName'
						optionValue='industryVerticalId'
						options={props.industryVerticals}
						value={props.values.basicInfoIndustryVerticalId}
						onChange={props.setFieldValue}
						onBlur={props.setFieldTouched}
						validateField={props.validateField}
						validateForm={props.validateForm}
						touched={props.touched.basicInfoIndustryVerticalId}
						error={props.errors.basicInfoIndustryVerticalId}
					/>
				</GridItem>
			</GridContainer>

			<GridContainer>
				<GridItem xs={12} sm={8} md={4}>
					<FormikInput
						name='basicInfoTwitterProfile'
						labelText='Twitter Profile'
						startAdornmentText={'https://twitter.com/'}
						inputProps={{}}
					/>
				</GridItem>
			</GridContainer>
		</div>
	)
}
