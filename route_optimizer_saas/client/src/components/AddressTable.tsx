/**
 * 주소 테이블 컴포넌트
 * 업로드된 주소 목록을 테이블 형식으로 표시합니다.
 */

import { AddressRow } from '@/lib/excelParser';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AddressTableProps {
  addresses: AddressRow[];
}

export default function AddressTable({ addresses }: AddressTableProps) {
  if (addresses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        업로드된 주소가 없습니다.
      </div>
    );
  }

  return (
    <div className="w-full border border-border rounded-lg overflow-hidden">
      <ScrollArea className="w-full">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                순번
              </th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                고객명
              </th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                주소
              </th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                연락처
              </th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                메모
              </th>
            </tr>
          </thead>
          <tbody>
            {addresses.map((address, index) => (
              <tr
                key={address.id}
                className={`
                  border-b border-border transition-colors
                  ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}
                  hover:bg-muted/40
                `}
              >
                <td className="px-4 py-3 text-foreground font-medium">
                  {address.순번}
                </td>
                <td className="px-4 py-3 text-foreground">{address.고객명}</td>
                <td className="px-4 py-3 text-foreground text-xs">
                  {address.주소}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {address.연락처 || '-'}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {address.메모 || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>

      <div className="bg-muted/30 px-4 py-3 border-t border-border">
        <p className="text-sm text-muted-foreground">
          총 <span className="font-semibold text-foreground">{addresses.length}</span>개의 주소
        </p>
      </div>
    </div>
  );
}
