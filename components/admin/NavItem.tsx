import Link from "next/link";

interface NavItemProps {
    page: DasboardPage;
    selected: boolean;
};

export default function NavItem({ page: { Icon, name, path }, selected }: NavItemProps) {
    return (
        <Link href={path} >
            <div className={`mb-10 rounded-lg cursor-pointer duration-300 active:scale-110 flex items-center ${selected ? "text-primary-color" : ""}`}>
                <Icon className={`text-2xl cursor-pointer ${selected ? 'text-primary-color' : 'text-black'}`} />
                <div className={`ml-2 font-bold ${selected ? 'text-primary-color' : 'text-black'}`}>{name}</div>
            </div>
        </Link>
    )
}