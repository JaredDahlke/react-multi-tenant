import {
  USERS_HAS_ERRORED,
  USERS_FETCH_DATA_SUCCESS,
  USER_DELETED,
  USER_DELETED_ERROR,
  USERS_REMOVE_USER,
  USERS_ADD_USER,
  USER_ADDED
} from "../action-types/users";
import axios from "../../axiosConfig";
import handleError from "../../errorHandling";
import config from "../../config.js";
import { User } from "../../models/user";
import { setUser } from "./auth";

const apiBase = config.apiGateway.URL;

export function usersHasErrored(bool) {
  return {
    type: USERS_HAS_ERRORED,
    hasErrored: bool,
  };
}

export function userDeleted(bool) {
  return {
    type: USER_DELETED,
    userDeleted: bool,
  };
}
export function userAdded(bool) {
  return {
    type: USER_ADDED,
    userAdded: bool,
  };
}
export function userDeletedError(bool) {
  return {
    type: USER_DELETED_ERROR,
    userDeleted: bool,
  };
}

export function usersFetchDataSuccess(users) {
  return {
    type: USERS_FETCH_DATA_SUCCESS,
    users,
  };
}

export function usersFetchData() {
  let url = apiBase + "/user";
  return async (dispatch) => {
    try {
      let params = {
        accounts: true,
        roles: true
      }
     

      const result = await axios.get(url, {
        params,
      });

      if (result.status === 200) {
        let users = { data: [] };
        for (const user of result.data) {
          let roles = [];
          for (const role of user.roles) {
            if (role.roleId) roles.push(role.roleId);
          }
          

          let newUser = new User(
            user.userId,
            user.firstName,
            user.lastName,
            user.company,
            user.email,
            user.userType,
            roles
          );
          users.data.push(newUser);
        }
        dispatch(usersFetchDataSuccess(users));
      }
    } catch (error) {
      let errorType = error.response.status;
      handleError(dispatch, errorType);
      dispatch(usersHasErrored(true));
    }
  };
}

export function updateUserData(user) {
  let userId = user.userId;
  let url = apiBase + `/user/${userId}`;
  return async (dispatch) => {
    try {
      let myUser = new User(user.userId, user.firstName, user.lastName, user.company, user.email, user.userType, [], [])
      delete myUser.accounts
      delete myUser.roles
      const result = await axios.patch(url, myUser);
      if (result.status === 200) {
        dispatch(setUser(result.data.user));
      }
    } catch (error) {
      alert(error);
      let errorType = error.response.status;
      handleError(dispatch,errorType);
      dispatch(usersHasErrored(true));
    }
  };
}
export function usersRemoveUser(userId) {
  return {
    type: USERS_REMOVE_USER,
    userId,
  };
}

export function usersAddUser(user) {
  return {
    type: USERS_ADD_USER,
    user,
  };
}

export const deleteUser = (userId) => {
  let url = apiBase + `/user/${userId}`;
  return (dispatch) => {
    dispatch(usersRemoveUser(userId));
    axios
      .delete(url)
      .then((response) => {
        dispatch(userDeleted(true));
        setTimeout(() => {
          dispatch(userDeleted(false));
        }, 2000);
      })
      .catch((error) => {
        dispatch(userDeletedError(true));
        setTimeout(() => {
          dispatch(userDeletedError(false));
        }, 2000);
      });
  };
};

export const inviteUser = (user) => {
  console.log(user)
  user.password = 'testasdfa!'

 
  
  delete user.userId
  delete user.internal
  user.userName = 'placeholder'
  user.phoneNumber= '123123123'
  //user.roles=[{roleId: 11},{roleId: 12}]

  let url =  apiBase + `/user`
  return (dispatch) => {
    dispatch(usersAddUser(user));
    axios.post(url, user)
      .then(response => {
        dispatch(userAdded(true))
        setTimeout(() => {
          dispatch(userAdded(false))
        }, 2000);
      })
      .catch(error => {
        console.log('invite user error')
        console.log(error)
        //dispatch(userDeletedError(true))
        //setTimeout(() => {
        //  dispatch(userDeletedError(false))
        //}, 2000);
      })
  };
};
