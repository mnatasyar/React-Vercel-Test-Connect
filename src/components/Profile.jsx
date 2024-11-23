// components/Profile.jsx
import { useState, useEffect } from "react";
import { profileService } from "../services/api";
import CourseCard from "./CourseCard";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [username, setUsername] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [favoriteCourses, setFavoriteCourses] = useState([]);

  useEffect(() => {
    loadProfile();
    fetchFavoriteCourses();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setProfile(data);
      setUsername(data.username);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile");
      setLoading(false);
    }
  };

  const fetchFavoriteCourses = async () => {
    try {
      const response = await fetch(
        "https://capstone-project-442014.et.r.appspot.com/api/favorites",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch favorite courses");
      const data = await response.json();
      setFavoriteCourses(data);
    } catch (error) {
      setError("Failed to load favorite courses");
      console.error("Error fetching favorite courses:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("username", username);
    if (selectedFile) {
      formData.append("profilePicture", selectedFile);
    }

    try {
      const data = await profileService.updateProfile(formData);
      setProfile(data);
      setSuccessMessage("Profile updated successfully!");
      setSelectedFile(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleToggleFavorite = async (course) => {
    try {
      const response = await fetch(
        "https://capstone-project-442014.et.r.appspot.com/api/favorites/toggle",
        {
          method: "POST",
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(course),
        }
      );

      if (!response.ok) throw new Error("Failed to update favorite");

      // Refresh favorite courses after toggling
      await fetchFavoriteCourses();
    } catch (error) {
      setError("Failed to update favorite");
      console.error("Error toggling favorite:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
          {successMessage}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                <img
                  src={
                    previewUrl ||
                    profile?.profile_picture ||
                    "/default-avatar.png"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />
              </div>
              <label
                htmlFor="profile-picture"
                className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <input
                  id="profile-picture"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {selectedFile && (
              <p className="text-sm text-gray-500">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={profile?.full_name || ""}
              className="w-full p-2 border rounded-lg bg-gray-50"
              readOnly
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={profile?.email || ""}
              className="w-full p-2 border rounded-lg bg-gray-50"
              readOnly
              disabled
            />
            <p className="mt-1 text-sm text-gray-500">
              Email cannot be changed
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Save Changes
          </button>
        </form>
      </div>

      {/* Favorite Courses Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Favorite Courses</h2>
        {favoriteCourses.length === 0 ? (
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <p className="text-gray-500">No favorite courses yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {favoriteCourses.map((course) => (
              <CourseCard
                key={course.course_id}
                course={{
                  id: course.course_id,
                  title: course.course_title,
                  shortIntro: `${course.category} - ${course.sub_category}`,
                  url: course.course_url,
                  duration: course.duration,
                  category: course.category,
                  subCategory: course.sub_category,
                }}
                isFavorited={true}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
