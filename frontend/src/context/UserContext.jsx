import React, { createContext, useContext, useReducer } from "react";

const initialSate = {
    userList : [],
    user:null,
}

const reducer = (state, action) => {
    switch(action.type) {
        case "CREATE_USER" :
            return {
                ...state,
                userList: state.userList.concat(action.user)
            }
    }
}