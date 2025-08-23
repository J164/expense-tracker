"use client";

import { useState } from "react";
import { createTag, deleteTag } from "@/app/lib/actions/profile";
import { UserTag } from "@/app/lib/types";
import { defaultCategories } from "@/app/lib/utils";

interface TagManagerProps {
    userTags: UserTag[];
}

export default function TagManager({ userTags }: TagManagerProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [newTagName, setNewTagName] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!newTagName.trim()) {
            setError("Tag name is required");
            return;
        }

        // Check if tag already exists (including default categories)
        const allExistingTags = [
            ...defaultCategories,
            ...userTags.map(tag => tag.name)
        ];

        if (allExistingTags.includes(newTagName.toLowerCase())) {
            setError("Tag already exists");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("tagName", newTagName.trim());
            await createTag(formData);
            setNewTagName("");
            setIsCreating(false);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to create tag"
            );
        }
    };

    const handleDelete = async (tagId: string) => {
        if (confirm("Are you sure you want to delete this tag?")) {
            try {
                await deleteTag(tagId);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Failed to delete tag"
                );
            }
        }
    };

    return (
        <div className="rounded-md border p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Manage Tags</h2>
                <button
                    onClick={() => setIsCreating(true)}
                    className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
                    disabled={isCreating}
                >
                    Add New Tag
                </button>
            </div>

            {error && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {isCreating && (
                <form
                    onSubmit={handleSubmit}
                    className="mb-6 rounded-md bg-gray-50 p-4"
                >
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newTagName}
                            onChange={e => setNewTagName(e.target.value)}
                            placeholder="Enter tag name"
                            className="flex-1 rounded-md border px-3 py-2 text-sm"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="rounded-md bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-400"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsCreating(false);
                                setNewTagName("");
                                setError("");
                            }}
                            className="rounded-md bg-gray-500 px-4 py-2 text-sm text-white hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Default Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {defaultCategories.map(category => (
                            <span
                                key={category}
                                className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                            >
                                {category}
                            </span>
                        ))}
                    </div>
                </div>

                {userTags.length > 0 && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                            Custom Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {userTags.map(tag => (
                                <span
                                    key={tag.id}
                                    className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
                                >
                                    {tag.name}
                                    <button
                                        onClick={() => handleDelete(tag.id)}
                                        className="ml-2 text-green-600 hover:text-green-800"
                                        title="Delete tag"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
