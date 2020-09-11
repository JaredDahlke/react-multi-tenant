/* eslint-disable semi, indent, no-mixed-operators, no-underscore-dangle */
import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import GridItem from "../../components/Grid/GridItem.js"
import GridContainer from "../../components/Grid/GridContainer.js"
import CustomInput from "../../components/CustomInput/CustomInput.js"
import Button from "../../components/CustomButtons/Button.js"
import Card from "../../components/Card/Card.js"
import CardHeader from "../../components/Card/CardHeader.js"
import CardBody from "../../components/Card/CardBody.js"
import CardFooter from "../../components/Card/CardFooter.js"
import {connect} from 'react-redux'
import {rolesFetchData} from '../../redux/actions/roles'
import config from '../../config.js'
import CustomCheckbox from "../../components/CustomCheckbox/Checkbox"
import CustomSelect from "../../components/CustomSelect/CustomSelect.js"
import {isValidEmail, isValidFullName} from "../../utils"


import CustomTree from '../../components/Tree/CustomTree'


const myData = [{"title":"Dummy Account","key":"0-0-key","children":[{"title":"0-0-0-label","key":"0-0-0-key","children":[{"title":"0-0-0-0-label","key":"0-0-0-0-key"},{"title":"0-0-0-1-label","key":"0-0-0-1-key"},{"title":"0-0-0-2-label","key":"0-0-0-2-key"}]},{"title":"0-0-1-label","key":"0-0-1-key","children":[{"title":"0-0-1-0-label","key":"0-0-1-0-key"},{"title":"0-0-1-1-label","key":"0-0-1-1-key"},{"title":"0-0-1-2-label","key":"0-0-1-2-key"}]},{"title":"0-0-2-label","key":"0-0-2-key"}]},{"title":"0-1-label","key":"0-1-key","children":[{"title":"0-1-0-label","key":"0-1-0-key","children":[{"title":"0-1-0-0-label","key":"0-1-0-0-key"},{"title":"0-1-0-1-label","key":"0-1-0-1-key"},{"title":"0-1-0-2-label","key":"0-1-0-2-key"}]},{"title":"0-1-1-label","key":"0-1-1-key","children":[{"title":"0-1-1-0-label","key":"0-1-1-0-key"},{"title":"0-1-1-1-label","key":"0-1-1-1-key"},{"title":"0-1-1-2-label","key":"0-1-1-2-key"}]},{"title":"0-1-2-label","key":"0-1-2-key"}]},{"title":"0-2-label","key":"0-2-key"}]


const apiBase = config.apiGateway.URL

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  alignRight: {
    float: "right",
    
  },
  root: {
    display: 'flex',
    justifyContent: 'left',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: .5,
    margin: .5,
  },
  chip: {
    margin: .5,
  },
}

const useStyles = makeStyles(styles)


const mapStateToProps = (state) => {
  return {
    roles: state.roles.data,
    hasErrored: state.rolesHasErrored,
    isLoading: state.rolesIsLoading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: (url) => dispatch(rolesFetchData(url))
  }
}


function CreateUser  (props) {


  const {fetchData} = props
  
  React.useEffect(() => {
    let url =  apiBase + '/role'
    fetchData(url)
  }, [fetchData])



  const classes = useStyles()
  const [selectedRoles, setSelectedRoles] = React.useState([])
  const [internalUserChecked, setInternalUserChecked] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [fullName, setFullName] = React.useState('')
  const [company, setCompany] = React.useState('')

  const handleRoleSelect = (event) => {
    setSelectedRoles(event.target.value)
  }

 

  function handleEmailChange (event) {
    setEmail(event.target.value)
  }

  function handleFullNameChange (event) {
    setFullName(event.target.value)
  }

  function handleCompanyChange (event) {
    setCompany(event.target.value)
  }

  const formIsValid = () => {
    if ((company.length >= 2) && (isValidEmail(email)) && (isValidFullName(fullName)) && (selectedRoles.length > 0)) return true
    return false
  }

  return (
    <Card>

      <CardBody>
      
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
            
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Invite a new user</h4>
                <p className={classes.cardCategoryWhite}></p>
              </CardHeader>
              
              <CardBody>
                <GridContainer>
                  
                  <GridItem xs={12} sm={12} md={5}>
                    <CustomInput
                      labelText="Company"
                      id="company-disabled"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled: false,
                        value: company,
                        onChange: handleCompanyChange
                      }}
                      error={company.length > 0 && company.length < 2}
                      success={company.length >= 2}
                    />
                  </GridItem>
                

                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Email address"
                      id="email-address"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: 'email',
                        value: email,
                        onChange: handleEmailChange
                      }}
                      handleClear={()=>setEmail('')}
                      error={email.length > 0 && !isValidEmail(email)}
                      success={isValidEmail(email)}
                    />
                  </GridItem>

              

                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Full Name"
                      id="full-name"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: fullName,
                        onChange: handleFullNameChange
                      }}
                      error={fullName.length > 0 && !isValidFullName(fullName)}
                      success={isValidFullName(fullName)}
                    />
                  </GridItem>

                  <GridItem xs={10} sm={10} md={10}>
                    <CustomSelect
                      roles={props.roles}
                      labelText='Role'
                      handleItemSelect={handleRoleSelect}
                      value={selectedRoles}
                      multiple={true}
                      success={selectedRoles.length > 0}
                      formControlProps={{
                        fullWidth: true
                      }}
                     
                    />
                  </GridItem>

                 {
                   selectedRoles.includes(11) ?

                  <GridItem xs={12} sm={12} md={8}>
                    <CustomTree
                      data={myData}
                      title='Account Access'
                      search={true}
                      treeContainerHeight={150}
                    />
                  </GridItem>

                   :

                   null
                 }

                  
                  
                


                  <GridItem xs={12} sm={12} md={12}>
                    <CustomCheckbox
                      checked={internalUserChecked}
                      //tabIndex={-1}
                      changed={()=>setInternalUserChecked(!internalUserChecked)}
                      formControlProps={{
                        fullWidth: true
                      }}
                      labelText="Internal User"                 
                    />             
                  </GridItem>
                
                
                </GridContainer>         
                
              </CardBody>
              <CardFooter>
                <Button disabled={!formIsValid()} color="primary">Invite User</Button>
              </CardFooter>
            </Card>
          </GridItem>
          
        </GridContainer>
            
      </CardBody>

    
      
               
    </Card>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateUser)