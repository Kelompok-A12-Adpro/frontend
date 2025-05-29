import { defaultQueryClientOptions } from "@/libs/tanstack-query/options";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import LandingPage from "@/components/pages/home/page";

export default async function Home() {
  const queryClient = new QueryClient({
    defaultOptions: defaultQueryClientOptions,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LandingPage />
    </HydrationBoundary>
  );
}
