# js-client

Javascript client library for Local Civics Platform APIs.

# Get started

## Install

Add the client to your project.

`npm install --save @local-civics/js-client`

### **Usage**

Import the client

`import { Client } from '@local-civics/js-client'`

and use it, like so

```
const client = new Client({
    accessToken: "my-access-token",
})
const id = client.sphere.get("my/id")
```
