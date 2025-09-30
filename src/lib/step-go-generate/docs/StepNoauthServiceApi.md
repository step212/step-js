# StepNoauthServiceApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**stepNoauthServiceDecrypt**](#stepnoauthservicedecrypt) | **POST** /apis/step-go-noauth/step/{id}/decrypt | |
|[**stepNoauthServiceGetNoauthStep**](#stepnoauthservicegetnoauthstep) | **GET** /apis/step-go-noauth/step/{id} | |
|[**stepNoauthServiceSetCommentForStep**](#stepnoauthservicesetcommentforstep) | **POST** /apis/step-go-noauth/step/{id}/comment | |

# **stepNoauthServiceDecrypt**
> StepV1DecryptReply stepNoauthServiceDecrypt(stepV1DecryptRequest)


### Example

```typescript
import {
    StepNoauthServiceApi,
    Configuration,
    StepV1DecryptRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StepNoauthServiceApi(configuration);

let id: string; // (default to undefined)
let stepV1DecryptRequest: StepV1DecryptRequest; //

const { status, data } = await apiInstance.stepNoauthServiceDecrypt(
    id,
    stepV1DecryptRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **stepV1DecryptRequest** | **StepV1DecryptRequest**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**StepV1DecryptReply**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **stepNoauthServiceGetNoauthStep**
> StepV1GetNoauthStepReply stepNoauthServiceGetNoauthStep()


### Example

```typescript
import {
    StepNoauthServiceApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StepNoauthServiceApi(configuration);

let id: string; // (default to undefined)
let shareTo: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.stepNoauthServiceGetNoauthStep(
    id,
    shareTo
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|
| **shareTo** | [**string**] |  | (optional) defaults to undefined|


### Return type

**StepV1GetNoauthStepReply**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **stepNoauthServiceSetCommentForStep**
> StepV1SetCommentForStepReply stepNoauthServiceSetCommentForStep(stepV1SetCommentForStepRequest)


### Example

```typescript
import {
    StepNoauthServiceApi,
    Configuration,
    StepV1SetCommentForStepRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StepNoauthServiceApi(configuration);

let id: string; // (default to undefined)
let stepV1SetCommentForStepRequest: StepV1SetCommentForStepRequest; //

const { status, data } = await apiInstance.stepNoauthServiceSetCommentForStep(
    id,
    stepV1SetCommentForStepRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **stepV1SetCommentForStepRequest** | **StepV1SetCommentForStepRequest**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**StepV1SetCommentForStepReply**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

