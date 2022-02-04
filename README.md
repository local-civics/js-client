# js-client

Javascript client library for Local Civics Platform APIs.

# Get started

## Install

Add the client to your project.

`npm install --save @local-civics/js-client`

### **Usage**

Import the client

`import { request } from '@local-civics/js-client'`

and use it, like so

```
const resp = await request("my-access-token", GET", "/identity/v0/resolve")
```
