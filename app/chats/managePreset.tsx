import { useState } from "react";
import type { UserPreset } from "./interfaces"; // replace with your actual path

const ManagePresets = ({
  userPresets,
  setUserPresets,
  handlePresetDelete,
  loadUserPreset,
}: {
  userPresets: UserPreset[];
  setUserPresets: (presets: UserPreset[]) => void;
  handlePresetDelete: (presetId: string) => void;
  loadUserPreset: (preset: UserPreset) => void;
}) => {
  const [showPresetList, setShowPresetList] = useState(false);
  const [editingPreset, setEditingPreset] = useState<UserPreset | null>(null);
  const isSaveDisabled = !editingPreset?.name.trim();
  const defaultPreset: UserPreset = {
    id: "default",
    name: "You",
    description: "",
    thumbnail: "",
    fullImage: "",
    p1: "he",
    p2: "his",
    p3: "him",
  };

  const handlePresetFieldChange = (field: keyof UserPreset, value: string) => {
    if (!editingPreset) return;
    setEditingPreset({ ...editingPreset, [field]: value });
  };

  const handleSavePreset = () => {
    if (!editingPreset) return;

    const updatedPresets = userPresets.map((preset) =>
      preset.id === editingPreset.id ? editingPreset : preset
    );

    setUserPresets(updatedPresets);
    localStorage.setItem("userPresets", JSON.stringify(updatedPresets));
    setEditingPreset(null);
  };

  return (
    <div>
      <button
        onClick={() => setShowPresetList(!showPresetList)}
        className="text-sm text-blue-600 hover:underline"
      >
        {showPresetList ? "Hide Presets" : "Select Presets"}
      </button>

      {showPresetList && !editingPreset && (
        <ul className="mt-2 space-y-1">
          <li
            className="text-sm cursor-pointer hover:underline"
            onClick={() => {
              loadUserPreset(defaultPreset);
              setShowPresetList(false);
            }}
          >
            Default
          </li>
          {userPresets.map((preset) => (
            <li
              key={preset.id}
              className="flex justify-between items-center text-sm"
            >
              <span
                className="cursor-pointer hover:underline"
                onClick={() => {
                  loadUserPreset(preset);
                  setShowPresetList(false);
                }}
              >
                {preset.name}
              </span>
              <div>
                <button
                  onClick={() => setEditingPreset(preset)}
                  className="hover:bg-gray-200"
                >
                  ✏️
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete preset "${preset.name}"?`)) {
                      handlePresetDelete(preset.id);
                    }
                  }}
                  className="hover:bg-gray-200"
                >
                  ❌
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editingPreset && (
        <div className="mt-4 border p-4 rounded-lg space-y-2 bg-gray-50">
          <h3 className="text-sm font-semibold mb-2">Edit Preset</h3>

          <label className="block text-xs font-medium">Name</label>
          <input
            value={editingPreset.name}
            onChange={(e) => handlePresetFieldChange("name", e.target.value)}
            className="w-full border px-2 py-1 rounded text-sm"
          />

          <label className="block text-xs font-medium">Description</label>
          <textarea
            value={editingPreset.description}
            onChange={(e) =>
              handlePresetFieldChange("description", e.target.value)
            }
            className="w-full border px-2 py-1 rounded text-sm"
          />

          <label className="block text-xs font-medium">Thumbnail URL</label>
          <input
            value={editingPreset.thumbnail}
            onChange={(e) =>
              handlePresetFieldChange("thumbnail", e.target.value)
            }
            className="w-full border px-2 py-1 rounded text-sm"
          />

          <label className="block text-xs font-medium">Full Image URL</label>
          <input
            value={editingPreset.fullImage}
            onChange={(e) =>
              handlePresetFieldChange("fullImage", e.target.value)
            }
            className="w-full border px-2 py-1 rounded text-sm"
          />

          <div className="flex gap-2">
            <div>
              <label className="block text-xs font-medium">Subject (p1)</label>
              <input
                value={editingPreset.p1}
                onChange={(e) => handlePresetFieldChange("p1", e.target.value)}
                className="border px-2 py-1 rounded text-sm w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-medium">Object (p2)</label>
              <input
                value={editingPreset.p2}
                onChange={(e) => handlePresetFieldChange("p2", e.target.value)}
                className="border px-2 py-1 rounded text-sm w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-medium">
                Possessive (p3)
              </label>
              <input
                value={editingPreset.p3}
                onChange={(e) => handlePresetFieldChange("p3", e.target.value)}
                className="border px-2 py-1 rounded text-sm w-full"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setEditingPreset(null)}
              className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePreset}
              disabled={isSaveDisabled}
              className={`text-sm px-3 py-1 rounded ${
                isSaveDisabled
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePresets;
