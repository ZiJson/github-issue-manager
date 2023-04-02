import { Spin } from "antd";

export const Loading = () => (
    <div style={{display:"flex", justifyContent:"center", alignItems:"center", height:"100%"}}>
        <Spin size="large" />
    </div>
)