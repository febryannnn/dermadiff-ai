import { DocsSidebarNav, DocsMobileNav } from "@/components/docs/sidebar-nav";

export default function DocumentationLayout({
  children,
}: LayoutProps<"/documentation">) {
  return (
    <div className="pt-12 pb-24 sm:pt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <DocsMobileNav />
        <div className="flex gap-16">
          <DocsSidebarNav />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
