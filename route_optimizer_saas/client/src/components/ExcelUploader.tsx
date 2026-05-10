/**
 * 엑셀 업로드 컴포넌트
 * 사용자가 엑셀 파일을 드래그 앤 드롭하거나 클릭으로 선택할 수 있습니다.
 */

import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { parseExcelFile, AddressRow } from '@/lib/excelParser';

interface ExcelUploaderProps {
  onUploadSuccess: (data: AddressRow[]) => void;
  onUploadError: (error: string) => void;
}

export default function ExcelUploader({
  onUploadSuccess,
  onUploadError,
}: ExcelUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>(
    'idle'
  );
  const [fileName, setFileName] = useState<string>('');

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      const error = 'CSV 또는 XLSX 파일만 업로드 가능합니다.';
      onUploadError(error);
      setUploadStatus('error');
      return;
    }

    setIsLoading(true);
    setFileName(file.name);

    try {
      const data = await parseExcelFile(file);
      setUploadStatus('success');
      onUploadSuccess(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '파일 파싱 중 오류가 발생했습니다.';
      onUploadError(errorMessage);
      setUploadStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${
            isDragging
              ? 'border-primary bg-primary/5 scale-105'
              : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50'
          }
          ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileSelect}
          disabled={isLoading}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          {uploadStatus === 'success' ? (
            <>
              <CheckCircle className="w-12 h-12 text-success" />
              <div>
                <p className="font-semibold text-foreground">파일 업로드 완료</p>
                <p className="text-sm text-muted-foreground">{fileName}</p>
              </div>
            </>
          ) : uploadStatus === 'error' ? (
            <>
              <AlertCircle className="w-12 h-12 text-destructive" />
              <p className="font-semibold text-destructive">업로드 실패</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-muted-foreground" />
              <div>
                <p className="font-semibold text-foreground">
                  엑셀 파일을 여기에 드래그하세요
                </p>
                <p className="text-sm text-muted-foreground">
                  또는 클릭하여 파일을 선택하세요 (CSV, XLSX)
                </p>
              </div>
            </>
          )}
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground mt-4 space-y-1">
        <p>
          <strong>필수 컬럼:</strong> 순번, 고객명, 주소, 연락처
        </p>
        <p>
          <strong>선택 컬럼:</strong> 메모 (없으면 자동으로 빈 값으로 처리됩니다)
        </p>
      </div>
    </div>
  );
}
