import { ErrorFallback } from "@/components/error-fallback";
import { TransactionsModal } from "@/components/modals/transactions-modal";
import { SearchField } from "@/components/search-field";
import { Table } from "@/components/tables/transactions";
import { Loading } from "@/components/tables/transactions/loading";
import { TransactionsActions } from "@/components/transactions-actions";
import { getBankConnectionsByTeamId } from "@midday/supabase/cached-queries";
import { cn } from "@midday/ui/cn";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Transactions | Midday",
};

export default async function Transactions({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // TODO: Check if there are transactions instead
  const bankConnections = await getBankConnectionsByTeamId();
  const page = typeof searchParams.page === "string" ? +searchParams.page : 0;
  const transactionId = searchParams?.id;
  const filter =
    (searchParams?.filter && JSON.parse(searchParams.filter)) ?? {};
  const sort = searchParams?.sort?.split(":");

  const isOpen = Boolean(searchParams.step);
  const empty = !bankConnections?.data?.length && !isOpen;

  return (
    <>
      <div className="flex justify-between py-6">
        <SearchField placeholder="Search transactions" />
        <TransactionsActions />
      </div>

      <div className={cn(empty && "opacity-20 pointer-events-none")}>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={<Loading />}
            key={JSON.stringify({ page, filter, sort })}
          >
            <Table
              filter={filter}
              page={page}
              sort={sort}
              noAccounts={empty}
              initialTransactionId={transactionId}
              query={searchParams?.q}
            />
          </Suspense>
        </ErrorBoundary>
      </div>

      {!isOpen && empty && <TransactionsModal />}
    </>
  );
}
