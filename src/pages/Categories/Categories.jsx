import React, { useState, useEffect } from "react";
import "./Categories.css";

import Loader from "../../components/Loader/Loader";
import { useAuthContext } from "../../contexts/auth";

const CategoryManager = () => {
  const { user } = useAuthContext();
  console.log(user);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories", {
        method: "GET",
        headers: { Authorization: user.token },
      });
      const data = await response.json();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = async () => {
    if (newCategory === "") return;

    const category = {
      value: newCategory,
      parent: parentCategory || null,
    };

    try {
      const response = await fetch("/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: user.token,
        },
        body: JSON.stringify(category),
      });
      if (response.ok) {
        fetchCategories();
        setNewCategory("");
        setParentCategory("");
      } else {
        console.error("Failed to add category");
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleEditCategory = async (id) => {
    if (!editingCategory) return;

    const updatedCategory = {
      value: editingCategory.value,
      parent: editingCategory.parent || "self",
    };

    try {
      const response = await fetch(`/categories/edit-category?id=${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: user.token,
        },
        body: JSON.stringify(updatedCategory),
      });
      if (response.ok) {
        fetchCategories();
        setEditingCategory(null);
      } else {
        console.log("Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(`/categories/delete-category/?id=${id}`, {
        method: "POST",
        headers: { Authorization: user.token },
      });

      if (response.ok) {
        fetchCategories();
      } else {
        console.error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  if (loading) {
    return (
      <div className="loader-div">
        <Loader />
      </div>
    );
  }

  return (
    <div className="custom-category-manager">
      <h2 className="custom-category-title">Manage Blog Categories</h2>
      <div className="custom-input-section">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New Category"
          className="custom-category-input"
        />
        <select
          value={parentCategory}
          onChange={(e) => setParentCategory(e.target.value)}
          className="custom-category-select"
        >
          <option value="">Select Parent Category (Optional)</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.value}>
              {cat.value}
            </option>
          ))}
        </select>
        <button onClick={handleAddCategory} className="custom-category-button">
          Add Category
        </button>
      </div>

      <ul className="custom-category-list">
        {categories.map((cat) => (
          <li key={cat._id} className="custom-category-item">
            {editingCategory && editingCategory._id === cat._id ? (
              <div className="custom-edit-section">
                <input
                  type="text"
                  value={editingCategory.value}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      value: e.target.value,
                    })
                  }
                  className="custom-edit-input"
                />
                <select
                  value={editingCategory.parent || ""}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      parent: e.target.value,
                    })
                  }
                  className="custom-edit-select"
                >
                  <option value="">No Parent</option>
                  {categories.map((parentCat) => (
                    <option key={parentCat._id} value={parentCat.value}>
                      {parentCat.value}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleEditCategory(cat._id)}
                  className="custom-save-button"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingCategory(null)}
                  className="custom-cancel-button"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="custom-view-section">
                {cat.value}
                <button
                  onClick={() => setEditingCategory(cat)}
                  className="custom-edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat._id)}
                  className="custom-delete-button"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManager;
