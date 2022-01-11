# js-gateway

Javascript client library for Local Civics API Gateway

# Get started

## Install

Add hoplite to your project.

`npm install --save @local-civics/js-gateway`

### **Usage**

Import the client

`import { useClient } from '@local-civics/js-gateway'`

and use it, like so

```
const client = useClient()
const identity = await client.identity.resolve()
```
