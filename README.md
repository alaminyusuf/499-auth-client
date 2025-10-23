## Requirements

nodejs version >=20

### Run `npm install` to install all dependencies

```sh
npx expo start
```

preferably run `npm run off` which starts the expo server without dependency check and uses offline server because expo requires strong Internet connection

you would be required to be connected to the same network as the device with expo mobile app connect the computer to the phone hotspot or ethernet so

once the expo server is started it will provide QR code for scanning and two addresses for using with expo mobile app and localhost

copy the addresses provided for expo mobile app connection and edit the APP_URL in the file in `src/config.js`

expo address uses port 8081 so make sure the port used by the backend is different i.e
`http://192.168.1.1:3000` in this instance 5000 is our backend port so please take note 

this will make sure that requests from the expo mobile reaches the computer backend server

scan the QR code using expo mobile app to view the bundled mobile app and check it features