import { useEffect } from "react";


type ContextMenuProps = {
    isOpen: boolean;
    position: { x: number; y: number };
    onClose: () => void;
    items: { label: string; onClick: () => void }[];
};


const ContextMenu = ({ isOpen, position, onClose, items }: ContextMenuProps) => {
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (!event.target || !(event.target as HTMLElement).closest(".context-menu")) {
                onClose();
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed bg-gray-50 shadow-lg rounded-md p-3 z-50 flex flex-col gap-2"
            style={{ top: `${position.y}px`, left: `${position.x}px` }}
        >
            {items.map((item, index) => (
                <button
                    key={index}
                    className="text-left transform transition-transform duration-200 hover:scale-105 cursor-pointer"
                    onClick={() => {
                        item.onClick();
                        onClose();
                    }}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
};

export default ContextMenu;
