import {useRouter} from "next/router";
import Sidebar from "@components/shared/Sidebar";
import React from "react";
import Notifications from "@components/shared/Notifications/Notifications";
import useAxiosAuth from "@hooks/useAxiosAuth";

const AppContent: React.FC = (props) => {
    const router = useRouter();
    const {token} = useAxiosAuth()

    if (!token) router.replace("/login")

    return (
        <div className="flex flex-row relative ">
            <Sidebar/>
            <Notifications/>
            <div className="w-full mx-auto min-h-[100vh]">
                {props.children}
            </div>
        </div>
    )
};

export default AppContent;
