const BASE_URL = "http://localhost:3000/posts";

// GET: Lấy danh sách bài viết
async function fetchPosts() {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const posts = await response.json();

    const postsContainer = document.getElementById("posts");
    if (!postsContainer) return;

    postsContainer.innerHTML = "";
    posts.forEach((post) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${post.id}</td>
        <td>${post.title}</td>
        <td>${post.views}</td>
        <td>
          <button onclick="editPost(${post.id}, '${post.title}', ${post.views})">Edit</button>
           <button onclick="deletePost(${post.id})" style="margin-left:5px;" class="btn btn-danger btn-sm">Delete</button>
        </td>
      `;
      postsContainer.appendChild(row);
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
  }
}

// POST: Thêm bài viết mới
async function addPost(event) {
  event.preventDefault();

  const idEl = document.getElementById("id");
  const titleEl = document.getElementById("title");
  const viewsEl = document.getElementById("views");
  const submitBtn = document.getElementById("addPost");

  const id = idEl.value.trim();
  const title = titleEl.value.trim();
  const views = Number(viewsEl.value.trim()) || 0;

  if (!title) {
    alert("Title không được để trống");
    titleEl.focus();
    return;
  }

  let payload = { title, views };
  if (id) {
    payload.id = Number(id);
  }

  try {
    submitBtn.disabled = true;

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    await response.json();
    event.target.reset();
    await fetchPosts();
  } catch (err) {
    console.error("Error adding post:", err);
    alert("Không thể thêm bài viết.");
  } finally {
    submitBtn.disabled = false;
  }
}

// PUT: Cập nhật bài viết
async function updatePost(id) {
  const title = prompt("Nhập title mới:");
  const views = prompt("Nhập views mới:");

  if (!title) return alert("Title không được để trống");

  const payload = { title, views: Number(views) || 0 };

  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    await fetchPosts();
  } catch (err) {
    console.error("Error updating post:", err);
    alert("Không thể cập nhật bài viết.");
  }
}

// Hàm gọi khi nhấn nút Edit
window.editPost = function(id, title, views) {
  updatePost(id);
};

// Hàm gọi khi nhấn nút Delete
window.deletePost = async function(id) {
  if (!confirm("Bạn có chắc muốn xóa bài viết này?")) return;
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await fetchPosts();
  } catch (err) {
    console.error("Error deleting post:", err);
    alert("Không thể xóa bài viết.");
  }
};

// Khởi tạo khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addPostForm");
  if (form) form.addEventListener("submit", addPost);

  fetchPosts();
});
