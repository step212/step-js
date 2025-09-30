import { AiApi } from '@/lib/step-python-generate/api';
import { Configuration as StepPythonConfiguration } from '@/lib/step-python-generate/configuration';
import { StepServiceApi, PortraitServiceApi, FeedbackServiceApi } from '@/lib/step-go-generate/api';
import { Configuration as StepGoConfiguration } from '@/lib/step-go-generate/configuration';
import { StepNoauthServiceApi } from '@/lib/step-go-generate/api';
import { Configuration as StepGoNoauthConfiguration } from '@/lib/step-go-generate/configuration';
import https from 'https';
import axios from 'axios';

const getStepPythonApiInstance = (accessToken: string|undefined) => {
    if (!accessToken) {
        throw new Error('Unauthorized');
    }

    const endpoint = process.env.NEXT_PUBLIC_STEP_ENDPOINT || 'localhost';
    const port = process.env.NEXT_PUBLIC_STEP_PORT || '8000';
    const path = process.env.NEXT_PUBLIC_STEP_PYTHON_PATH || '';
    const useSSL = process.env.NEXT_PUBLIC_STEP_USE_SSL === 'true';

    const basePath = `${useSSL ? 'https' : 'http'}://${endpoint}:${port}${path}`;

    const configuration: StepPythonConfiguration = {
      basePath,
      accessToken: accessToken,
      isJsonMime: () => false
    };

    const axiosInstance = useSSL
    ? axios.create({ httpsAgent: new https.Agent({ rejectUnauthorized: false }) })
    : axios;

    return new AiApi(configuration, undefined, axiosInstance);
};

const getStepGoApiInstance = (accessToken: string|undefined) => {
    if (!accessToken) {
        throw new Error('Unauthorized');
    }

    const endpoint = process.env.NEXT_PUBLIC_STEP_ENDPOINT || 'localhost';
    const port = process.env.NEXT_PUBLIC_STEP_PORT || '8000';
    const path = process.env.NEXT_PUBLIC_STEP_PATH || '';
    const useSSL = process.env.NEXT_PUBLIC_STEP_USE_SSL === 'true';

    const basePath = `${useSSL ? 'https' : 'http'}://${endpoint}:${port}${path}`;

    const configuration: StepGoConfiguration = {
      basePath,
      accessToken: accessToken,
      isJsonMime: () => false
    };

    const axiosInstance = useSSL
    ? axios.create({ httpsAgent: new https.Agent({ rejectUnauthorized: false }) })
    : axios;

    return new StepServiceApi(configuration, undefined, axiosInstance);
}

const getPortraitApiInstance = (accessToken: string|undefined) => {
    if (!accessToken) {
        throw new Error('Unauthorized');
    }

    const endpoint = process.env.NEXT_PUBLIC_STEP_ENDPOINT || 'localhost';
    const port = process.env.NEXT_PUBLIC_STEP_PORT || '8000';
    const path = process.env.NEXT_PUBLIC_STEP_PATH || '';
    const useSSL = process.env.NEXT_PUBLIC_STEP_USE_SSL === 'true';

    const basePath = `${useSSL ? 'https' : 'http'}://${endpoint}:${port}${path}`;

    const configuration: StepGoConfiguration = {
      basePath,
      accessToken: accessToken,
      isJsonMime: () => false
    };

    const axiosInstance = useSSL
    ? axios.create({ httpsAgent: new https.Agent({ rejectUnauthorized: false }) })
    : axios;

    return new PortraitServiceApi(configuration, undefined, axiosInstance);
}

const getFeedbackApiInstance = (accessToken: string|undefined) => {
    if (!accessToken) {
        throw new Error('Unauthorized');
    }

    const endpoint = process.env.NEXT_PUBLIC_STEP_ENDPOINT || 'localhost';
    const port = process.env.NEXT_PUBLIC_STEP_PORT || '8000';
    const path = process.env.NEXT_PUBLIC_STEP_PATH || '';
    const useSSL = process.env.NEXT_PUBLIC_STEP_USE_SSL === 'true';

    const basePath = `${useSSL ? 'https' : 'http'}://${endpoint}:${port}${path}`;

    const configuration: StepGoConfiguration = {
      basePath,
      accessToken: accessToken,
      isJsonMime: () => false
    };

    const axiosInstance = useSSL
    ? axios.create({ httpsAgent: new https.Agent({ rejectUnauthorized: false }) })
    : axios;

    return new FeedbackServiceApi(configuration, undefined, axiosInstance);
}

const getStepGoNoauthApiInstance = () => {
    const endpoint = process.env.NEXT_PUBLIC_STEP_ENDPOINT || 'localhost';
    const port = process.env.NEXT_PUBLIC_STEP_PORT || '8000';
    const path = process.env.NEXT_PUBLIC_STEP_PATH_NOAUTH || '';
    const useSSL = process.env.NEXT_PUBLIC_STEP_USE_SSL === 'true';

    const basePath = `${useSSL ? 'https' : 'http'}://${endpoint}:${port}${path}`;

    const configuration: StepGoNoauthConfiguration = {
      basePath,
      isJsonMime: () => false
    };

    const axiosInstance = useSSL
    ? axios.create({ httpsAgent: new https.Agent({ rejectUnauthorized: false }) })
    : axios;

    return new StepNoauthServiceApi(configuration, undefined, axiosInstance);
}

export { getStepPythonApiInstance, getStepGoApiInstance, getPortraitApiInstance, getFeedbackApiInstance, getStepGoNoauthApiInstance }