# Smart Helmet Website

## How it was made?
### Frontend
- HTML,CSS,JS with EJS templating
### Backend
- NodeJS
- Express 
- MongoDB 
### Tools
- Socket.io

## What is inside?
- Account creation for users
- Login for users with session with an expiration of 2hrs
- Three parts
    - ```Overview``` : To see the details of the user and thier emergency contacts
    - ```Add device``` : To register, deregister devices(helmets) through their device ids (MAC address) of the NodeMCU used for IoT project.
    - ```Alerts``` : Can view own alerts real-time when made a HTTP request through NodeMCU is made. The request also sends emails to the emergency contacts if alert type is accident or to themselves if alert type is alcohol ,i.e., drunk situation.
- ```APIs```: The APIs important for use 
    - ```Add new device(MAC)``` 
        - POST ```/api/device/new``` <br>
        Schema
        ```javascript
            {
                macId: "84:0D:8E:A5:82:97" 
            }
        ```
        ```Note : Use only and only colon format of MAC Address```<br>
        Return 
        - ```status```
            - ```true``` : Device is registered
            - ```false``` : Error Codes 
                - ```201``` → Database error (Device Route)
    - ```Alert for accident (after Fall detection)```
        - GET ```/api/alert/accident/__ENTER_THE_MAC_ID__``` <br>
        ```Note : Use only and only colon format of MAC Address```<br>
        Return 
        - ```status```
            - ```true``` : Device is registered
            - ```false``` : Error Codes
                - ```601``` → Device not found
                - ```603``` → User not found
                - ```602``` → Database Error (Alert Route)
    - ```Alert for alcohol (after alcohol detection)```
        - GET ```/api/alert/alcohol/__ENTER_THE_MAC_ID__``` <br>
        ```Note : Use only and only colon format of MAC Address```<br>
        Return 
        - ```status```
            - ```true``` : Device is registered
            - ```false``` : Error Codes
                - ```601``` → Device not found
                - ```603``` → User not found
                - ```602``` → Database Error (Alert Route)
