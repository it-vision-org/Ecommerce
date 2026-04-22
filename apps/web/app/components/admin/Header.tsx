import type { ReactNode } from "react";

type HeaderProps = {
    title: ReactNode;
    description?: ReactNode;
    rightContent?: ReactNode;
    children?: ReactNode;
    className?: string;
    titleClassName?: string;
    descriptionClassName?: string;
};

export default function Header({
    title,
    description,
    rightContent,
    children,
    className,
    titleClassName,
    descriptionClassName,
}: HeaderProps) {
    const finalTitleClassName =
        titleClassName ||
        "text-3xl font-bold bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] bg-clip-text text-transparent";

    const finalDescriptionClassName =
        descriptionClassName || "text-sm text-[var(--text-secondary)] mt-0.5";

    return (
        <div className={className}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className={finalTitleClassName}>{title}</h1>
                    {description ? (
                        <p className={finalDescriptionClassName}>{description}</p>
                    ) : null}
                </div>
                {rightContent ? <div className="shrink-0">{rightContent}</div> : null}
            </div>

            {children ? <div className="mt-4">{children}</div> : null}
        </div>
    );
}