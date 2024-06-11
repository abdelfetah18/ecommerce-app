interface DashboardCardProps {
    data: InfoCard;
};

export default function DashboardCard({ data }: DashboardCardProps) {
    return (
        <div className={styles.box_wrapper}>
            <div className={styles.box_values_wrapper}>
                <div className={styles.box_value}>{data.value}</div>
                <div className={styles.box_title}>{data.title}</div>
            </div>
            <div className={styles.box_values_percent_wrapper}>
                <div className={`${styles.percent} ${data.percent >= 0 ? 'text-green-500' : 'text-red-500'}`}>{data.percent >= 0 ? '+' : ''}{data.percent.toFixed(2)}%</div>
            </div>
        </div >
    )
}

const styles = {
    box_wrapper: "w-1/3 flex flex-row shadow border rounded-lg px-2 mr-4 last:mr-0",
    box_values_wrapper: "px-2 py-2 w-11/12",
    box_value: "text-black font-bold text-lg my-2",
    box_title: "text-gray-400 text-xs my-2",
    box_values_percent_wrapper: "w-1/4 flex flex-col items-center justify-center",
    percent: "font-semibold text-sm rounded-lg text-center",
}