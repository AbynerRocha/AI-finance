import { ImageWithFallback } from "#/components/ui/ImageWithFallback";
import logoSrc from "/logo.png";

export function Logo({ size = 8 }: { size?: number }) {
    return (
        <div className="flex items-center gap-2">
            <ImageWithFallback
                src={logoSrc}
                alt="Finança Sábia logo"
                className={`w-${size} h-${size} object-contain shrink-0`}
            />
            <span
                className="text-primary font-medium tracking-widest text-xs uppercase"
                style={{ fontFamily: "DM Mono, monospace" }}
            >
                Finança Sábia
            </span>
        </div>
    );
}