export default function ReadLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden pb-5">
      <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
