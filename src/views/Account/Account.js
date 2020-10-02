//import React from "react";
 //core components

/*import { makeStyles } from '@material-ui/core/styles';
import {connect} from 'react-redux'
import Tree from 'react-d3-tree';
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Grid from '@material-ui/core/Grid'

//import CardActions from '@material-ui/core/CardActions';
//import CardContent from '@material-ui/core/CardContent';
//import Button from '../../components/CustomButtons/Button';
//import Typography from '@material-ui/core/Typography';
import { grayColor, whiteColor, blackColor, primaryColor } from "../../assets/jss/material-dashboard-react.js";
import IconButton from '@material-ui/core/IconButton'
import Details from '@material-ui/icons/Details'
import {Link} from 'react-router-dom'

import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardFooter from "../../components/Card/CardFooter.js";
import logo from '../../assets/img/sightly_icon.png'
import {logoStyleAccountChrome} from '../../assets/jss/material-dashboard-react'
import FullScreenDialog from './AccountDialog'
import AccountCard from './AccountCard'
import {fetchAccountUsers} from '../../redux/actions/accounts'


const useStyles = makeStyles({
  root: {
    maxWidth: 200,
    backgroundColor: whiteColor,
    justify: "center"
  }
});

 function MediaCard(props) {
  const classes = useStyles();

  return (
    <div>
      {props.nodeData.accountId === 0 ?
      
      <img src={logo} alt="logo" style={logoStyleAccountChrome}  />
    
      :
    <Card className={classes.root}>
      <GridContainer justify='center'>

        

       
        <CardContent>

            <Typography   component="h4">
            {props.nodeData.accountName}
            </Typography>
         

             <GridContainer justify='center'>      
                <GridContainer justify='center'>        
                <CardActions style={{color:primaryColor[0]}}>
                 <div onClick={()=>props.handleViewAccount(props.nodeData)}>
                  View Details    
                  </div>
               
                  </CardActions>  
                         
                </GridContainer>
            </GridContainer>        
          
        </CardContent>

      </GridContainer>
    </Card>
 }
    </div>
    
  );
}

const containerStyles = {
  width: "100%",
  height: "100vh"
};



const mapStateToProps = (state) => {
  return {
    treeAccounts: state.treeAccounts,
    users: state.users,
    accounts: state.accounts,
    editAccountAccountUsersLoading: state.editAccountAccountUsersLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAccountUsers: (accountId)=>dispatch(fetchAccountUsers(accountId))
  }
}



class CenteredTree extends React.PureComponent {
  state = {};
  height = 150;
  width = 150;
  yOffset = 80;
  yClearance = 150;


  componentDidMount() {
    const dimensions = this.treeContainer.getBoundingClientRect();
    this.setState({
      translate: {
        x: dimensions.width / 2,
        y: this.yOffset
      },
      open: false,
      account: {accountName: ''}
    });   

    console.log('receiving props')
    console.log(this.props.treeAccounts)
    //console.log(JSON.stringify(this.props.accounts.data))
    //let myAccounts = this.convertToHier(this.props.accounts.data)
  }


  componentDidUpdate() {
    console.log('component did update')
    console.log(this.props.treeAccounts)
    //console.log(JSON.stringify(this.props.accounts.data))
    //let myAccounts = this.convertToHier(this.props.accounts.data)

   // this.setState({
    //  myAccounts: {
   //     test:'test'
    //  }
    //});

  }

   handleViewAccount=(account)=>{

    this.setState({
      open:true,
      account
    })

    this.props.fetchAccountUsers(account.accountId)
  }

  handleClose=()=>{
    this.setState({
      open:false
    })
  }

  handleSave=(values)=>{
    console.log('handle save')
    console.log(values)
  }
  

  

  click = event => {
    console.log(event);
  };

  over = event => {
    //console.log(event);
  };

  render() {

    let dialogOpen = this.state.open ? this.state.open : false
    
    //console.log(JSON.stringify(this.props.accounts.data))
    return (
      <div style={containerStyles} ref={tc => (this.treeContainer = tc)}>

        <FullScreenDialog 
          open={dialogOpen}
          handleClose={this.handleClose}
          handleSave={this.handleSave}
          handleOpen={this.handleOpen}
          account={this.state.account}
          users={this.props.users}
          accounts={this.props.accounts}
          editAccountAccountUsersLoading={this.props.editAccountAccountUsersLoading}
        />


       
       
        {this.props.treeAccounts && this.props.treeAccounts.length > 0 ?
        

            <Tree
              data={this.props.treeAccounts}
              collapsible={false}
              translate={this.state.translate}
              scaleExtent={{ min: 1, max: 3 }}
              allowForeignObjects
              pathFunc="straight"
              orientation="vertical"
              nodeSvgShape={{ shape: "none" }}
              nodeSize={{ x: 200, y: this.yClearance }}
              onClick={e => this.click(e)}
              onMouseOver={e => this.over(e)}
              styles={{
                links: {
                    
                      stroke: primaryColor[0],
                      strokeWidth: "2px",
                    },
            }}
              nodeLabelComponent={{
                render: <MediaCard handleViewAccount={this.handleViewAccount}/>,
                foreignObjectWrapper: {
                  style: {
                
                    
                    width: this.width.toString() + "px",
                    height: this.height.toString() + "px",
                    x: this.width / -2,
                    y: this.height / -2
                  }
                }
              }}
            />

          
          : null
       }
        
      
        
      
      }
      </div>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(CenteredTree);
*/