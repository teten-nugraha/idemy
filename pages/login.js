import {useContext, useState} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from '@ant-design/icons';
import { Context } from "../context";
import { useRouter } from "next/router";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // state
    const { state, dispatch } = useContext(Context);

    // router
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            setLoading(true);
            const { data } = await axios.post(`/api/login`, {
                email,
                password
            });

            dispatch({
                type: 'LOGIN',
                payload: data
            });

            // save in local storage
            window.localStorage.setItem("user", JSON.stringify(data));

            toast.success("Login Successfull. Please Login ...");
            setLoading(false);

            setEmail('');
            setPassword('');

            router.push('/'); // redirect to homepage

        }catch (err) {
            toast.error(err.response.data);
            setLoading(false);
        }

    }

    return (
        <>
            <h1 className="jumbotron text-center bg-primary square">Login</h1>
            <div className="container col-md-4 offset-md-4 pb-5">
                <form onSubmit={handleSubmit}>
                    <input type="text"
                           className="form-control mb-4 p-4"
                           value={email}
                           placeholder="Enter Email"
                           required
                           onChange={(e) => setEmail(e.target.value)} />
                    <input type="password"
                           className="form-control mb-4 p-4"
                           value={password}
                           placeholder="Enter Password"
                           required
                           onChange={(e) => setPassword(e.target.value)} />

                    <button
                        type="submit"
                        className="btn btn-block btn-primary"
                        disabled={!email || !password || loading}
                    >
                        { loading ? <SyncOutlined spin /> : "Submit"}
                    </button>
                </form>
            </div>
        </>
    );
};

export default Login;
