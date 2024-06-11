import Link from "next/link";

interface LogoProps {
    logoUrl: string;
};

export default function Logo({ logoUrl }: LogoProps) {
    return (
        <div className={styles.logo_wrapper}>
            <Link href="/">
                <img className={styles.logo} src={logoUrl} />
            </Link>
        </div>
    );
}

const styles = {
    logo_wrapper: "flex flex-row items-center justify-center active:scale-125 duration-300",
    logo: "w-10 h-10 rounded-full",
};