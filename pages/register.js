import {useEffect, useState, useContext} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from '@ant-design/icons';
import { Context } from "../context";
import { useRouter } from "next/router";

const Register = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const {
      state: { user },
      dispatch
  } = useContext(Context);

  useEffect(() => {
      if(user !== null) router.push('/')
  },[user]);

  const handleSubmit = async (e) => {
      e.preventDefault();

      try{
          setLoading(true);
          const { data } = await axios.post(`/api/register`, {
              name,
              email,
              password
          });

          toast.success("Registration Successfull. Please Login ...");
          setLoading(false);

          setEmail('');
          setName('');
          setPassword('');
      }catch (err) {
          toast.error(err.response.data);
          setLoading(false);
      }

  }

  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">Register</h1>
      <div className="container col-md-4 offset-md-4 pb-5">
          <form onSubmit={handleSubmit}>
              <input type="text"
                     className="form-control mb-4 p-4"
                     value={email}
                     placeholder="Enter Email"
                     required
                     onChange={(e) => setEmail(e.target.value)} />
              <input type="text"
                     className="form-control mb-4 p-4"
                     value={name}
                     placeholder="Enter name"
                     required
                     onChange={(e) => setName(e.target.value)} />
              <input type="password"
                     className="form-control mb-4 p-4"
                     value={password}
                     placeholder="Enter Password"
                     required
                     onChange={(e) => setPassword(e.target.value)} />

              <button
                  type="submit"
                  className="btn btn-block btn-primary"
                  disabled={!name || !email || !password || loading}
              >
                  { loading ? <SyncOutlined spin /> : "Submit"}
              </button>
          </form>
      </div>
    </>
  );
};

export default Register;
