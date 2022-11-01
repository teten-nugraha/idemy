import { Menu } from "antd";
import Link from "next/link";
import {
    AppstoreOutlined,
    LoginOutlined,
    UserAddOutlined,
    LogoutOutlined, CoffeeOutlined
} from "@ant-design/icons";
import { Context } from "../context";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import { useRouter } from "next/router";

const { Item, SubMenu } = Menu;

const TopNav = () => {

    const [current, setCurrent] = useState("");
    const { state, dispatch } = useContext(Context);

    const { user } = state;

    const router = useRouter();

    useEffect(() => {
        process.browser && setCurrent(window.location.pathname);
    }, [process.browser && window.location.pathname]);

    const logout = async () => {
        dispatch({
            type: "LOGOUT"
        });
        window.localStorage.removeItem("user");
        window.localStorage.removeItem("jwt");
        const { data } = await axios.get('/api/logout');
        toast(data.message);
        router.push('/login');
    }


  return (
    <Menu mode="horizontal">
      <Item icon={<AppstoreOutlined />}>
        <Link href="/">
          <a>App</a>
        </Link>
      </Item>

        {user == null && (
            <>
                <Item icon={<LoginOutlined />}>
                    <Link href="/login">
                        <a>Login</a>
                    </Link>
                </Item>

                <Item icon={<UserAddOutlined />}>
                    <Link href="/register">
                        <a>Register</a>
                    </Link>
                </Item>
            </>
        )}

        { user !== null && (
            <SubMenu icon={<CoffeeOutlined />} title={user && user.name} className="float-right">
                <Item
                    onClick={logout}
                    icon={<LogoutOutlined />}
                    className="float-right"
                >
                    Logout
                </Item>
            </SubMenu>
        )}

    </Menu>
  );
};

export default TopNav;
