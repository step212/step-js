# PortraitServiceApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**portraitServiceGetPortraitBasic**](#portraitservicegetportraitbasic) | **GET** /portrait/basic | |
|[**portraitServiceGetPortraitStepRate**](#portraitservicegetportraitsteprate) | **GET** /portrait/step_rate | |

# **portraitServiceGetPortraitBasic**
> StepV1GetPortraitBasicReply portraitServiceGetPortraitBasic()


### Example

```typescript
import {
    PortraitServiceApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PortraitServiceApi(configuration);

let dimension: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.portraitServiceGetPortraitBasic(
    dimension
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dimension** | [**string**] |  | (optional) defaults to undefined|


### Return type

**StepV1GetPortraitBasicReply**

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

# **portraitServiceGetPortraitStepRate**
> StepV1GetPortraitStepRateReply portraitServiceGetPortraitStepRate()


### Example

```typescript
import {
    PortraitServiceApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PortraitServiceApi(configuration);

let topTargetId: string; // (optional) (default to undefined)
let statUnit: string; //day, week, month (optional) (default to undefined)
let startDate: string; //format: 2025-01-01 (optional) (default to undefined)
let endDate: string; //format: 2025-01-01 (optional) (default to undefined)

const { status, data } = await apiInstance.portraitServiceGetPortraitStepRate(
    topTargetId,
    statUnit,
    startDate,
    endDate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **topTargetId** | [**string**] |  | (optional) defaults to undefined|
| **statUnit** | [**string**] | day, week, month | (optional) defaults to undefined|
| **startDate** | [**string**] | format: 2025-01-01 | (optional) defaults to undefined|
| **endDate** | [**string**] | format: 2025-01-01 | (optional) defaults to undefined|


### Return type

**StepV1GetPortraitStepRateReply**

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

