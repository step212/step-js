# FeedbackServiceApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**feedbackServiceDeleteFeedbackAward**](#feedbackservicedeletefeedbackaward) | **DELETE** /feedback/award/{id} | |
|[**feedbackServiceGetFeedbackAward**](#feedbackservicegetfeedbackaward) | **GET** /feedback/award/{id} | |
|[**feedbackServiceGetFeedbackAwards**](#feedbackservicegetfeedbackawards) | **GET** /feedback/awards | |

# **feedbackServiceDeleteFeedbackAward**
> StepV1DeleteFeedbackAwardReply feedbackServiceDeleteFeedbackAward()


### Example

```typescript
import {
    FeedbackServiceApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FeedbackServiceApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.feedbackServiceDeleteFeedbackAward(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**StepV1DeleteFeedbackAwardReply**

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

# **feedbackServiceGetFeedbackAward**
> StepV1GetFeedbackAwardReply feedbackServiceGetFeedbackAward()


### Example

```typescript
import {
    FeedbackServiceApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FeedbackServiceApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.feedbackServiceGetFeedbackAward(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**StepV1GetFeedbackAwardReply**

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

# **feedbackServiceGetFeedbackAwards**
> StepV1GetFeedbackAwardsReply feedbackServiceGetFeedbackAwards()


### Example

```typescript
import {
    FeedbackServiceApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FeedbackServiceApi(configuration);

let page: number; // (optional) (default to undefined)
let pageSize: number; // (optional) (default to undefined)
let status: string; // (optional) (default to undefined)
let settedStartDate: string; // (optional) (default to undefined)
let settedEndDate: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.feedbackServiceGetFeedbackAwards(
    page,
    pageSize,
    status,
    settedStartDate,
    settedEndDate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] |  | (optional) defaults to undefined|
| **pageSize** | [**number**] |  | (optional) defaults to undefined|
| **status** | [**string**] |  | (optional) defaults to undefined|
| **settedStartDate** | [**string**] |  | (optional) defaults to undefined|
| **settedEndDate** | [**string**] |  | (optional) defaults to undefined|


### Return type

**StepV1GetFeedbackAwardsReply**

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

