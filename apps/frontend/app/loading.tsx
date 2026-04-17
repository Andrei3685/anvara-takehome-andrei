export default function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-[--color-border] border-t-[--color-primary]" />
        <p className="text-sm text-[--color-muted]">Loading...</p>
      </div>
    </div>
  );
}
