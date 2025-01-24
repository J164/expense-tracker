"use client";

import React, { useEffect, useRef, useState } from "react";

type ModalType = "default" | "destructive";

export default function FormModal({
    title,
    action,
    icon,
    type = "default",
    children
}: {
    title: string;
    action: (formData: FormData) => void;
    icon: React.ReactNode;
    type?: ModalType;
    children: React.ReactNode;
}) {
    const modalRef = useRef<HTMLDivElement | null>(null);
    const [showModal, setShowModal] = useState(false);

    const formAction = (formData: FormData) => {
        action(formData);
        setShowModal(false);
    };

    useEffect(() => {
        const handleKeyDown = (event: { key: string }) => {
            if (event.key === "Escape") {
                setShowModal(false);
            }
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleClickOutside = (event: any) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowModal(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="rounded-md border p-2 hover:bg-gray-100"
            >
                {icon}
            </button>

            {showModal && (
                <div
                    className="fixed inset-0 z-5 bg-black bg-opacity-50"
                    aria-modal="true"
                    aria-hidden={!showModal}
                >
                    <div className="flex items-center justify-center min-h-screen">
                        <div
                            className="bg-white rounded-lg shadow-lg p-8 w-96"
                            ref={modalRef}
                        >
                            <h2 className="text-2xl font-bold mb-4">{title}</h2>
                            <form action={formAction}>
                                {children}
                                <div className="flex items-center justify-end">
                                    <button
                                        className={
                                            (type === "destructive"
                                                ? "bg-red-500"
                                                : "bg-blue-500") +
                                            " hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        }
                                        type="submit"
                                    >
                                        {type === "destructive"
                                            ? "Delete"
                                            : "Save"}
                                    </button>
                                    <button
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
