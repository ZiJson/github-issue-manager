# github-issue-manager 

## Screen Shot
![main](https://github.com/ZiJson/github-issue-manager/assets/108473055/260b9570-2895-4a9b-9861-9aec2cfb6bc8)



## Information

This is the app that you can easily manage github issues of of your repository.

You can do :
- view the content of your existing issue 
- create and delete issue
- edit title and content of your existing issue using markdown
- add one of three labels ( Open, In Progress, Done) to your existing issue

Features :
- sort the repo/ issue list by created time in ascending/ dscending order
- filter the issues by label name
- preview the markdown content while editing or creating issue

## Setup Locally

1. `git clone https://github.com/ZiJson/github-issue-manager.git`  clone the github repo 
2. `cd github-issue-manager` 
3. `yarn setup`  install the packages of server side and client side
4. `yarn server` run the proxy server on localhost:4000
5. open another cmd `yarn start` run the app on locallhost:3000

client/ .env
```
CLIENT_ID='5be43********67ca9a'                          // client ID for GitHub OAuth App 
CLIENT_SECRET='2404f206d*********24755443d9daa51602'  // client secret for GitHub OAuth App, you can put your own
PROXY_SERVER='http://localhost:4000/authenticate'
REDIRECT_URL='http://localhost:3000/login'
```

## Architecture Design

- Runtime : react - typescript
- API tool : graphql ( Apollo )
- Component package : antd

This app can be apart from two route of `/` and `/login`, which are home dashboard and login page respectively.
The login page foreces user to login with github before entering dashboard page.

Trough over all the project, I split the logic part out from the code, using custom hooks, `useHome` and `useAuth`, to it more clear while developing.
The useAuth hook is used for user login and handling the access token from GitHub, while the useHome hook is used for fetching data and handling states.

In the Home container, there are two main components, `ScrollList` and `IssueModal`, handling infinite scroll and editing modal respectively.

Digging into project for more details !

