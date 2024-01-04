import { Progress } from "@/components/ui/Progress";
import { useTimeout } from "@mantine/hooks";
import { useEffect, useState } from "react";

function TestProgress() {
  const [progress, setProgress] = useState(13);
  const { start } = useTimeout(() => setProgress(66), 500);

  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Progress
      value={progress}
      className="w-[60%]"
      onClick={() => setProgress((prev) => (prev - 20 > 0 ? prev - 20 : 100))}
    />
  );
}

export default TestProgress;
