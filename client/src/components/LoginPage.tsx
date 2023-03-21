import env from "ts-react-dotenv"
import { Button, Typography } from "antd"
import styled from "styled-components"
const { Title } = Typography
const LoginPage = () => {
    const client_id = env.CLIENT_ID
    const redirect_uri = env.REDIRECT_URL
    const authUrl = `https://github.com/login/oauth/authorize?scope=user repo admin:org&client_id=${client_id}&redirect_uri=${redirect_uri}&prompt=consent`


    return (
            <Wrapper>
                <Title>GitHub Task Maneger</Title>
                <Button type="primary" href={authUrl}>go Login</Button>
            </Wrapper>
    )

}
const Wrapper = styled.div`
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;


`
export default LoginPage