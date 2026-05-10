/**
 * 엑셀 파일 파싱 유틸리티
 * 사용자가 업로드한 엑셀 파일에서 주소 데이터를 추출합니다.
 */
import * as XLSX from 'xlsx';
export interface AddressRow {
  id: string;
  순번: number;
  고객명: string;
  주소: string;
  연락처: string;
  메모: string;
}

/**
 * CSV 문자열을 파싱하여 AddressRow 배열로 변환
 * 엑셀에서 CSV로 저장된 파일을 처리합니다.
 */
export async function parseExcelFile(file: File): Promise<AddressRow[]> {
  return new Promise((resolve, reject) => {
    const requiredHeaders = ['순번', '고객명', '주소', '연락처'];

    const normalizeHeader = (value: unknown) =>
      String(value ?? '')
        .replace(/\uFEFF/g, '')
        .replace(/\r/g, '')
        .replace(/\n/g, '')
        .trim();

    const parseRows = (rawRows: unknown[][]) => {
      const rows = rawRows.filter((row) =>
        row.some((cell) => String(cell ?? '').trim())
      );

      if (rows.length < 2) {
        throw new Error('유효한 데이터가 없습니다. 최소 1개 이상의 주소가 필요합니다.');
      }

      const headerRow = rows[0].map(normalizeHeader);

      const missingRequiredColumns = requiredHeaders.filter(
        (header) => !headerRow.includes(header)
      );

      if (missingRequiredColumns.length > 0) {
        throw new Error(`필수 컬럼이 없습니다: ${missingRequiredColumns.join(', ')}`);
      }

      const getColumnIndex = (header: string) =>
        headerRow.findIndex((h) => h === header);

      const 순번Index = getColumnIndex('순번');
      const 고객명Index = getColumnIndex('고객명');
      const 주소Index = getColumnIndex('주소');
      const 연락처Index = getColumnIndex('연락처');
      const 메모Index = getColumnIndex('메모');

      const data: AddressRow[] = [];

      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].map((cell) => String(cell ?? '').trim());

        if (!cells[주소Index]) continue;

        data.push({
          id: `row-${i}`,
          순번: Number(cells[순번Index]) || i,
          고객명: cells[고객명Index] || `고객 ${i}`,
          주소: cells[주소Index],
          연락처: cells[연락처Index] || '',
          메모: 메모Index >= 0 ? cells[메모Index] || '' : '',
        });
      }

      if (data.length === 0) {
        throw new Error('파싱된 주소 데이터가 없습니다.');
      }

      return data;
    };

    const isExcelFile =
      file.name.toLowerCase().endsWith('.xlsx') ||
      file.name.toLowerCase().endsWith('.xls');

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        if (isExcelFile) {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          const rawRows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
            header: 1,
            defval: '',
          });

          resolve(parseRows(rawRows));
          return;
        }

        const text = e.target?.result as string;
        const rawRows = text
          .split('\n')
          .filter((row) => row.trim())
          .map((row) => row.split(','));

        resolve(parseRows(rawRows));
      } catch (error) {
        reject(
          new Error(
            error instanceof Error
              ? error.message
              : `파일 파싱 중 오류가 발생했습니다: ${error}`
          )
        );
      }
    };

    reader.onerror = () => {
      reject(new Error('파일을 읽을 수 없습니다.'));
    };

    if (isExcelFile) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });
}
/**
 * 샘플 엑셀 데이터를 생성합니다 (테스트용)
 */
export function generateSampleExcelData(): string {
  const headers = ['순번', '고객명', '주소', '연락처', '메모'];
  const sampleData = [
    ['1', '김철수', '서울시 강남구 테헤란로 123', '010-1234-5678', '오전 배송'],
    ['2', '이영희', '서울시 강남구 강남대로 456', '010-2345-6789', ''],
    ['3', '박민준', '서울시 서초구 서초대로 789', '010-3456-7890', '신호등 근처'],
    ['4', '최지은', '서울시 송파구 올림픽로 321', '010-4567-8901', '오후 배송'],
    ['5', '정준호', '서울시 마포구 마포대로 654', '010-5678-9012', ''],
  ];
  const csvContent = [
    headers.join(','),
    ...sampleData.map((row) => row.join(',')),
  ].join('\n');
  return csvContent;
}

/**
 * 주소 배열을 CSV 형식으로 변환하여 다운로드
 */
export function downloadAddressesAsExcel(
  addresses: AddressRow[],
  filename: string = 'optimized_routes.csv'
) {
  const headers = ['순번', '고객명', '주소', '연락처', '메모'];
  const csvContent = [
    headers.join(','),
    ...addresses.map((addr) =>
      [addr.순번, addr.고객명, addr.주소, addr.연락처, addr.메모]
  .map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`)
  .join(','))

  ].join('\n');
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
