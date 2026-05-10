/**
 * 주소 입력 폼 컴포넌트
 * 출발지와 도착지 주소를 입력받습니다.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface AddressInputFormProps {
  onSubmit: (startAddress: string, endAddress: string) => void;
  isLoading?: boolean;
}

export default function AddressInputForm({
  onSubmit,
  isLoading = false,
}: AddressInputFormProps) {
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [errors, setErrors] = useState<{ start?: string; end?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { start?: string; end?: string } = {};

    if (!startAddress.trim()) {
      newErrors.start = '출발지 주소를 입력하세요.';
    }

    if (!endAddress.trim()) {
      newErrors.end = '도착지 주소를 입력하세요.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit(startAddress.trim(), endAddress.trim());
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          출발지 및 도착지 설정
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="start-address" className="font-semibold">
              출발지 주소 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="start-address"
              type="text"
              placeholder="예: 서울시 강남구 테헤란로 123"
              value={startAddress}
              onChange={(e) => {
                setStartAddress(e.target.value);
                if (errors.start) setErrors({ ...errors, start: undefined });
              }}
              disabled={isLoading}
              className="text-base"
            />
            {errors.start && (
              <p className="text-sm text-destructive">{errors.start}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-address" className="font-semibold">
              도착지 주소 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="end-address"
              type="text"
              placeholder="예: 서울시 마포구 마포대로 654"
              value={endAddress}
              onChange={(e) => {
                setEndAddress(e.target.value);
                if (errors.end) setErrors({ ...errors, end: undefined });
              }}
              disabled={isLoading}
              className="text-base"
            />
            {errors.end && (
              <p className="text-sm text-destructive">{errors.end}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 text-base font-semibold"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                최적화 중...
              </div>
            ) : (
              '최적 경로 생성'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
