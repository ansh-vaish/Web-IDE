import AddNewButton from "@/modules/dashboard/components/add-new";
import AddRepo from "@/modules/dashboard/components/add-repo";
import EmptyState from "@/modules/dashboard/components/empty-state";
import { ProjectTable } from "@/modules/dashboard/components/project-table";
import {
  getAllPlaygroundsOfUser,
  updatePlaygroundById,
  deletePlaygroundById,
  duplicatePlaygroundById,
} from "@/modules/dashboard/actions";
import { CursorGlitter } from "@/modules/home/CursorGlitter";

const page = async () => {
  const playgrounds = await getAllPlaygroundsOfUser();

  return (
    <div className="relative flex min-h-screen w-full justify-center bg-black text-white">
      {/* Softer background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.12),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.08),transparent_50%)]" />

      <div className="relative z-10 flex w-full max-w-7xl flex-col items-center px-4 py-12">
        <CursorGlitter />

        {/* Top Action Cards */}
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/70 backdrop-blur-xl shadow-[0_0_30px_rgba(139,92,246,0.08)] transition hover:border-purple-400/30 hover:shadow-[0_0_40px_rgba(139,92,246,0.12)]">
            <AddNewButton />
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-900/70 backdrop-blur-xl shadow-[0_0_30px_rgba(99,102,241,0.08)] transition hover:border-indigo-400/30 hover:shadow-[0_0_40px_rgba(99,102,241,0.12)]">
            <AddRepo />
          </div>
        </div>

        {/* Projects Section */}
        <div className="mt-12 w-full rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-xl p-6 shadow-[0_0_40px_rgba(139,92,246,0.06)]">
          {playgrounds && playgrounds.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-lg font-medium text-white/80">
                No projects yet
              </p>
              <p className="mt-2 text-sm text-white/50">
                Start by creating a new workspace or importing a repo
              </p>
            </div>
          ) : (
            <ProjectTable
              projects={playgrounds || []}
              onDeleteProject={deletePlaygroundById}
              onUpdateProject={updatePlaygroundById}
              onDuplicateProject={duplicatePlaygroundById}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
