import Link from "next/link";
export function Heading({title,subtitle}:{title:string;subtitle:string}){return <header className="mb-8"><h1 className="text-3xl font-bold">{title}</h1><p className="mt-2 text-slate-600">{subtitle}</p></header>}
export function WorkspacePicker({memberships,currentId,path}:{memberships:Array<{workspace:{id:string;name:string}}>;currentId?:string;path:string}){return <div className="mb-6 flex flex-wrap gap-2" aria-label="Seleziona workspace">{memberships.map(m=><Link key={m.workspace.id} href={`${path}?workspace=${m.workspace.id}`} className={`rounded-full px-3 py-1 text-sm ${m.workspace.id===currentId?"bg-indigo-100 text-indigo-800":"bg-white text-slate-600"}`}>{m.workspace.name}</Link>)}</div>}

