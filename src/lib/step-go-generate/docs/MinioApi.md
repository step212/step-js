# MinioApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**minioGetDownloadPreSignedUrl**](#miniogetdownloadpresignedurl) | **GET** /minio/presigned/download_url | |
|[**minioGetUploadPreSignedUrl**](#miniogetuploadpresignedurl) | **GET** /minio/presigned/upload_url | |

# **minioGetDownloadPreSignedUrl**
> MinioV1GetDownloadPreSignedUrlReply minioGetDownloadPreSignedUrl()


### Example

```typescript
import {
    MinioApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MinioApi(configuration);

let downloadKey: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.minioGetDownloadPreSignedUrl(
    downloadKey
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **downloadKey** | [**string**] |  | (optional) defaults to undefined|


### Return type

**MinioV1GetDownloadPreSignedUrlReply**

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

# **minioGetUploadPreSignedUrl**
> MinioV1GetUploadPreSignedUrlReply minioGetUploadPreSignedUrl()


### Example

```typescript
import {
    MinioApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MinioApi(configuration);

let uploadKey: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.minioGetUploadPreSignedUrl(
    uploadKey
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **uploadKey** | [**string**] |  | (optional) defaults to undefined|


### Return type

**MinioV1GetUploadPreSignedUrlReply**

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

