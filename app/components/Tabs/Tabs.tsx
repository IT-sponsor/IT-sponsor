"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface TabProps {
    panels: TabPanelProps[];
}

interface TabPanelProps {
    name: string;
    link: string;
    newPage?: boolean;    
}

const Tabs = ({ panels }: TabProps) => {
    const pathname = usePathname();
    const activePanelIndex = panels.findIndex(panel => panel.link === pathname);

    return (
        <div>
            <div className="sm:hidden">
                <label htmlFor="Tab" className="sr-only">Tab</label>

                <select id="Tab" name="Tab" defaultValue={activePanelIndex} className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                    {panels.map((panel, index) => (
                        <option key={index}>{panel.name}</option>
                    ))}
                </select>
            </div>

            <div className="hidden sm:block">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex gap-6">
                        {panels.map((panel, index) => (
                            <Link
                                href={panel.link}
                                className={pathname === panel.link ? "shrink-0 rounded-t-lg border border-gray-300 border-b-white p-3 text-sm font-medium text-sky-600" : "shrink-0 border border-transparent p-3 text-sm font-medium text-gray-500 hover:text-gray-700"}
                                key={index}
                                rel={panel.newPage ? "noopener noreferrer" : undefined}
                                target={panel.newPage ? "_blank" : undefined}
                            >
                                {panel.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Tabs;