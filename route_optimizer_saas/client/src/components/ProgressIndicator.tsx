/**
 * 진행 표시기 컴포넌트
 * 사용자가 현재 단계를 명확히 알 수 있도록 표시합니다.
 */

import { Check } from 'lucide-react';

export type Step = 'upload' | 'setup' | 'optimize' | 'result';

interface ProgressIndicatorProps {
  currentStep: Step;
}

const steps: { id: Step; label: string; description: string }[] = [
  { id: 'upload', label: '파일 업로드', description: '엑셀 파일 선택' },
  { id: 'setup', label: '경로 설정', description: '출발지/도착지 입력' },
  { id: 'optimize', label: '최적화', description: '경로 계산 중' },
  { id: 'result', label: '결과', description: '최적 경로 확인' },
];

export default function ProgressIndicator({
  currentStep,
}: ProgressIndicatorProps) {
  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                  transition-all duration-300
                  ${
                    isCompleted
                      ? 'bg-success text-success-foreground'
                      : isCurrent
                        ? 'bg-primary text-primary-foreground ring-2 ring-primary/30'
                        : 'bg-muted text-muted-foreground'
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="ml-3 flex-1">
                <p
                  className={`
                    text-sm font-semibold transition-colors
                    ${
                      isCurrent || isCompleted
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }
                  `}
                >
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    h-1 flex-1 mx-2 rounded-full transition-all duration-300
                    ${
                      isCompleted
                        ? 'bg-success'
                        : isCurrent
                          ? 'bg-primary/30'
                          : 'bg-muted'
                    }
                  `}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
