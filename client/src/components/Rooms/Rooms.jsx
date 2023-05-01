import { useEffect, useReducer, useState } from "react";
import io from "socket.io-client";

const initialState = {
    messages: [],
    rooms: ['Room 1', 'Room 2', 'Room 3', 'Room 4'],
  };

const reducer = (state, action) => {
switch (action.type) {
    case "RECEIVE_MESSAGE":
    return {
        ...state,
        messages: [...state.messages, action.payload],
    };
  default:
    return state;
    }
    
};