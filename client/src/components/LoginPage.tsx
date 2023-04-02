import env from "ts-react-dotenv"
import { Button, Typography } from "antd"
import styled from "styled-components"
import { LOCAL_STORAGE_KEY } from "../constant"
import style from "./components.module.css"

const { Title } = Typography
const LoginPage = ({ clientState }: { clientState: string }) => {
    const client_id = env.CLIENT_ID
    const redirect_uri = env.REDIRECT_URL
    const authUrl = `https://github.com/login/oauth/authorize?scope=user repo admin:org&state=${clientState}&client_id=${client_id}&redirect_uri=${redirect_uri}&prompt=consent`


    return (
        <Wrapper className={style.wrapper}>
            <Title>GitHub Task Maneger</Title>
            <div className={style.flexText}>
            <div className={style.textContainer}>
                <p className={style.line1}>
                    In this app, you can manage your issues
                </p>
            </div>
            <div className={style.textContainer}>
                <p className={style.line2}>
                    by editing content, creating new one or even deleting them.
                </p>
                    <br/>
            </div>

            <div className={style.textContainer}>

                <p className={style.line3}>
                    You can also add a label to your issue,
                </p>
            </div>
            <div className={style.textContainer}>

                <p className={style.line4}>
                    so you can easily tell the current developing progress.
                </p>
                <br />
            </div>
            <div className={style.textContainer}>

                <p className={style.line5}>
                    After logging in, you will see all repositories you can access,
                </p>
            </div>
            <div className={style.textContainer}>

                <p className={style.line6}>
                    except the org repo, unless you get the permission.
                </p>
            </div>
            </div>
            <Button type="primary" href={authUrl} style={{margin:"20px 0"}}>go Login</Button>
        </Wrapper>
    )

}
const Wrapper = styled.div`
    display:flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    height: 100%

`
export default LoginPage