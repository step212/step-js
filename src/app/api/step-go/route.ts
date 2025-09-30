import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { logRequestResponse } from '@/lib/api';

const getApiInstance = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    throw new Error('Unauthorized');
  }

  const endpoint = process.env.NEXT_PUBLIC_STEP_ENDPOINT || 'localhost';
  const port = process.env.NEXT_PUBLIC_STEP_PORT || '8080';
  const path = process.env.NEXT_PUBLIC_STEP_PATH || '/api';
  const useSSL = process.env.NEXT_PUBLIC_STEP_USE_SSL === 'true';
  
  const basePath = `${useSSL ? 'https' : 'http'}://${endpoint}:${port}${path}`;
  
  return {
    uploadBaseUrl: basePath,
    accessToken: session.accessToken,
  };
}

export async function POST(request: NextRequest) {
  try {
    const api = await getApiInstance();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    console.log(`[POST] Received request for action: ${action}`);

    switch (action) {
      case 'step_uploadFile': {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const targetID = formData.get('targetID') as string;
        const parentID = formData.get('parentID') as string;
        const isChallenge = formData.get('isChallenge') === 'true';
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;

        if (!file || (!targetID && !parentID) || !title || !description) {
          return NextResponse.json(
            { error: 'Missing required parameters' },
            { status: 400 }
          );
        }

        // Determine file type based on MIME type
        let fileType: 'image' | 'video' | 'audio'
        if (file.type.startsWith('image/')) {
          fileType = 'image'
        } else if (file.type.startsWith('video/')) {
          fileType = 'video'
        } else if (file.type.startsWith('audio/')) {
          fileType = 'audio'
        } else {
          return NextResponse.json(
            { error: 'Unsupported file type' },
            { status: 400 }
          )
        }
        formData.append('fileType', fileType);

        const objectName = file.name;
        formData.append('objectName', objectName);

        // Forward the request to the backend
        const uploadResult = await fetch(`${api.uploadBaseUrl}/step/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${api.accessToken}`,
          },
          body: formData // Forward the original form data
        });

        //console.log("formData", formData);
        //console.log("api.accessToken", api.accessToken);

        if (!uploadResult.ok) {
          console.log("uploadResult.message", await uploadResult.json());
          throw new Error('Failed to upload file');
        }

        const result = await uploadResult.json();
        logRequestResponse('POST', 'uploadFile', { objectName, fileType, targetID, parentID, isChallenge }, result);
        return NextResponse.json(result);
      }

      case 'feedback_createAward': {
        const formData = await request.formData();
        const files = formData.getAll('files') as File[];
        const description = formData.get('description') as string;
        const targetType = formData.get('targetType') as string;
        const scope = formData.get('scope') as string;
        const dimension = formData.get('dimension') as string;
        const threshold = formData.get('threshold') as string;

        if (!description || !targetType || !scope || !dimension || !threshold) {
          return NextResponse.json(
            { error: 'Missing required parameters' },
            { status: 400 }
          );
        }

        // Create new FormData for backend request
        const backendFormData = new FormData();
        
        // Add files
        files.forEach(file => {
          backendFormData.append('files', file);
        });
        
        // Add other fields
        backendFormData.append('description', description);
        backendFormData.append('targetType', targetType);
        backendFormData.append('scope', scope);
        backendFormData.append('dimension', dimension);
        backendFormData.append('threshold', threshold);

        // Forward the request to the backend
        const createResult = await fetch(`${api.uploadBaseUrl}/feedback/award/create`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${api.accessToken}`,
          },
          body: backendFormData
        });

        if (!createResult.ok) {
          const errorResponse = await createResult.json();
          console.log("createResult.error", errorResponse);
          throw new Error('Failed to create award');
        }

        const result = await createResult.json();
        logRequestResponse('POST', 'createAward', { description, targetType, scope, dimension, threshold, filesCount: files.length }, result);
        return NextResponse.json(result);
      }

      case 'feedback_realizeAward': {
        const formData = await request.formData();
        const files = formData.getAll('files') as File[];
        const id = formData.get('id') as string;

        if (!id) {
          return NextResponse.json(
            { error: 'Missing award ID' },
            { status: 400 }
          );
        }

        // Create new FormData for backend request
        const backendFormData = new FormData();
        
        // Add files
        files.forEach(file => {
          backendFormData.append('files', file);
        });
        
        // Add ID
        backendFormData.append('id', id);

        // Forward the request to the backend
        const realizeResult = await fetch(`${api.uploadBaseUrl}/feedback/award/realize`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${api.accessToken}`,
          },
          body: backendFormData
        });

        if (!realizeResult.ok) {
          const errorResponse = await realizeResult.json();
          console.log("realizeResult.error", errorResponse);
          throw new Error('Failed to realize award');
        }

        const result = await realizeResult.json();
        logRequestResponse('POST', 'realizeAward', { id, filesCount: files.length }, result);
        return NextResponse.json(result);
      }

      default:
        console.log(`[POST] Invalid action: ${action}`);
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[POST] Error in step API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}

