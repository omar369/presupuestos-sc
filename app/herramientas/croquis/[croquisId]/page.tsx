import Planos from "@/features/croquis/editor/Planos";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { headers } from 'next/headers';

async function getCroquisInfo(croquisId: string) {
    const h = await headers();
    const host = h.get('host');
    const proto = h.get('x-forwarded-proto') ?? 'http';
    const res = await fetch(`${proto}://${host}/api/croquis/${croquisId}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.croquis;
}

export default async function CroquisPage({
    params,
}: {
    params: Promise<{ croquisId: string }>;
}) {
    const { croquisId } = await params;
    const croquis = await getCroquisInfo(croquisId);

    return (
        <Planos croquisId={croquisId} croquisName={croquis?.name} />
    );
}