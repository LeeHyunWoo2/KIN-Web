import * as React from 'react';

import type { OurFileRouter } from '@/pages/api/uploadthing';
import type {
  ClientUploadedFileData,
  UploadFilesOptions,
} from 'uploadthing/types';

import { generateReactHelpers } from '@uploadthing/react';
import { toast } from 'sonner';
import { z } from 'zod';

export interface UploadedFile<T = unknown> extends ClientUploadedFileData<T> {}

interface UseUploadFileProps
// @ts-ignore
  extends Pick<UploadFilesOptions<OurFileRouter, keyof OurFileRouter>,
    'headers' | 'onUploadBegin' | 'onUploadProgress' | 'skipPolling'
  > {
  onUploadComplete?: (file: UploadedFile) => void;
  onUploadError?: (error: unknown) => void;
}

// @ts-ignore
export function useUploadFile({
  onUploadComplete,
  onUploadError,
  ...props
}: UseUploadFileProps = {}) {
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile>();
  const [uploadingFile, setUploadingFile] = React.useState<File>();
  const [progress, setProgress] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState(false);

  async function uploadThing(file: File) {
    setIsUploading(true);
    setUploadingFile(file);

    try {
      const res = await uploadFiles('editorUploader', {
        ...props,
        files: [file],
        onUploadProgress: ({ progress }) => {
          setProgress(Math.min(progress, 100));
        },
      });

      setUploadedFile(res[0]);

      onUploadComplete?.(res[0]);

      return uploadedFile;

    } catch (error) {

      const errorMessage = getErrorMessage(error);

      const message =
        errorMessage.length > 0
          ? errorMessage
          : '문제가 발생했습니다. 나중에 다시 시도해 주세요.';

      toast.error(message);

      onUploadError?.(error);

      // Mock upload for unauthenticated users
      // toast.info('User not logged in. Mocking upload process.');
      const mockUploadedFile = {
        key: 'mock-key-0',
        appUrl: `https://mock-app-url.com/${file.name}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      } as UploadedFile;

      // Simulate upload progress
      let progress = 0;

      const simulateProgress = async () => {
        while (progress < 100) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          progress += 2;
          setProgress(Math.min(progress, 100));
        }
      };

      await simulateProgress();

      setUploadedFile(mockUploadedFile);

      return mockUploadedFile;
    } finally {
      setProgress(0);
      setIsUploading(false);
      setUploadingFile(undefined);
    }
  }

  return {
    isUploading,
    progress,
    uploadFile: uploadThing,
    uploadedFile,
    uploadingFile,
  };
}

export const { uploadFiles, useUploadThing } =
  generateReactHelpers<OurFileRouter>();

export function getErrorMessage(err: unknown) {
  const unknownError = '문제가 발생했습니다. 나중에 다시 시도해 주세요.';

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });

    return errors.join('\n');
  } else if (err instanceof Error) {
    return err.message;
  } else {
    return unknownError;
  }
}

export function showErrorToast(err: unknown) {
  const errorMessage = getErrorMessage(err);

  return toast.error(errorMessage);
}
