import { useRouter } from "next/router";
import { useEffect } from "react";

interface EmailClientProps {}

function EmailClient(props: EmailClientProps) {
  const {} = props;
  const router = useRouter();

  useEffect(() => {
    if (router.query.user !== undefined)
      router.replace(`./${router.query.user}/INBOX`).catch(console.log);
  }, [router.query.user]);

  return (
    <div className="flex gap-4">
      <span>Loading...</span>
    </div>
  );
}

export default EmailClient;
