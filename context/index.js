import {useReducer, createContext, useEffect} from "react";
import axios from "axios";
import { useRouter} from "next/router";

// initial state
const initialState = {
    user: null,
};

// create context
const Context = createContext();

// root producer
const rootReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN" :
            return { ...state, user: action.payload };
        case "LOGOUT" :
            return { ...state, user: null };
        default:
            return state;
    }
};

//context provider
const Provider = ({ children }) => {

    const [state, dispatch] = useReducer(rootReducer, initialState);

    const router = useRouter();

    // state supaya tidak hilang ketika page d refresh
    useEffect(() => {
       dispatch({
           type: "LOGIN",
           payload: JSON.parse(window.localStorage.getItem("user"))
       });
    }, []);

    // handling expire token using axios interceptors
    axios.interceptors.response.use(function (response){
        // any status code that lie within the range of 2xx cause this function to trigger

        return response;
    }, function (error) {
        // any status code that falls outside the range of 2xx cause this function to trigger
        let res = error.response;
        if(res.status === 401 && res.config && !res.config.__isRetryRequest){
            return new Promise((resolve, reject) => {
                axios.get('/api/logout')
                    .then((data) => {
                        console.log('/401 error > logout');
                        dispatch({
                            type: "LOGOUT",
                        });
                        window.localStorage.removeItem('user');
                        window.localStorage.removeItem('jwt');
                        router.push('/login');
                    })
                    .catch(err => {
                        console.log('AXIOS INTERCEPTOR ERR', err);
                    })
            });
        }

        return Promise.reject(error);
    });

    return (
        <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
    );
};

export { Context, Provider };