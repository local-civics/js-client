# js-client

Javascript client library for Local Civics Platform APIs.

# Get started

## Install

Add the client to your project.

`npm install --save @local-civics/js-client`

### **Usage**

Import the client

`import { init } from '@local-civics/js-client'`

and use it, like so

```
const client = init("my-access-token")
const ctx = {referrer: "https://www.localcivics.io"}
const id = client.do(ctx, "GET", "identity", "my/id")
```
