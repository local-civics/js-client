# js-client

Javascript client library for Local Civics Platform APIs.

# Get started

## Install

Add the client to your project.

`npm install --save @local-civics/js-client`

### **Usage**

Import the client

`import { client } from '@local-civics/js-client'`

and use it, like so

```
const api = client("my-access-token")
const resident = await api.residents.resolve()
```
