"use client";

import type { BoxConfig } from "@/types";

type BoxSizeSelectorProps = {
    boxes: readonly BoxConfig[];
    selectedBox: number | null;
    onSelect: (pieces: number) => void;
    piecesLabel: string;
    maxTypesLabel: (count: number) => string;
};

export default function BoxSizeSelector({
    boxes,
    selectedBox,
    onSelect,
    piecesLabel,
    maxTypesLabel,
}: BoxSizeSelectorProps) {
    return (
        <div className="flex flex-wrap justify-center gap-4">
            {boxes.map((box) => (
                <button
                    key={box.pieces}
                    onClick={() => onSelect(box.pieces)}
                    className={`px-6 py-4 rounded-xl border-2 transition-all ${selectedBox === box.pieces
                            ? "border-[var(--primary)] bg-[var(--primary-light)]"
                            : "border-[var(--border)] hover:border-[var(--primary)]/50 bg-[var(--bg-card)]"
                        }`}
                >
                    <div
                        className={`text-2xl font-bold ${selectedBox === box.pieces
                                ? "text-[var(--primary)]"
                                : "text-[var(--text-primary)]"
                            }`}
                    >
                        {box.pieces}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">{piecesLabel}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">
                        {maxTypesLabel(box.maxTypes)}
                    </div>
                </button>
            ))}
        </div>
    );
}