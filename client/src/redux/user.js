import {
    loginUser,
    registerUser,
    registerSite,
    setUser,
    editUser,
    loadingUser,
    logoutUser,
    setErrors,
    clearErrors,
    success,
    clearSuccess,
    setSites,
    setEditOpen,
    setEditErrors,
    clearEditErrors,
} from 'redux/userSlice';
import axios from 'axios';
import store from 'redux/store';

const api = process.env.REACT_APP_API_URL;

export const LoginUser = async (user) => {
    store.dispatch(loadingUser());
    store.dispatch(clearSuccess());
    try {
        const res = await axios.post(`${api}/auth/login`, user);
        setAuthorizationHeader(res.data.token, res.data.user._id);
        store.dispatch(clearErrors());
        store.dispatch(success());
        store.dispatch(loginUser(res.data));
    } catch (err) {
        store.dispatch(setErrors(err.response.data));
    }
};

export const RegisterUser = async (data) => {
    store.dispatch(loadingUser());
    store.dispatch(clearSuccess());
    try {
        await axios.post(`${api}/auth/register/user`, data);
        store.dispatch(clearErrors());
        store.dispatch(success());
        store.dispatch(registerUser());
    } catch (err) {
        store.dispatch(setErrors(err.response.data));
    }
};

export const RegisterSite = async (data) => {
    store.dispatch(loadingUser());
    store.dispatch(clearSuccess());
    try {
        await axios.post(`${api}/auth/register/site`, data);
        store.dispatch(clearErrors());
        store.dispatch(success());
        store.dispatch(registerSite());
    } catch (err) {
        store.dispatch(setErrors(err.response.data));
    }
};

export const FetchSites = async () => {
    try {
        const res = await axios.get(`${api}/site`);
        store.dispatch(setSites(res.data));
    } catch (err) {
        console.log(err);
    }
};

export const LoadUser = async () => {
    store.dispatch(loadingUser());
    try {
        const res = await axios.get(
            `${api}/user/${localStorage.getItem('id')}`,
            { headers: { 'auth-token': localStorage.getItem('auth-token') } }
        );
        store.dispatch(setUser(res.data));
    } catch (err) {
        console.error(err);
    }
};

export const LogoutUser = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('id');
    store.dispatch(logoutUser());
};

export const UpdateProfilePicture = async (image) => {
    const formData = new FormData();
    formData.append('avatar', image);

    try {
        const res = await axios.put(
            `${api}/user/${localStorage.getItem('id')}/updatepicture`,
            formData,
            {
                headers: {
                    'content-type': 'multipart/form-data',
                    'auth-token': localStorage.getItem('auth-token'),
                },
            }
        );
        store.dispatch(editUser(res.data));
    } catch (err) {
        console.log(err);
    }
};

export const UpdateUser = async (updateQuery) => {
    store.dispatch(clearErrors());
    try {
        const res = await axios.put(
            `${api}/user/${localStorage.getItem('id')}`,
            updateQuery,
            { headers: { 'auth-token': localStorage.getItem('auth-token') } }
        );
        store.dispatch(clearEditErrors());
        store.dispatch(setEditOpen(false));
        store.dispatch(editUser(res.data));
    } catch (err) {
        store.dispatch(setEditErrors());
    }
};

export const SetEditOpen = async (open) => {
    store.dispatch(setEditOpen(open));
};

const setAuthorizationHeader = (token, id) => {
    localStorage.setItem('auth-token', token);
    localStorage.setItem('id', id);
};
