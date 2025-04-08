import { defaultQueryClientOptions } from "@/libs/tanstack-query/options";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import BasicPage from "@/components/pages/basic/page";

export default async function Home() {
  const queryClient = new QueryClient({
    defaultOptions: defaultQueryClientOptions,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BasicPage />
    </HydrationBoundary>
  );
}
