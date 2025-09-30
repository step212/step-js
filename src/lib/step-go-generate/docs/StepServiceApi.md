# StepServiceApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**stepServiceAddTargetDirStep**](#stepserviceaddtargetdirstep) | **POST** /target/{id}/dir | |
|[**stepServiceCreateTarget**](#stepservicecreatetarget) | **POST** /target | |
|[**stepServiceDeleteTarget**](#stepservicedeletetarget) | **DELETE** /target/{id} | |
|[**stepServiceDeleteTargetStep**](#stepservicedeletetargetstep) | **DELETE** /step/{id} | |
|[**stepServiceDoneTarget**](#stepservicedonetarget) | **POST** /target/{id}/done | |
|[**stepServiceEncrypt**](#stepserviceencrypt) | **POST** /step/{id}/encrypt | |
|[**stepServiceGetTarget**](#stepservicegettarget) | **GET** /target/{id} | |
|[**stepServiceGetTargetDirStepChildren**](#stepservicegettargetdirstepchildren) | **GET** /step/{id}/dir_children | |
|[**stepServiceGetTargetTree**](#stepservicegettargettree) | **GET** /target/{id}/tree | |
|[**stepServiceGetTargets**](#stepservicegettargets) | **GET** /targets | |
|[**stepServiceUpdateTarget**](#stepserviceupdatetarget) | **PUT** /target/{id} | |
|[**stepServiceUpdateTargetStep**](#stepserviceupdatetargetstep) | **PUT** /step/{id} | |

# **stepServiceAddTargetDirStep**
> StepV1AddTargetDirStepReply stepServiceAddTargetDirStep(stepV1AddTargetDirStepRequest)

添加目标积累(for dir)

### Example

```typescript
import {
    StepServiceApi,
    Configuration,
    StepV1AddTargetDirStepRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StepServiceApi(configuration);

let id: string; // (default to undefined)
let stepV1AddTargetDirStepRequest: StepV1AddTargetDirStepRequest; //

const { status, data } = await apiInstance.stepServiceAddTargetDirStep(
    id,
    stepV1AddTargetDirStepRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **stepV1AddTargetDirStepRequest** | **StepV1AddTargetDirStepRequest**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**StepV1AddTargetDirStepReply**

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

# **stepServiceCreateTarget**
> StepV1CreateTargetReply stepServiceCreateTarget(stepV1CreateTargetRequest)


### Example

```typescript
import {
    StepServiceApi,
    Configuration,
    StepV1CreateTargetRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StepServiceApi(configuration);

let stepV1CreateTargetRequest: StepV1CreateTargetRequest; //

const { status, data } = await apiInstance.stepServiceCreateTarget(
    stepV1CreateTargetRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **stepV1CreateTargetRequest** | **StepV1CreateTargetRequest**|  | |


### Return type

**StepV1CreateTargetReply**

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

# **stepServiceDeleteTarget**
> StepV1DeleteTargetReply stepServiceDeleteTarget()

删除目标下子目标以及目标下的积累

### Example

```typescript
import {
    StepServiceApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StepServiceApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.stepServiceDeleteTarget(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**StepV1DeleteTargetReply**

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

# **stepServiceDeleteTargetStep**
> StepV1DeleteTargetStepReply stepServiceDeleteTargetStep()

删除积累

### Example

```typescript
import {
    StepServiceApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StepServiceApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.stepServiceDeleteTargetStep(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**StepV1DeleteTargetStepReply**

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

# **stepServiceDoneTarget**
> StepV1DoneTargetReply stepServiceDoneTarget(stepV1DoneTargetRequest)

完成目标

### Example

```typescript
import {
    StepServiceApi,
    Configuration,
    StepV1DoneTargetRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StepServiceApi(configuration);

let id: string; // (default to undefined)
let stepV1DoneTargetRequest: StepV1DoneTargetRequest; //

const { status, data } = await apiInstance.stepServiceDoneTarget(
    id,
    stepV1DoneTargetRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **stepV1DoneTargetRequest** | **StepV1DoneTargetRequest**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**StepV1DoneTargetReply**

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

# **stepServiceEncrypt**
> StepV1EncryptReply stepServiceEncrypt(stepV1EncryptRequest)


### Example

```typescript
import {
    StepServiceApi,
    Configuration,
    StepV1EncryptRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StepServiceApi(configuration);

let id: string; // (default to undefined)
let stepV1EncryptRequest: StepV1EncryptRequest; //

const { status, data } = await apiInstance.stepServiceEncrypt(
    id,
    stepV1EncryptRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **stepV1EncryptRequest** | **StepV1EncryptRequest**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**StepV1EncryptReply**

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

# **stepServiceGetTarget**
> StepV1GetTargetReply stepServiceGetTarget()

获取目标及目标下的积累

### Example

```typescript
import {
    StepServiceApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StepServiceApi(configuration);

let id: string; // (default to undefined)
let withSteps: boolean; // (optional) (default to undefined)
let page: number; // (optional) (default to undefined)
let pageSize: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.stepServiceGetTarget(
    id,
    withSteps,
    page,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|
| **withSteps** | [**boolean**] |  | (optional) defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to undefined|
| **pageSize** | [**number**] |  | (optional) defaults to undefined|


### Return type

**StepV1GetTargetReply**

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

# **stepServiceGetTargetDirStepChildren**
> StepV1GetTargetDirStepChildrenReply stepServiceGetTargetDirStepChildren()

获取目录类型积累的子积累

### Example

```typescript
import {
    StepServiceApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StepServiceApi(configuration);

let id: string; // (default to undefined)
let page: number; // (optional) (default to undefined)
let pageSize: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.stepServiceGetTargetDirStepChildren(
    id,
    page,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to undefined|
| **pageSize** | [**number**] |  | (optional) defaults to undefined|


### Return type

**StepV1GetTargetDirStepChildrenReply**

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

# **stepServiceGetTargetTree**
> StepV1GetTargetTreeReply stepServiceGetTargetTree()

获取目标树

### Example

```typescript
import {
    StepServiceApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StepServiceApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.stepServiceGetTargetTree(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**StepV1GetTargetTreeReply**

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

# **stepServiceGetTargets**
> StepV1GetTargetsReply stepServiceGetTargets()

获取目标列表

### Example

```typescript
import {
    StepServiceApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StepServiceApi(configuration);

let parentId: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.stepServiceGetTargets(
    parentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **parentId** | [**string**] |  | (optional) defaults to undefined|


### Return type

**StepV1GetTargetsReply**

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

# **stepServiceUpdateTarget**
> StepV1UpdateTargetReply stepServiceUpdateTarget(stepV1UpdateTargetRequest)


### Example

```typescript
import {
    StepServiceApi,
    Configuration,
    StepV1UpdateTargetRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StepServiceApi(configuration);

let id: string; // (default to undefined)
let stepV1UpdateTargetRequest: StepV1UpdateTargetRequest; //

const { status, data } = await apiInstance.stepServiceUpdateTarget(
    id,
    stepV1UpdateTargetRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **stepV1UpdateTargetRequest** | **StepV1UpdateTargetRequest**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**StepV1UpdateTargetReply**

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

# **stepServiceUpdateTargetStep**
> StepV1UpdateTargetStepReply stepServiceUpdateTargetStep(stepV1UpdateTargetStepRequest)

修改积累

### Example

```typescript
import {
    StepServiceApi,
    Configuration,
    StepV1UpdateTargetStepRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StepServiceApi(configuration);

let id: string; // (default to undefined)
let stepV1UpdateTargetStepRequest: StepV1UpdateTargetStepRequest; //

const { status, data } = await apiInstance.stepServiceUpdateTargetStep(
    id,
    stepV1UpdateTargetStepRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **stepV1UpdateTargetStepRequest** | **StepV1UpdateTargetStepRequest**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**StepV1UpdateTargetStepReply**

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

