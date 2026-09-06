import Image from "next/image";
import { useRouter } from "next/navigation";
import { sidebarItems, type SidebarItem } from "./sidebar.type";

type SidebarProps = {
  selected: SidebarItem;
  collapsed: boolean;
  onToggle: () => void;
};

const routeMap: Record<SidebarItem, string> = {
  Dashboard: "/admin/dashboard",
  Staff: "/staff",
  Clients: "/client",
};

export default function Sidebar({
  selected,
  collapsed,
  onToggle,
}: SidebarProps) {
  const router = useRouter();

  return (
    <aside
      className={`${collapsed ? "w-20" : "w-64"} min-h-screen bg-white shadow-lg p-4 transition-all duration-300`}
    >
      <div className="mb-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push(routeMap.Dashboard)}
          aria-label="Go to dashboard"
          className="flex items-center overflow-hidden"
        >
          <Image
            src="/company_logo.png"
            alt="Fortune Link logo"
            width={collapsed ? 32 : 80}
            height={collapsed ? 30 : 70}
            priority
            className="object-contain"
          />
        </button>

        <button
          type="button"
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className="rounded-md border border-gray-200 px-2 py-1 text-gray-600 hover:bg-gray-100"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      <nav>
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <SidebarNavItem
              key={item}
              item={item}
              active={selected === item}
              collapsed={collapsed}
              onSelect={() => router.push(routeMap[item])}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

function SidebarNavItem({
  item,
  active,
  collapsed,
  onSelect,
}: {
  item: SidebarItem;
  active: boolean;
  collapsed: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-current={active ? "page" : undefined}
        title={collapsed ? item : undefined}
        className={`flex w-full items-center rounded-md px-3 py-2 text-left transition-colors ${
          active
            ? "bg-gray-100 font-semibold text-black"
            : "text-gray-600 hover:bg-gray-50 hover:text-black"
        }`}
      >
        {collapsed ? item.charAt(0) : item}
      </button>
    </li>
  );
}