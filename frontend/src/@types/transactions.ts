import type { LucideProps } from "lucide-react";

export type Transaction = {
    id: number;
    desc: string;
    date: string;
    amount: number;
    type: string;
    icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
}
