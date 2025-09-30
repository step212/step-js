# AiApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**chatAiChatPost**](#chataichatpost) | **POST** /ai/chat | Chat|

# **chatAiChatPost**
> string chatAiChatPost()


### Example

```typescript
import {
    AiApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AiApi(configuration);

let message: string; // (default to undefined)
let xUserID: string; // (default to undefined)

const { status, data } = await apiInstance.chatAiChatPost(
    message,
    xUserID
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **message** | [**string**] |  | defaults to undefined|
| **xUserID** | [**string**] |  | defaults to undefined|


### Return type

**string**

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

