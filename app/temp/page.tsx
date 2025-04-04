import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AddPropertyPage = () => {
  const activities = {
    저기계발: 42, // 주 7일 * 6시간
    수영: 9, // 주 3일 * 3시간
    "필라테스 & 웰스": 6, // 주 2일 * 3시간
    정리: 3, // 주 1일 * 3시간
    청소: 3, // 주 1일 * 3시간
    "점심 및 휴식": 21, // 주 7일 * 3시간
    업무: 21, // 주 7일 * 3시간
    "저녁 및 휴식": 21, // 주 7일 * 3시간
  };

  const totalHours = Object.values(activities).reduce(
    (acc, curr) => acc + curr,
    0
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>주간 시간 분석</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(activities).map(([activity, hours]) => (
              <div key={activity} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{activity}</span>
                  <span className="text-sm text-gray-500">
                    {hours}시간 ({((hours / totalHours) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(hours / totalHours) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>주요 패턴 분석</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>• 아침 루틴(5시-8시): 매일 자기계발에 집중</li>
            <li>
              • 오전 활동(8시-11시): 수영, 필라테스/웰스, 정리, 청소 등 체력
              관리와 생활 관리 시간
            </li>
            <li>• 점심 시간(11시-2시): 충분한 휴식 시간 확보</li>
            <li>• 오후(2시-5시): 업무 집중 시간</li>
            <li>• 저녁 시간(5시-8시): 휴식과 식사</li>
            <li>• 마무리(8시-10시): 하루 마무리 자기계발</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPropertyPage;
