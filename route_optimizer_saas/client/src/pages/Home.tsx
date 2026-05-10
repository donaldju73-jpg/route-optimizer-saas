/**
 * 메인 홈 페이지
 * 랜딩 페이지, 업로드 페이지, 결과 페이지를 통합 관리합니다.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { MapPin, Upload, Zap, Download } from 'lucide-react';

import ExcelUploader from '@/components/ExcelUploader';
import AddressTable from '@/components/AddressTable';
import AddressInputForm from '@/components/AddressInputForm';
import OptimizedRouteTable from '@/components/OptimizedRouteTable';
import ResultPage from '@/components/ResultPage';
import ProgressIndicator, { Step } from '@/components/ProgressIndicator';

import { AddressRow, downloadAddressesAsExcel } from '@/lib/excelParser';
import {
  optimizeRouteNearestNeighbor,
  Location,
  OptimizedRoute,
} from '@/lib/routeOptimizer';
import { mockGeocodeAddress } from '@/lib/geocoding';

type PageState = 'landing' | 'upload' | 'setup' | 'result';

export default function Home() {
  const [pageState, setPageState] = useState<PageState>('landing');
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [uploadedAddresses, setUploadedAddresses] = useState<AddressRow[]>([]);
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(
    null
  );
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleUploadSuccess = (data: AddressRow[]) => {
    setUploadedAddresses(data);
    setCurrentStep('setup');
    setPageState('setup');
    toast.success(`${data.length}개의 주소가 업로드되었습니다.`);
  };

  const handleUploadError = (error: string) => {
    toast.error(error);
  };

  const handleOptimize = async (startAddress: string, endAddress: string) => {
    if (uploadedAddresses.length === 0) {
      toast.error('업로드된 주소가 없습니다.');
      return;
    }

    setIsOptimizing(true);
    setCurrentStep('optimize');

    try {
      // 모의 지오코딩으로 좌표 변환
      const startLocation: Location = {
        id: 'start',
        name: '출발지',
        address: startAddress,
        ...mockGeocodeAddress(startAddress),
      };

      const endLocation: Location = {
        id: 'end',
        name: '도착지',
        address: endAddress,
        ...mockGeocodeAddress(endAddress),
      };

      // 업로드된 주소를 Location 객체로 변환
      const locations: Location[] = uploadedAddresses.map((addr) => ({
        id: addr.id,
        name: addr.고객명,
        address: addr.주소,
        phone: addr.연락처,
        memo: addr.메모,
        ...mockGeocodeAddress(addr.주소),
      }));

      // 경로 최적화
      const optimized = optimizeRouteNearestNeighbor(
        locations,
        startLocation,
        endLocation
      );

      setOptimizedRoute(optimized);
      setCurrentStep('result');
      setPageState('result');

      toast.success(
        `최적 경로가 생성되었습니다! (총 거리: ${optimized.totalDistance}km)`
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '경로 최적화 중 오류가 발생했습니다.';
      toast.error(errorMessage);
      setCurrentStep('setup');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleDownloadResult = () => {
    if (!optimizedRoute) {
      toast.error('다운로드할 결과가 없습니다.');
      return;
    }

    const resultData: AddressRow[] = optimizedRoute.locations
      .filter((loc) => loc.id !== 'start' && loc.id !== 'end')
      .map((loc, index) => ({
        id: loc.id,
        순번: index + 1,
        고객명: loc.name,
        주소: loc.address,
        연락처: loc.phone || '',
        메모: loc.memo || '',
      }));

    downloadAddressesAsExcel(
      resultData,
      `optimized_route_${new Date().getTime()}.csv`
    );
    toast.success('결과가 다운로드되었습니다.');
  };

  const handleReset = () => {
    setPageState('landing');
    setCurrentStep('upload');
    setUploadedAddresses([]);
    setOptimizedRoute(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  배송 경로 최적화
                </h1>
                <p className="text-xs text-muted-foreground">Route Optimizer</p>
              </div>
            </div>
            {pageState !== 'landing' && (
              <Button
                variant="outline"
                onClick={handleReset}
                className="text-sm"
              >
                처음으로
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container py-8 md:py-12">
        {pageState === 'landing' && (
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-6 py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                배송 경로를 <span className="text-primary">최적화</span>하세요
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                엑셀 파일로 여러 주소를 업로드하면, 인공지능이 가장 효율적인 방문 순서를
                자동으로 계산해줍니다. 배송 시간을 단축하고 비용을 절감하세요.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <Upload className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">쉬운 업로드</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    엑셀 파일을 드래그 앤 드롭하거나 클릭으로 선택하세요. CSV, XLSX 형식 모두 지원합니다.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <Zap className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">빠른 최적화</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    고급 알고리즘이 최적의 방문 순서를 계산합니다. 배송 거리와 시간을 최소화하세요.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <Download className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">결과 다운로드</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    최적화된 경로를 엑셀 파일로 다운로드하여 바로 사용하세요.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* CTA */}
            <div className="flex justify-center pt-8">
              <Button
                size="lg"
                onClick={() => setPageState('upload')}
                className="h-14 px-8 text-base font-semibold"
              >
                지금 시작하기
              </Button>
            </div>
          </div>
        )}

        {pageState !== 'landing' && (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Progress Indicator */}
            <div className="bg-white rounded-lg p-6 border border-border">
              <ProgressIndicator currentStep={currentStep} />
            </div>

            {/* Upload Page */}
            {pageState === 'upload' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    주소 파일 업로드
                  </h2>
                  <p className="text-muted-foreground">
                    배송할 주소 목록이 포함된 엑셀 파일을 업로드하세요.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-8 border border-border">
                  <ExcelUploader
                    onUploadSuccess={handleUploadSuccess}
                    onUploadError={handleUploadError}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <strong>파일 형식:</strong> 순번, 고객명, 주소, 연락처, 메모 컬럼이 필요합니다.
                  </p>
                </div>
              </div>
            )}

            {/* Setup Page */}
            {pageState === 'setup' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      경로 설정
                    </h2>
                    <p className="text-muted-foreground">
                      출발지와 도착지를 입력한 후 최적화를 시작하세요.
                    </p>
                  </div>

                  <AddressInputForm
                    onSubmit={handleOptimize}
                    isLoading={isOptimizing}
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      업로드된 주소
                    </h3>
                    <div className="bg-white rounded-lg border border-border p-4 max-h-96 overflow-y-auto">
                      <div className="space-y-2">
                        {uploadedAddresses.map((addr, index) => (
                          <div
                            key={addr.id}
                            className="flex items-start gap-2 pb-2 border-b border-border last:border-b-0"
                          >
                            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-semibold flex-shrink-0 mt-0.5">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {addr.고객명}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {addr.주소}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setPageState('upload')}
                  >
                    파일 다시 선택
                  </Button>
                </div>
              </div>
            )}

            {/* Result Page */}
            {pageState === 'result' && optimizedRoute && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    최적화 결과
                  </h2>
                  <p className="text-muted-foreground">
                    계산된 최적 방문 순서입니다. 지도에서 경로를 확인하고 결과를 다운로드하세요.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 border border-border">
                  <ResultPage optimizedRoute={optimizedRoute} />
                </div>

                <div className="flex gap-4">
                  <Button
                    size="lg"
                    onClick={handleDownloadResult}
                    className="flex-1 h-12 text-base font-semibold"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    결과 다운로드
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleReset}
                    className="flex-1 h-12 text-base font-semibold"
                  >
                    새로운 경로 생성
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 mt-16">
        <div className="container py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 배송 경로 최적화. 모든 권리 보유.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
