import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import GridItem from '../../../components/Grid/GridItem.js'
import Button from 'rsuite/lib/Button'
import { Modal, Form, FormGroup, FormControl, ControlLabel, HelpBlock, Schema } from 'rsuite'
import Table from '@material-ui/core/Table'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import makeStyles from '@material-ui/core/styles/makeStyles'
import classnames from 'classnames'
import { useHistory } from 'react-router-dom'
import {
  fetchAdminLabels,
  createLabel,
  deleteLabel,
  setLabelDeleted,
  setLabelCreated,
  setInitLabelAdd
} from '../../../redux/actions/admin/scenarios'
import { connect } from 'react-redux'
import styles from '../../../assets/jss/material-dashboard-react/components/tasksStyle.js'
import tableStyles from '../../../assets/jss/material-dashboard-react/components/tableStyle.js'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import { FormLoader } from '../../../components/SkeletonLoader'
// import { routes } from '../../../routes'

const useTableStyles = makeStyles(tableStyles)

const useStyles = makeStyles(styles)

const mapStateToProps = (state) => {
  return {
    labelsIsLoading: state.admin.labelsIsLoading,
    initLabelAdd: state.admin.initLabelAdd,
    labelSaving: state.admin.labelSaving,
    labelCreated: state.admin.labelCreated,
    labelDeleted: state.admin.labelDeleted,
    labelDeleting: state.admin.labelDeleting,
    adminLabels: state.admin.labels
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAdminLabels: () => dispatch(fetchAdminLabels()),
    createLabel: (label) => dispatch(createLabel(label)),
    deleteLabel: (labelId) => dispatch(deleteLabel(labelId)),
    setLabelDeleted: (bool) => dispatch(setLabelDeleted(bool)),
    setLabelCreated: (bool) => dispatch(setLabelCreated(bool)),
    setInitLabelAdd: (bool) => dispatch(setInitLabelAdd(bool))
  }
}

function Labels(props) {
  let history = useHistory()
  let form;

  const classes = useStyles()
  const tableClasses = useTableStyles()
  const [formValues, setFormValues] = useState();

  const { StringType } = Schema.Types;
  const model = Schema.Model({
    labelName: StringType().isRequired('Label Name is required.')
  });


  const handleSubmit = () => {
    if (!form.check()) {
      console.error('Form Error');
      return;
    }
    else {
      props.createLabel(formValues)
    }
  }

  const { fetchAdminLabels, adminLabels } = props
  React.useEffect(() => {
    if (adminLabels.length === 0) {
      fetchAdminLabels()
    }
  })

  const tableCellClasses = classnames(classes.tableCell, {
    [classes.tableCellRTL]: false
  })

  const userHeaders = ['Label Name', '']

  const handleDeleteLabelClick = (labelId) => {
    props.deleteLabel(labelId)
  }

  const handleCreateLabelClick = () => {
    alert('create Label')
  }

  return (
    <Grid container justify='center'>
      <Snackbar
        autoHideDuration={2000}
        place='bc'
        open={props.labelDeleted}
        onClose={() => props.setLabelDeleted(false)}
        color='success'
      >
        <Alert
          onClose={() => props.setLabelDeleted(false)}
          severity='success'
        >
          Label Deleted
				</Alert>
      </Snackbar>

      <Snackbar
        autoHideDuration={2000}
        place='bc'
        open={props.labelCreated}
        onClose={() => props.setLabelCreated(false)}
        color='success'
      >
        <Alert
          onClose={() => props.setLabelCreated(false)}
          severity='success'
        >
          Label Saved
				</Alert>
      </Snackbar>

      <GridItem xs={12} sm={12} md={10}>
        {adminLabels && adminLabels.length > 0 ? (
          <div>
            <Button appearance='primary' onClick={() => props.setInitLabelAdd(true)}>
              Create Label
						</Button>

            <Modal show={props.initLabelAdd} onHide={() => props.setInitLabelAdd(false)}>
              <Form
                fluid
                ref={ref => (form = ref)}
                model={model}
                onChange={formValue => {
                  setFormValues(formValue)
                }}
              >
                <Modal.Header>
                  <Modal.Title>Add Label</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                  <FormGroup>
                    <ControlLabel>Label Name</ControlLabel>
                    <FormControl name="labelName" />
                    <HelpBlock>Required</HelpBlock>
                  </FormGroup>

                </Modal.Body>
                <Modal.Footer>
                  <Button
                    loading={props.labelSaving}
                    onClick={() => handleSubmit()}
                    appearance="primary">
                    Save
                </Button>
                  <Button onClick={() => props.setInitLabelAdd(false)} appearance="subtle">
                    Cancel
                </Button>
                </Modal.Footer>
              </Form>
            </Modal>

            <Table className={classes.table}>
              <TableHead className={tableClasses['primaryTableHeader']}>
                <TableRow className={tableClasses.tableHeadRow}>
                  {userHeaders.map((prop, key) => {
                    return (
                      <TableCell
                        className={
                          tableClasses.tableCell +
                          ' ' +
                          tableClasses.tableHeadCell
                        }
                        key={key}
                      >
                        {prop}
                      </TableCell>
                    )
                  })}
                </TableRow>
              </TableHead>

              <TableBody>
                {adminLabels &&
                  adminLabels.map((label) => (
                    <TableRow
                      key={label.labelId || 'placeholder'}
                      className={classes.tableRow}
                    >
                      <TableCell className={tableCellClasses}>
                        {label.labelName}
                      </TableCell>

                      <TableCell className={classes.tableActions}>
                        <Button
                          appearance='link'
                          loading={
                            props.labelDeleting === label.labelId
                          }
                          onClick={() => {
                            handleDeleteLabelClick(label.labelId)
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        ) : props.labelsIsLoading ? (
          <FormLoader />
        ) : (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',

                  height: 'calc(100vh - 200px)',
                  color: 'white'
                }}
              >
                <Button appearance='primary' onClick={handleCreateLabelClick}>
                  Create Label
						</Button>
              </div>
            )}
      </GridItem>
    </Grid >
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Labels)
