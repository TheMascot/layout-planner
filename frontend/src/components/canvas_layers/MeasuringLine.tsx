import calculateDistance from '../../calculations/calculateDistance';
import type { MeasuringData } from '../../types/measuringData';

interface Props {
  measuringData: MeasuringData;
}

export function MeasuringLine({ measuringData }: Props) {
  return (
    <>
      {measuringData.measuringStart && (
        <line
          x1={measuringData.measuringStart.x}
          y1={measuringData.measuringStart.y}
          x2={measuringData.measuringEnd?.x ?? measuringData.measuringStart.x}
          y2={measuringData.measuringEnd?.y ?? measuringData.measuringStart.y}
          stroke="red"
          strokeWidth={0.2}
          strokeDasharray="1 1"
          pointerEvents="none"
        />
      )}
      {measuringData.measuringStart && measuringData.measuringEnd && (
        <text
          x={(measuringData.measuringStart.x + measuringData.measuringEnd.x) / 2}
          y={(measuringData.measuringStart.y + measuringData.measuringEnd.y) / 2}
          fill="red"
          fontSize={6}
          pointerEvents="none"
          style={{ userSelect: 'none' }}
        >
          {calculateDistance(measuringData.measuringStart, measuringData.measuringEnd).toFixed(1)} m
        </text>
      )}
    </>
  );
}
