import ClientForm from "@/components/Client/CreateForm";
type Props = {
  params: Promise<{
    clientId: string;
  }>;
};
export default async function EditClientPage({ params }: Props) {
  const { clientId } = await params;
  return <ClientForm clientId={decodeURIComponent(clientId)} />;
}
