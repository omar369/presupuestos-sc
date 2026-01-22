import Planos from "@/features/croquis/editor/Planos";

export default async function CroquisPage({
    params,
}: {
    params: Promise<{ croquisId: string }>;
}) {
    const { croquisId } = await params;
    return <Planos croquisId={croquisId} />;
}