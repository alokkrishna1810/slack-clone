import { useUser } from "@clerk/clerk-react";
import * as Sentry from "@sentry/react";
import { useEffect, useState } from "react";
import { getStreamToken } from "../lib/api.js";
import { useQuery } from "@tanstack/react-query";
import { StreamChat } from "stream-chat";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

export const useStreamChat = () => {
  const { user } = useUser();
  const [chatClient, setChatClient] = useState(null);

  const {
    data: tokenData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!tokenData?.token || !user || !STREAM_API_KEY) return;

    const client = StreamChat.getInstance(STREAM_API_KEY);
    let cancelled = false;

    const connect = async () => {
      try {
        await client.connectUser(
          {
            id: user.id,
            name:
              user.fullName ??
              user.username ??
              user.primaryEmailAddress?.emailAddress ??
              user.id,
            image: user.imageUrl ?? undefined,
          },
          tokenData.token
        );

        if (!cancelled) {
          setChatClient(client);
        }
      } catch (error) {
        console.log("Error connecting to stream:", error);

        Sentry.captureException(error, {
          tags: {
            component: "useStreamChat",
          },
          extra: {
            context: "stream_chat_connextion",
            userId: user?.id,
            streamApiKey: STREAM_API_KEY ? "present" : "missing",
          },
        });
      }
    };

    connect();

    return () => {
      cancelled = true;
      client.disconnectUser();
    };
  }, [tokenData?.token, user?.id]);

  return { chatClient, isLoading, error };
};
