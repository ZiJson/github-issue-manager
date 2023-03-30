import { Modal, Tag, Space, Input, Switch, Button, Radio, Spin, Typography,message } from "antd";
import { LABEL, ShowType, ISSUE } from "../constant";
import parse from 'html-react-parser'
import { useState, useEffect } from "react";
import Markdown from 'markdown-to-jsx';
import { useMutation } from "@apollo/client";
import { UPDATE_ISSUE } from "../graphql/mutations/UpdateIssue";
import { CREATE_ISSUE } from "../graphql/mutations/CreateIssue";
import { CLOSE_ISSUE } from "../graphql/mutations/CloseIssue";
import type { RadioChangeEvent } from 'antd';
import { ADD_LABEL, CHANGE_LABEL } from "../graphql/mutations/Label";
import styled from "styled-components";
interface prop {
    State: ShowType
    goBack: () => void
    issue: ISSUE | undefined
    refetchIssue: () => Promise<void>
    labels: LABEL[]
}

const IssueModel = ({ State, goBack, issue, refetchIssue, labels }: prop) => {
    const [onEdit, setOnEdit] = useState(false)
    const [tempIssue, setTempIssue] = useState(issue)
    const [isPreview, setIsPreview] = useState(false)
    const [updateIssue, updateQuery] = useMutation(UPDATE_ISSUE)
    const [createIssue, createQuery] = useMutation(CREATE_ISSUE)
    const [closeIssue, closeQuery] = useMutation(CLOSE_ISSUE)
    const [changeLabel, changeQuery] = useMutation(CHANGE_LABEL)
    const [addLabel, addQuery] = useMutation(ADD_LABEL)
    const [currentLabel, setCurrentLabel] = useState<LABEL>()
    const current = issue?.labels.nodes.filter(label => (labels.map(la => la.name)).includes(label.name))[0]
    
    useEffect(() => {
        if (!issue) return
        if (!issue?.id && issue?.repository.id) {
            setOnEdit(true)
        }
        setTempIssue(issue)
        setCurrentLabel(current)
    }, [issue])
    if (!issue || !tempIssue) return <div></div>
    console.log("Model render")

    const onOK = async () => {
        if (onEdit) {
            if(!tempIssue.title){
                message.error("Title cannot be empty!")
                return
            }
            if(!tempIssue?.body) return
            if(tempIssue.body.length<30){
                message.error("issue body must contain at least 30 words!")
                return
            }
            if (!issue.id) {
                const OpenLabel = labels.find(label => label.name === "Open")
                if (!OpenLabel) return
                await createIssue({
                    variables: {
                        repositoryId: issue.repository.id,
                        title: tempIssue.title,
                        body: tempIssue?.body,
                        labelIds: [OpenLabel.id]
                    }
                }).then(res => {
                    setTempIssue(res.data.createIssue.issue)
                })
            }
            else {
                await updateIssue({
                    variables: {
                        id: issue.id,
                        title: tempIssue?.title,
                        body: tempIssue?.body
                    }
                })
                    .then(res => {
                        setTempIssue(res.data.updateIssue.issue)
                    })
            }

        }
        setOnEdit(!onEdit)
        setIsPreview(false)
    }
    const onCancel = () => {
        setOnEdit(false)
        setIsPreview(false)
        goBack()
        if (issue !== tempIssue) refetchIssue()
    }

    const onDelete = async () => {
        if (!issue.id) return
        await closeIssue({
            variables: {
                issueId: issue.id
            }
        })

        setOnEdit(false)
        setIsPreview(false)
        refetchIssue()
        goBack()
    }
    const onChange = ({ target: { value } }: RadioChangeEvent) => {
        const pre = currentLabel
        const now = labels.find(label=>label.name===value)
        if (!now) return
        if (!pre) {
            addLabel({
                variables: {
                    issueId: issue.id,
                    toAdd: [now.id]
                }
            }).then(res => {
                setTempIssue(res.data.addLabelsToLabelable.labelable)
                setCurrentLabel(now)
            })
        }
        else {
            changeLabel({
                variables: {
                    issueId: issue.id,
                    toRemove: [pre?.id],
                    toAdd: [now.id]
                }
            }).then(res => {
                setTempIssue(res.data.removeLabelsFromLabelable.labelable)
                setCurrentLabel(now)
            })
        }

    };

    return (
        <Modal
            forceRender={true}
            centered
            title={!onEdit ? 
                <div style={{width:"200px"}}>
                    <Typography.Text style={{fontSize:"16px "}} ellipsis>
                        {tempIssue.title}
                    </Typography.Text>
                </div>
                : <Input value={tempIssue?.title} style={{ width: "300px" }} onChange={e => setTempIssue({ ...tempIssue, title: e.target.value })} placeholder="Title" />}
            open={State === ShowType.issueInfo}
            onOk={onOK}
            onCancel={onCancel}
            okText={onEdit ? "OK" : "Edit"}
            cancelText="Cancel"
            width="max-content"
            confirmLoading={updateQuery.loading || createQuery.loading}
            footer={[
                <Button key="delete" type="primary" danger onClick={() => {
                    Modal.confirm({
                        title: "Delete the issue",
                        content: "it will set the state to 'Close' intsead of deleteing, are you sure about that?",
                        onOk(...args) {
                            onDelete()
                        },
                    })
                }} loading={closeQuery.loading}
                    style={tempIssue.id ? {} : { display: "none" }}
                >
                    Delete
                </Button>,
                <Button key="ok" type="primary" onClick={onOK} loading={updateQuery.loading || createQuery.loading}>
                    {onEdit ? "OK" : "Edit"}
                </Button>
                ,
                <Button key="back" onClick={onCancel}>
                    Return
                </Button>
            ]}
        >

            <div style={{ minWidth: "400px", maxWidth: "600px" }}>
                <Space direction="vertical" size="small" style={{ display: 'flex' }}>
                    <div>{tempIssue.labels?.nodes.map(label => (<Tag key={label.id} color={"#" + label.color}>{label.name}</Tag>))}</div>
                    {
                        !onEdit ?
                            <div>
                                <div style={{ maxHeight: "400px", overflow: "scroll", width: "450px" }}>{tempIssue?.bodyHTML ? parse(tempIssue?.bodyHTML) : ""}</div>
                            </div>
                            :
                            <>
                                <div style={{ height: "320px", overflow: "scroll", width: "400px" }}>
                                    {
                                        !isPreview ?
                                            <Input.TextArea
                                                // value={tempIssue?.body}
                                                style={{ width: '100%' }}
                                                autoSize={{ minRows: 10, maxRows: 13 }}
                                                onChange={(e) => {
                                                    if (!e.target.value) return
                                                    setTempIssue({
                                                        ...tempIssue,
                                                        body: e.target.value
                                                    })
                                                }
                                                }
                                                defaultValue={tempIssue?.body}
                                                placeholder="Write some content"
                                                showCount
                                            />
                                            :
                                            <div style={{ minWidth: "40px", maxWidth: "400px", height: "261px" }}>
                                                {tempIssue.body ? <Markdown>{tempIssue?.body}</Markdown> : ""}
                                            </div>
                                    }
                                </div>
                                <div>
                                    Preview <Switch onChange={(e) => setIsPreview(e)} />
                                </div>
                            </>
                    }
                </Space>
            </div>
            {(!issue?.id && issue?.repository.id)?"":onEdit?"":<StatusWrapper>
                <Spin size="small" spinning={changeQuery.loading || addQuery.loading} style={{ marginRight: "5px" }} />
                <Radio.Group defaultValue={current?.name} onChange={onChange} buttonStyle="solid" size="small" disabled={changeQuery.loading || addQuery.loading}>
                    <Radio.Button value="Open">Open</Radio.Button>
                    <Radio.Button value="In_Progress">In Progress</Radio.Button>
                    <Radio.Button value="Done">Done</Radio.Button>
                </Radio.Group>
            </StatusWrapper>}

        </Modal>
    )
}


const StatusWrapper = styled.div`
    position: absolute;
    top:20px;
    right:50px
`
export default (IssueModel) 