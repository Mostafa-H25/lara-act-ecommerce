import Navbar from '@/Components/App/Navbar';
import { usePage } from '@inertiajs/react';
import {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

export default function AuthenticatedLayout({
  children,
}: PropsWithChildren<{ header?: ReactNode }>) {
  const props = usePage().props;
  const [successMessages, setSuccessMessages] = useState<
    { message: string; time: number; id: number }[]
  >([]);
  const timeoutRefs = useRef<{ [key: number]: ReturnType<typeof setTimeout> }| null>(
    null
  );

  useEffect(() => {
    let timeoutId:NodeJS.Timeout;

    if (props.success.message) {
      const newMessage = {
        ...props.success,
        id: props.success.time as number,
      };
      setSuccessMessages((prev) => [newMessage, ...prev]);

      timeoutId = setTimeout(() => {
        setSuccessMessages((prev) =>
          prev.filter((msg) => msg.id !== newMessage.id),
        );
        
        timeoutRefs?.current?[newMessage.id] = null;
        }, 5000);

        timeoutRefs.current[newMessage.id] = timeoutId;
    }

    return ()=> clearTimeout(timeoutId);
  }, [props.success]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      {props.error && (
        <div className="container mx-auto mt-8 px-8 text-red-500">
          <div className="alert alert-error">{props.error}</div>
        </div>
      )}

      {successMessages.length > 0 && (
        <div className="toast toast-top toast-end z-[1000] mt-16">
          {successMessages.map((msg => (
            <div key={msg.id} className="alert alert-success">
              <span>{msg.message}</span>
            </div>
          )))}
        </div>
      )}

      <main>{children}</main>
    </div>
  );
}
