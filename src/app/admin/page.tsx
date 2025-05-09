import { defaultQueryClientOptions } from "@/libs/tanstack-query/options";
import {
    HydrationBoundary,
    QueryClient,
    dehydrate,
} from "@tanstack/react-query";
import DashboardPage from "@/components/pages/admin/DashboardPage";

export default async function Home() {
    const queryClient = new QueryClient({
        defaultOptions: defaultQueryClientOptions,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DashboardPage />
        </HydrationBoundary>
    );
}
